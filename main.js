// pdf.js config

 // Loaded via <script> tag, create shortcut to access PDF.js exports.
var { pdfjsLib } = globalThis;

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

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

let usageChart, rateBreakdownChart, chargeChart;

function renderCharts(data) {
  const labels = data.map(d => d.start_date.toLocaleDateString());

  // Consumption & daily average
  const totalConsumptionData = data.map(d => d.total_consumption_kwh);
  const dailyAverageData = data.map(d => d.daily_average_kwh);

  // Total charge
  const totalChargeData = data.map(d => d.total_charge);

  // Tiered usage datasets
  const maxTiers = Math.max(...data.map(d => d.rates.length));
  const rateDatasets = [];

  for (let tierIndex = 0; tierIndex < maxTiers; tierIndex++) {
    rateDatasets.push({
      label: `Tier ${tierIndex + 1} usage (kWh)`,
      data: data.map(d => (d.rates[tierIndex]?.kwh) || 0),
      backgroundColor: `hsl(${tierIndex * 60}, 70%, 60%)`
    });
  }

  // Destroy previous charts if any
  if (usageChart) usageChart.destroy();
  if (rateBreakdownChart) rateBreakdownChart.destroy();
  if (chargeChart) chargeChart.destroy();

  // Usage chart
  usageChart = new Chart(document.getElementById('usageChart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Total Consumption (kWh)',
          data: totalConsumptionData,
          borderColor: 'blue',
          fill: false,
          tension: 0.1
        },
        {
          label: 'Daily Average (kWh)',
          data: dailyAverageData,
          borderColor: 'green',
          fill: false,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { title: { display: true, text: 'Electricity Usage Over Time' } },
      scales: { y: { beginAtZero: true } }
    }
  });

  // Rate breakdown stacked bar
  rateBreakdownChart = new Chart(document.getElementById('rateBreakdownChart').getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: rateDatasets
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Tiered Usage Breakdown per Bill' } },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });

  // Total charge chart
  chargeChart = new Chart(document.getElementById('chargeChart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Total Charge (R)',
        data: totalChargeData,
        borderColor: 'red',
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      plugins: { title: { display: true, text: 'Total Charge Over Time' } },
      scales: { y: { beginAtZero: true } }
    }
  });
}
