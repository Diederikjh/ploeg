// charts.js - Chart rendering functionality

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
            yAxisID: 'y',      // Left axis
            fill: false,
            tension: 0.1,
        },
        {
            label: 'Daily Average (kWh)',
            data: dailyAverageData,
            borderColor: 'green',
            yAxisID: 'y1',     // Right axis
            fill: false,
            tension: 0.1,
        }
        ]

    },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      plugins: { title: { display: true, text: 'Electricity Usage Over Time' } },
      scales: {
        y: {
            type: 'linear',
            position: 'left',
            beginAtZero: true,
            title: {
            display: true,
            text: 'Total Consumption (kWh)'
            }
        },
        y1: {
            type: 'linear',
            position: 'right',
            beginAtZero: true,
            grid: {
            drawOnChartArea: false   // disables grid lines on right axis to avoid clutter
            },
            title: {
            display: true,
            text: 'Daily Average (kWh)'
            }
        }
        }

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