const { describe, it } = require('node:test');
const assert = require('node:assert');
const { calculateShippingCost: calcOriginal } = require('./calculateShippingCost_ORIGINAL');
const { calculateShippingCost: calcStrategy } = require('./calculateShippingCost_STRATEGY');

const pkg = { weight: 5, length: 10, width: 10, height: 10 }; // volume 1000

describe('Shipping cost: original vs Strategy (behavior preserved)', () => {
  it('USA standard', () => {
    assert.strictEqual(calcOriginal(pkg, 'USA', 'standard'), '12.50');
    assert.strictEqual(calcStrategy(pkg, 'USA', 'standard'), '12.50');
  });
  it('Canada express', () => {
    assert.strictEqual(calcOriginal(pkg, 'Canada', 'express'), '27.50');
    assert.strictEqual(calcStrategy(pkg, 'Canada', 'express'), '27.50');
  });
  it('Mexico standard', () => {
    assert.strictEqual(calcOriginal(pkg, 'Mexico', 'standard'), '20.00');
    assert.strictEqual(calcStrategy(pkg, 'Mexico', 'standard'), '20.00');
  });
  it('International overnight not available', () => {
    const msg = 'Overnight shipping not available for this destination';
    assert.strictEqual(calcOriginal(pkg, 'UK', 'overnight'), msg);
    assert.strictEqual(calcStrategy(pkg, 'UK', 'overnight'), msg);
  });
  it('USA overnight', () => {
    assert.strictEqual(calcOriginal(pkg, 'USA', 'overnight'), '47.50');
    assert.strictEqual(calcStrategy(pkg, 'USA', 'overnight'), '47.50');
  });
  it('standard dimensional surcharge (light + large volume)', () => {
    const smallHeavy = { weight: 1, length: 15, width: 15, height: 5 }; // 1125 > 1000
    assert.strictEqual(calcOriginal(smallHeavy, 'USA', 'standard'), '7.50'); // 2.5 + 5
    assert.strictEqual(calcStrategy(smallHeavy, 'USA', 'standard'), '7.50');
  });
});
