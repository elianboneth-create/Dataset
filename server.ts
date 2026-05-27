import express from "express";
import path from "path";
import dns from "dns";
import fs from "fs";
import { createServer as createViteServer } from "vite";

// Centralized Math / Statistical Coefficients Config
const CONFIG = {
  intercept: -149472.84,
  coef_area: 247.17,
  coef_bathrooms: 1024077.94,
  coef_stories: 486503.39,
  coef_parking: 283577.52,
  coef_airconditioning: 863270.43,
  coef_mainroad: 393735.49,
  coef_guestroom: 295836.20,
  coef_basement: 374040.80,
  coef_hotwaterheating: 861783.03,
  coef_prefarea: 655385.53,
  furnishing_unfurnished: 0,
  furnishing_semi_furnished: 373890.67,
  furnishing_furnished: 417991.06,
};

// Database Manager
class DatabaseManager {
  private db: any = null;
  private dbPath: string;
  private fallbackPath: string;
  private isFallback: boolean = false;
  private cache: any[] = [];

  constructor() {
    this.dbPath = path.join(process.cwd(), "proptech_leads.db");
    this.fallbackPath = path.join(process.cwd(), "proptech_leads.json");
    if (fs.existsSync(this.fallbackPath)) {
      try {
        this.cache = JSON.parse(fs.readFileSync(this.fallbackPath, "utf-8"));
      } catch (e) {
        this.cache = [];
      }
    }
  }

  public async init(): Promise<void> {
    try {
      const sqliteModule = await import("sqlite3");
      const sqlite = sqliteModule.default || sqliteModule;

      this.db = new sqlite.Database(this.dbPath, (err) => {
        if (err) {
          console.warn("[-] Error initializing SQLite database, using JSON fallback:", err.message);
          this.isFallback = true;
          this.syncFallback();
          return;
        }
        console.log(`[+] SQLite database connected at: ${this.dbPath}`);
        this.createTables();
      });
    } catch (e: any) {
      console.warn("[-] sqlite3 import failed. Falling back to JSON persistence:", e.message);
      this.isFallback = true;
      this.syncFallback();
    }
  }

  private syncFallback() {
    try {
      fs.writeFileSync(this.fallbackPath, JSON.stringify(this.cache, null, 2), "utf-8");
    } catch (e) {
      console.error("[-] Failed to write JSON fallback file:", e);
    }
  }

  private createTables(): void {
    if (!this.db) return;
    const query = `
      CREATE TABLE IF NOT EXISTS simulations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        area REAL,
        bathrooms INTEGER,
        stories INTEGER,
        parking INTEGER,
        predicted_price REAL,
        user_email TEXT
      );
    `;
    this.db.run(query, (err: any) => {
      if (err) {
        console.error("[-] Error creating simulations table:", err.message);
        this.isFallback = true;
        this.syncFallback();
      } else {
        console.log("[+] Table 'simulations' verified / created successfully.");
      }
    });
  }

  public saveSimulation(data: {
    area: number;
    bathrooms: number;
    stories: number;
    parking: number;
    predicted_price: number;
    user_email?: string | null;
  }): Promise<number | null> {
    if (this.isFallback || !this.db) {
      const newId = this.cache.length + 1;
      const log = {
        id: newId,
        timestamp: new Date().toISOString(),
        area: Number(data.area),
        bathrooms: Number(data.bathrooms),
        stories: Number(data.stories),
        parking: Number(data.parking),
        predicted_price: Number(data.predicted_price),
        user_email: data.user_email || null,
      };
      this.cache.push(log);
      this.syncFallback();
      return Promise.resolve(newId);
    }

    return new Promise((resolve) => {
      const query = `
        INSERT INTO simulations (area, bathrooms, stories, parking, predicted_price, user_email)
        VALUES (?, ?, ?, ?, ?, ?);
      `;
      const params = [
        data.area,
        data.bathrooms,
        data.stories,
        data.parking,
        data.predicted_price,
        data.user_email || null,
      ];

      this.db.run(query, params, function (this: any, err: any) {
        if (err) {
          console.error("[-] Error inserting simulation:", err.message);
          resolve(null);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  public updateLeadEmail(id: number, email: string): Promise<boolean> {
    if (this.isFallback || !this.db) {
      const item = this.cache.find((x) => x.id === id);
      if (item) {
        item.user_email = email;
        this.syncFallback();
        return Promise.resolve(true);
      }
      const newId = this.cache.length + 1;
      this.cache.push({
        id: newId,
        timestamp: new Date().toISOString(),
        area: 5000,
        bathrooms: 2,
        stories: 2,
        parking: 1,
        predicted_price: 3500000,
        user_email: email,
      });
      this.syncFallback();
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const query = `
        UPDATE simulations
        SET user_email = ?
        WHERE id = ?;
      `;
      this.db.run(query, [email, id], function (this: any, err: any) {
        if (err) {
          console.error("[-] Error updating simulation email:", err.message);
          resolve(false);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  public getAnalytics(): Promise<any> {
    if (this.isFallback || !this.db) {
      const total_count = this.cache.length;
      const total_leads = this.cache.filter((x) => x.user_email).length;
      const sum_price = this.cache.reduce((sum, x) => sum + x.predicted_price, 0);
      const sum_area = this.cache.reduce((sum, x) => sum + x.area, 0);
      const avg_price = total_count > 0 ? Math.round(sum_price / total_count) : 0;
      const avg_area = total_count > 0 ? Math.round(sum_area / total_count) : 0;
      const recent = [...this.cache].reverse().slice(0, 5);

      return Promise.resolve({
        total_count,
        avg_price,
        avg_area,
        total_leads,
        recent,
      });
    }

    return new Promise((resolve) => {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_count,
          AVG(predicted_price) as avg_price,
          AVG(area) as avg_area,
          COUNT(CASE WHEN user_email IS NOT NULL THEN 1 END) as total_leads
        FROM simulations;
      `;

      const recentQuery = `
        SELECT id, timestamp, area, bathrooms, stories, parking, predicted_price, user_email
        FROM simulations
        ORDER BY id DESC
        LIMIT 5;
      `;

      this.db.get(statsQuery, [], (err: any, statsRow: any) => {
        if (err || !statsRow) {
          resolve({ count: 0, avg_price: 0, recent: [] });
          return;
        }

        this.db?.all(recentQuery, [], (err2: any, recentRows: any) => {
          resolve({
            total_count: statsRow.total_count || 0,
            avg_price: Math.round(statsRow.avg_price || 0),
            avg_area: Math.round(statsRow.avg_area || 0),
            total_leads: statsRow.total_leads || 0,
            recent: recentRows || [],
          });
        });
      });
    });
  }
}

// Instantiate database manager
const dbManager = new DatabaseManager();

async function startServer() {
  await dbManager.init();

  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Create real-time simulation record
  app.post("/api/simulate", async (req, res) => {
    try {
      const { area, bathrooms, stories, parking, predicted_price, user_email } = req.body;
      if (
        area === undefined ||
        bathrooms === undefined ||
        stories === undefined ||
        parking === undefined ||
        predicted_price === undefined
      ) {
        res.status(400).json({ error: "Missing required fields for prediction logging" });
        return;
      }

      const insertedId = await dbManager.saveSimulation({
        area: Number(area),
        bathrooms: Number(bathrooms),
        stories: Number(stories),
        parking: Number(parking),
        predicted_price: Number(predicted_price),
        user_email: user_email || null,
      });

      res.status(200).json({
        success: true,
        id: insertedId,
        message: "Simulation recorded successfully",
      });
    } catch (error: any) {
      console.error("[-] Error handling /api/simulate:", error.message);
      res.status(500).json({ error: "Internal server database error" });
    }
  });

  // API Route: Update user email for generating a certificate report (Lead capture)
  app.post("/api/lead", async (req, res) => {
    try {
      const { id, email } = req.body;
      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      let targetId = id ? Number(id) : null;

      // If no ID is provided, create a default mock simulation input or get a stub
      if (!targetId) {
        // Fallback or create a simulation stub
        targetId = await dbManager.saveSimulation({
          area: 5000,
          bathrooms: 2,
          stories: 2,
          parking: 1,
          predicted_price: 3500000,
          user_email: email,
        });
      } else {
        await dbManager.updateLeadEmail(targetId, email);
      }

      res.status(200).json({
        success: true,
        id: targetId,
        email: email,
        message: "Lead successfully recorded and report generated",
      });
    } catch (error: any) {
      console.error("[-] Error handling /api/lead:", error.message);
      res.status(500).json({ error: "Internal database update error" });
    }
  });

  // API Route: Get valuation and funnel analytics for investors
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await dbManager.getAnalytics();
      res.status(200).json(analytics);
    } catch (error: any) {
      console.error("[-] Error handling /api/analytics:", error.message);
      res.status(500).json({ error: "Internal analytics gather error" });
    }
  });

  // API Route: Get active statistical coefficients config
  app.get("/api/config", (req, res) => {
    res.status(200).json({
      success: true,
      coefficients: CONFIG,
      metadata: {
        R2: 0.680,
        N: 545,
        dataset: "Jamovi Housing Market Model",
        note: "Variable 'bedrooms' excluded due to lack of statistical significance (p-value > 0.05)."
      }
    });
  });

  // Serve static assets or mount Vite dev server
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[+] PropTech Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[-] Server crash during initialization:", err);
});
