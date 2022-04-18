const {getCalculatedPrice, getPrecentageSaved} = require('../utils');


test('Getting Calculated Price', () => {
    expect(getCalculatedPrice(100)).toBe(95);
  });


test('Get precentage',() => {
    expect(getPrecentageSaved(120, 200)).toBe("40.00%");
});
