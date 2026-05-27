/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ValuationInputs, ModelCoefficients, ValuationResult } from "./types";

export const COEFFICIENTS: ModelCoefficients = {
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

export function calculateValuation(inputs: ValuationInputs): ValuationResult {
  const {
    area,
    bathrooms,
    stories,
    parking,
    airconditioning,
    mainroad,
    guestroom,
    basement,
    hotwaterheating,
    prefarea,
    furnishingstatus,
  } = inputs;

  // Contributions
  const interceptVal = COEFFICIENTS.intercept;
  const areaVal = area * COEFFICIENTS.coef_area;
  const bathroomsVal = bathrooms * COEFFICIENTS.coef_bathrooms;
  const storiesVal = stories * COEFFICIENTS.coef_stories;
  const parkingVal = parking * COEFFICIENTS.coef_parking;
  
  const acVal = airconditioning ? COEFFICIENTS.coef_airconditioning : 0;
  const mainroadVal = mainroad ? COEFFICIENTS.coef_mainroad : 0;
  const guestroomVal = guestroom ? COEFFICIENTS.coef_guestroom : 0;
  const basementVal = basement ? COEFFICIENTS.coef_basement : 0;
  const hotwaterVal = hotwaterheating ? COEFFICIENTS.coef_hotwaterheating : 0;
  const prefareaVal = prefarea ? COEFFICIENTS.coef_prefarea : 0;

  let furnishingVal = 0;
  if (furnishingstatus === "semi-furnished") {
    furnishingVal = COEFFICIENTS.furnishing_semi_furnished;
  } else if (furnishingstatus === "unfurnished") {
    furnishingVal = COEFFICIENTS.furnishing_unfurnished;
  } else if (furnishingstatus === "furnished") {
    furnishingVal = COEFFICIENTS.furnishing_furnished;
  }

  // Calculate total price
  const predictedPrice =
    interceptVal +
    areaVal +
    bathroomsVal +
    storiesVal +
    parkingVal +
    acVal +
    mainroadVal +
    guestroomVal +
    basementVal +
    hotwaterVal +
    prefareaVal +
    furnishingVal;

  // Commercial Confidence Range (+/- 5%)
  const minPrice = predictedPrice * 0.95;
  const maxPrice = predictedPrice * 1.05;

  // Dynamic Contributions List for Waterfall/Contribution rendering
  const details = [
    { name: "Intercepto Base", value: interceptVal },
    { name: "Área Terreno", value: areaVal },
    { name: "Baños Completos", value: bathroomsVal },
    { name: "Pisos / Plantas", value: storiesVal },
    { name: "Cochera / Parking", value: parkingVal },
    { name: "Aire Acondicionado", value: acVal },
    { name: "Acceso Vía Principal", value: mainroadVal },
    { name: "Cuarto Huéspedes", value: guestroomVal },
    { name: "Sótano Equipado", value: basementVal },
    { name: "Calefón / Boiler", value: hotwaterVal },
    { name: "Ubicación Premium", value: prefareaVal },
    { name: "Amoblado (Ajuste)", value: furnishingVal },
  ];

  // Map to absolute/cumulative heights for chart plotting
  let runningSum = 0;
  const contributions = details.map((item) => {
    runningSum += item.value;
    return {
      name: item.name,
      value: item.value,
      cumulative: runningSum,
    };
  });

  return {
    predictedPrice,
    minPrice,
    maxPrice,
    contributions,
  };
}
