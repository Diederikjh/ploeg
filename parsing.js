function parseBillText(filename, text) {
  const data = {
    filename,
    total_consumption_kwh: null,
    daily_average_kwh: null,
    total_charge: null,
    rates: []
  };

  // Match total consumption
  const consumptionMatch = text.match(/Consumption\s+(\d+\.\d+)\s+kWh/i);
  if (consumptionMatch) {
    data.total_consumption_kwh = parseFloat(consumptionMatch[1]);
  }

  // Match daily average
  const dailyAvgMatch = text.match(/Daily average\s+([\d.]+)\s+kWh/i);
  if (dailyAvgMatch) {
    data.daily_average_kwh = parseFloat(dailyAvgMatch[1]);
  }

  // Match tiered rates
  const rateMatches = [...text.matchAll(/\(\d+\)\s+(\d+\.\d+)\s+kWh\s+@\s+R\s+(\d+\.\d+)/gi)];
  for (let m of rateMatches) {
    data.rates.push({
      kwh: parseFloat(m[1]),
      rate: parseFloat(m[2])
    });
  }

 // Extract total charge by number just before '&   Home User Charge '
  const totalChargeMatch = text.match(/(\d+(?:\.\d+)?)\s*&\s+Home User Charge /);
  if (totalChargeMatch) {
    data.total_charge = parseFloat(totalChargeMatch[1]);
  }

  console.log("Extracted data:", data);

  return data
}

// Export for Node.js testing
if (typeof module !== "undefined") {
  module.exports = { parseBillText };
}