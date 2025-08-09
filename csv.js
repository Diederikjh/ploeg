// csv.js - CSV export functionality

function exportToCsv(data) {
  if (data.length === 0) return;
  
  const csvContent = generateCsvContent(data);
  downloadCsv(csvContent, "electricity_bills.csv");
}

function generateCsvContent(data) {
  const headers = [
    "filename",
    "start_date", 
    "end_date",
    "total_consumption_kwh",
    "daily_average_kwh", 
    "total_charge",
    "tier_1_kwh",
    "tier_1_rate", 
    "tier_2_kwh",
    "tier_2_rate",
    "tier_3_kwh", 
    "tier_3_rate"
  ];
  
  const rows = data.map(bill => [
    bill.filename,
    bill.start_date?.toLocaleDateString() || "",
    bill.end_date?.toLocaleDateString() || "",
    bill.total_consumption_kwh || "",
    bill.daily_average_kwh || "",
    bill.total_charge || "",
    bill.rates[0]?.kwh || "",
    bill.rates[0]?.rate || "",
    bill.rates[1]?.kwh || "",
    bill.rates[1]?.rate || "",
    bill.rates[2]?.kwh || "",
    bill.rates[2]?.rate || ""
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");
}

function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Export for Node.js testing
if (typeof module !== "undefined") {
  module.exports = { exportToCsv, generateCsvContent, downloadCsv };
}