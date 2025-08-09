// tests/testParsing.js
const { parseBillText } = require("../parsing");  // <-- note the relative path


function assertAlmostEqual(actual, expected, tol = 1e-6) {
  if (Math.abs(actual - expected) > tol) {
    throw new Error(`Assertion failed: ${actual} != ${expected}`);
  }
}

function assertDateEqual(actual, expected) {
  if (!(actual instanceof Date)) {
    throw new Error(`Expected a Date object but got ${typeof actual}`);
  }
  if (actual.getTime() !== expected.getTime()) {
    throw new Error(`Date mismatch: expected ${expected.toISOString()}, got ${actual.toISOString()}`);
  }
}

function runTests() {
  console.log("Running tests...");

  simpleTextPDF();
  realBillTextPDF();


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


function realBillTextPDF() {
const sampleText = `
1 of 3  12341234 12341234 1001921557 Tel: International calls +27 21 401 4701 E-mail : accounts@capetown.gov.za Correspondence: Director : Revenue, P O Box 655, Cape Town 8000 Web address:www.capetown.gov.za Tel: 086 010 3089  Tax invoice number Customer VAT registration number Account number Distribution code Business partner number Computer generated copy tax invoice REDACTED REDACTED  Page Civic Centre 12 Hertzog Boulevard 8001 PO Box 655 Cape Town 8000 VAT registration number 4500193497  REDACTED  Pay points: City of Cape Town cash offices or the vendors below: 91555123412348>>>>> 12341234  7022.09 7022.00 0.09  Account number  Total due if not paid in cash Amount due if paid in cash Rounded down amount carried forward to next invoice  1. Payment options (a) Debit orders: Call 0860 103 089 or visit a Customer Service Centre.(b) Internet payments: Visit  www.Easypay.co.za or scan the QR code. (c)  Electronic payments (EFT): Select the City of Cape Town as a bank-listed beneficiary on your bank's website. Use only your nine-digit municipal account number as reference (d) Direct deposit at Nedbank: Please present your account number 123412341234 to the bank teller. (e) Cash, debit card, credit card and other: Please present your account to the cashier. 2. Where the City incurs bank costs on any mode of payment, the City will recover such cost on the portion of the amount above R7000.00 per transaction per account number. The City absorbs such costs in respect of a single payment of R7000.00 and below. 3. Interest will be charged on all amounts still outstanding after the due date. 4. You may not withhold payment, even if you have submitted a query to the City concerning this account. 5. Failure to pay could result in; (a) The City recovering debt overdue on the purchasing of pre-paid electricity,(b) your water and/or electricity supply being disconnected/restricted. Immediate reconnection  of the supply after payment cannot be guaranteed. A disconnection fee will be charged and your deposit amount might be increased. 6.Pay and renew your motor vehicle licence online: https://eservices.capetown.gov.za/irj/portal 7137.04  18/03/2025 Account summary as at 21/02/2025  Previous account balance  At REDACTED / Erf ??? Due date  7137.04-  0.00 7022.09  Less payments (25/01/2025)  7022.09 Current amount due (b) Total liability (a)  Latest account - see overleaf   7022.09 Total (a) + (b) above   7022.09 Thank you  Payable by 18/03/2025 Total (a) + (b) 7022.09  Please note:\n 2 of 3  Account details as at 21/02/2025   123412341234 Account number  Page  PROPERTY RATES ( Period 23/01/2025 to 21/02/2025 ) 30 Days At REDACTED / Erf ????  Residential Rateable portion of valuation From : 23/01/2025 R 2200 - R 1500 = R 21850 # From 23/01/2025 : R 218.00 @ 0.0066310 ÷ 365 x 30   0090.85 Additional rebate credit # From 23/01/2025 : R 430.00 @ 0.0066310 ÷ 365 x 30   20.08-  953.77 ELECTRICITY ( Period 18/01/2025 to 18/02/2025 -  32 Days ) (Actual reading) At REDACTED / Erf ???? Meter no: 4321 / Consumption 889.000 kWh / Daily average 27.781 kWh  Consumption charge: Home User &   (1) 631.2330 kWh @ R 2.9870 (2) 257.7670 kWh @ R 4.1338   2951.05 &   Home User Charge   245.03  3196.08 WATER ( Period 17/01/2025 to 17/02/2025 -  32 Days ) (Actual reading) At REDACTED / Erf ???? Meter no: 4321 / Consumption 34.000 kl / Daily average 1.063 kl  Consumption charge (domestic) &   (1) 6.3120 kl @ R 19.5900 (2) 4.7350 kl @ R 26.9200 (3) 22.9530 kl @ R 36.5800   1090.74 &   Fixed Basic Charge ( 20mm - 35159356 ) R 135.54 x 1   135.54  1226.28 REFUSE ( Period 23/01/2025 to 21/02/2025 ) 30 Days At REDACTED / Erf ???  &   Refuse charge ( 1 X 240lBIN X 1 Removals )   166.26  166.26 SEWERAGE ( Period 17/01/2025 to 17/02/2025 -  32 Days ) (Actual reading) At REDACTED / Erf ????  Disposal charge &   (1) 4.4190 kl @ R 17.2100 (2) 3.3140 kl @ R 23.6500 (3) 16.0670 kl @ R 33.2200   688.18  688.18\n 3 of 3  Account details as at 21/02/2025   123412341234 Account number  Page  Add 15% VAT on amounts marked with & above   791.52 0% VAT on amounts marked with # above Current account: Total due   7022.09 Meter details   Previous reading   New reading   Units used  ELECTRICITY   959439   001   62348.000kWh   (Actual)   63237.000kWh   (Actual)   889.000kWh WATER   35159356   001   3570.000kl   (Actual)   3604.000kl   (Actual)   34.000kl\n"
`;

    const result = parseBillText("real_bill.pdf", sampleText);

    const expectedStartDate = new Date(2025, 0, 18); // January is month 0
    const expectedEndDate = new Date(2025, 1, 18);   // February is month 1

    try {
        assertAlmostEqual(result.total_consumption_kwh, 889);
        assertAlmostEqual(result.daily_average_kwh, 27.781);
        assertAlmostEqual(result.total_charge, 2951.05);
        if (result.rates.length !== 2) throw new Error("Expected 2 rates");
        assertAlmostEqual(result.rates[0].kwh, 631.233);
        assertAlmostEqual(result.rates[0].rate, 2.987);
        assertAlmostEqual(result.rates[1].kwh, 257.767);
        assertAlmostEqual(result.rates[1].rate, 4.1338);

        assertDateEqual(result.start_date, expectedStartDate);
        assertDateEqual(result.end_date, expectedEndDate);

        console.log("All tests passed!");
    } catch (e) {
        console.error("Test failed:", e.message);
    }

}

