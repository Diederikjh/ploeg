// tests/testCsv.js
const { generateCsvContent } = require("../csv");

function assertDeepEqual(actual, expected, message = "") {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    throw new Error(`${message}\nExpected: ${expectedStr}\nActual: ${actualStr}`);
  }
}

function assertContains(text, substring, message = "") {
  if (!text.includes(substring)) {
    throw new Error(`${message}\nExpected "${text}" to contain "${substring}"`);
  }
}

function runCsvTests() {
  console.log("Running CSV tests...");

  testCsvHeaders();
  testCsvRowFormatting();
  testMissingDataHandling();
  testMultipleBills();
  testEmptyDataArray();

  console.log("All CSV tests passed!");
}

function testCsvHeaders() {
  console.log("Testing CSV headers...");
  
  const sampleData = [{
    filename: "test.pdf",
    start_date: new Date(2025, 0, 1),
    end_date: new Date(2025, 0, 31),
    total_consumption_kwh: 100,
    daily_average_kwh: 3.2,
    total_charge: 500,
    rates: [
      { kwh: 50, rate: 2.5 },
      { kwh: 50, rate: 3.0 }
    ]
  }];

  const csv = generateCsvContent(sampleData);
  const lines = csv.split("\n");
  const headers = lines[0];

  const expectedHeaders = [
    "filename", "start_date", "end_date", "total_consumption_kwh",
    "daily_average_kwh", "total_charge", "tier_1_kwh", "tier_1_rate",
    "tier_2_kwh", "tier_2_rate", "tier_3_kwh", "tier_3_rate"
  ];

  expectedHeaders.forEach(header => {
    assertContains(headers, `"${header}"`, `Header should contain ${header}`);
  });
}

function testCsvRowFormatting() {
  console.log("Testing CSV row formatting...");
  
  const sampleData = [{
    filename: "bill_jan_2025.pdf",
    start_date: new Date(2025, 0, 1),
    end_date: new Date(2025, 0, 31),
    total_consumption_kwh: 1203.5,
    daily_average_kwh: 38.8,
    total_charge: 4203.82,
    rates: [
      { kwh: 670.685, rate: 2.987 },
      { kwh: 532.815, rate: 4.1338 }
    ]
  }];

  const csv = generateCsvContent(sampleData);
  const lines = csv.split("\n");
  const dataRow = lines[1];

  // Test specific values are present
  assertContains(dataRow, '"bill_jan_2025.pdf"', "Filename should be quoted");
  assertContains(dataRow, '"1203.5"', "Consumption should be included");
  assertContains(dataRow, '"4203.82"', "Total charge should be included");
  assertContains(dataRow, '"670.685"', "Tier 1 kWh should be included");
  assertContains(dataRow, '"2.987"', "Tier 1 rate should be included");
  
  // Test dates are formatted (Node.js uses different locale than browser)
  // Just check that dates are present and not empty
  const parts = dataRow.split(',');
  if (parts[1] === '""' || parts[2] === '""') {
    throw new Error("Dates should not be empty");
  }
}

function testMissingDataHandling() {
  console.log("Testing missing data handling...");
  
  const incompleteData = [{
    filename: "incomplete.pdf",
    start_date: null,
    end_date: undefined,
    total_consumption_kwh: 500,
    daily_average_kwh: null,
    total_charge: undefined,
    rates: [
      { kwh: 300, rate: 2.5 }
      // Missing second tier
    ]
  }];

  const csv = generateCsvContent(incompleteData);
  const lines = csv.split("\n");
  const dataRow = lines[1];
  
  // Should handle missing/null values gracefully
  assertContains(dataRow, '"incomplete.pdf"', "Filename should be present");
  assertContains(dataRow, '"500"', "Available consumption should be present");
  
  // Count commas to ensure all fields are present (even if empty)
  const commaCount = (dataRow.match(/,/g) || []).length;
  if (commaCount !== 11) { // 12 fields = 11 commas
    throw new Error(`Expected 11 commas in CSV row, got ${commaCount}`);
  }
}

function testMultipleBills() {
  console.log("Testing multiple bills...");
  
  const multipleData = [
    {
      filename: "jan_2025.pdf",
      start_date: new Date(2025, 0, 1),
      end_date: new Date(2025, 0, 31),
      total_consumption_kwh: 1000,
      daily_average_kwh: 32.3,
      total_charge: 3500,
      rates: [{ kwh: 500, rate: 2.5 }, { kwh: 500, rate: 3.0 }]
    },
    {
      filename: "feb_2025.pdf",
      start_date: new Date(2025, 1, 1),
      end_date: new Date(2025, 1, 28),
      total_consumption_kwh: 890,
      daily_average_kwh: 31.8,
      total_charge: 3100,
      rates: [{ kwh: 450, rate: 2.5 }, { kwh: 440, rate: 3.0 }]
    }
  ];

  const csv = generateCsvContent(multipleData);
  const lines = csv.split("\n");
  
  // Should have header + 2 data rows
  if (lines.length !== 3) {
    throw new Error(`Expected 3 lines (1 header + 2 data), got ${lines.length}`);
  }
  
  assertContains(lines[1], '"jan_2025.pdf"', "First bill should be present");
  assertContains(lines[2], '"feb_2025.pdf"', "Second bill should be present");
}

function testEmptyDataArray() {
  console.log("Testing empty data array...");
  
  const emptyData = [];
  const csv = generateCsvContent(emptyData);
  const lines = csv.split("\n");
  
  // Should only have headers
  if (lines.length !== 1) {
    throw new Error(`Expected 1 line (headers only), got ${lines.length}`);
  }
  
  // Headers should still be present
  assertContains(lines[0], '"filename"', "Headers should be present even with no data");
}

runCsvTests();