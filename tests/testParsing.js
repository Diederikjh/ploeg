// tests/testParsing.js
const { parseBillText } = require("../parsing");  // <-- note the relative path


function assertAlmostEqual(actual, expected, tol = 1e-6) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`Assertion failed: ${actual} != ${expected}`);
  }
}

function runTests() {
  console.log("Running tests...");

  simpleTextPDF();
}

runTests();
function simpleTextPDF() {
    const sampleText = `
Meter no: 959439 / Consumption 1203.000 kWh / Daily average 35.382 kWh
(1) 670.6850 kWh @ R 2.9870 (2) 532.3150 kWh @ R 4.1338    4203.82 &   Home User Charge 
`;

    const result = parseBillText("dummy.pdf", sampleText);

    try {
        assertAlmostEqual(result.total_consumption_kwh, 1203);
        assertAlmostEqual(result.daily_average_kwh, 35.382);
        assertAlmostEqual(result.total_charge, 4203.82);
        if (result.rates.length !== 2) throw new Error("Expected 2 rates");
        assertAlmostEqual(result.rates[0].kwh, 670.685);
        assertAlmostEqual(result.rates[0].rate, 2.987);
        assertAlmostEqual(result.rates[1].kwh, 532.315);
        assertAlmostEqual(result.rates[1].rate, 4.1338);

        console.log("All tests passed!");
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}

