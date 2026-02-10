/**
 * Shipping cost calculator using Strategy pattern.
 * Each shipping method is a strategy; adding a new method = add a new strategy, no changes to context.
 */

const RATES = {
  USA: { standard: 2.5, express: 4.5, overnight: 9.5 },
  Canada: { standard: 3.5, express: 5.5, overnight: 12.5 },
  Mexico: { standard: 4.0, express: 6.0, overnight: null },
  international: { standard: 4.5, express: 7.5, overnight: null }
};

function getRegion(country) {
  return RATES[country] || RATES.international;
}

function standardStrategy(packageDetails, destinationCountry) {
  const { weight, length, width, height } = packageDetails;
  const region = getRegion(destinationCountry);
  let cost = weight * region.standard;
  if (weight < 2 && (length * width * height) > 1000) cost += 5.0;
  return cost;
}

function expressStrategy(packageDetails, destinationCountry) {
  const { weight, length, width, height } = packageDetails;
  const region = getRegion(destinationCountry);
  let cost = weight * region.express;
  if ((length * width * height) > 5000) cost += 15.0;
  return cost;
}

function overnightStrategy(packageDetails, destinationCountry) {
  const { weight } = packageDetails;
  const region = getRegion(destinationCountry);
  if (region.overnight == null) return null;
  return weight * region.overnight;
}

const strategies = {
  standard: standardStrategy,
  express: expressStrategy,
  overnight: overnightStrategy
};

function calculateShippingCost(packageDetails, destinationCountry, shippingMethod) {
  const strategy = strategies[shippingMethod];
  if (!strategy) return (0).toFixed(2);
  const cost = strategy(packageDetails, destinationCountry);
  if (cost == null) return "Overnight shipping not available for this destination";
  return cost.toFixed(2);
}

module.exports = {
  calculateShippingCost,
  getRegion,
  strategies
};
