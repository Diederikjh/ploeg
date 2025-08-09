// pdf.js config

 // Loaded via <script> tag, create shortcut to access PDF.js exports.
var { pdfjsLib } = globalThis;

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const exportCsvBtn = document.getElementById("exportCsvBtn");

// Drag & drop handling
dropZone.addEventListener("click", () => fileInput.click());
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

async function handleFiles(fileList) {

  const parsedBills = [];

  for (let file of fileList) {
    if (file.type !== "application/pdf") continue;
    console.log(`Processing: ${file.name}`);
    const textContent = await extractPdfText(file);
    const parsed = window.parseBillText(file.name, textContent);
    parsedBills.push(parsed);
  }

  // Sort by start date
  parsedBills.sort((a, b) => a.start_date - b.start_date);
  
  // Store data globally and show export button
  billData = parsedBills;
  exportCsvBtn.style.display = billData.length > 0 ? "block" : "none";
  
  renderCharts(parsedBills);
}

async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

let billData = [];

// CSV export functionality
exportCsvBtn.addEventListener("click", exportToCsv);

function exportToCsv() {
  if (billData.length === 0) return;
  
  const csvContent = generateCsvContent(billData);
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
