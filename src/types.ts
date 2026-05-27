/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ValuationInputs {
  area: number;
  bathrooms: number;
  stories: number;
  parking: number;
  airconditioning: boolean;
  mainroad: boolean;
  guestroom: boolean;
  basement: boolean;
  hotwaterheating: boolean;
  prefarea: boolean;
  furnishingstatus: "unfurnished" | "semi-furnished" | "furnished";
}

export interface ModelCoefficients {
  intercept: number;
  coef_area: number;
  coef_bathrooms: number;
  coef_stories: number;
  coef_parking: number;
  coef_airconditioning: number;
  coef_mainroad: number;
  coef_guestroom: number;
  coef_basement: number;
  coef_hotwaterheating: number;
  coef_prefarea: number;
  furnishing_unfurnished: number;
  furnishing_semi_furnished: number;
  furnishing_furnished: number;
}

export interface ValuationResult {
  predictedPrice: number;
  minPrice: number;
  maxPrice: number;
  contributions: {
    name: string;
    value: number;
    cumulative: number;
  }[];
}

export interface AnalyticsSummary {
  total_count: number;
  avg_price: number;
  avg_area: number;
  total_leads: number;
  recent: Array<{
    id: number;
    timestamp: string;
    area: number;
    bathrooms: number;
    stories: number;
    parking: number;
    predicted_price: number;
    user_email?: string;
  }>;
}
