# README.md

# Municipal Electricity Data Scraper from PDF

(A type of scraper in Afrikaans is a [ploeg](https://af.wikipedia.org/wiki/Ploeg))

This project extracts electricity consumption and rate data from municipal PDF files. It includes both a Python command-line tool and a web-based interface for processing PDFs with interactive data visualization.

Built for PDFs that City of Cape Town generates for its customers.

## Features

- **Python CLI Tool**: Extracts total electricity consumption (in kWh) from PDF files, extracts tiered electricity rates, processes all PDF files in a specified directory, and outputs results as CSV
- **Web Interface**: Drag-and-drop PDF processing with interactive charts showing usage trends, tiered consumption breakdown, and charge analysis over time
- **Enhanced Data Extraction**: Extracts consumption, daily averages, billing periods, tiered rates, and total charges
- **Data Visualization**: Interactive charts using Chart.js for analyzing electricity usage patterns

## Requirements

### Python CLI Tool
- `PyMuPDF` (for PDF processing)
- `pandas` (for data manipulation)

Install the dependencies using:
```bash
pip install -r requirements.txt
```

### Web Interface
- Modern web browser with JavaScript enabled
- No additional installation required (uses CDN for PDF.js and Chart.js)

## Usage

### Python CLI Tool
1. Clone this repository or copy the script to your local machine
2. Run the script, passing in the path to where the municipal PDFs are located:

```bash
python ploeg.py /path/to/your/pdf/folder
```

3. The script will display extracted data in the console and save it as a CSV file (`extracted_electricity_data.csv`) in the same directory as the PDFs

### Web Interface
1. Open `index.html` in a web browser
2. Drag and drop PDF files onto the drop zone, or click to select files
3. View interactive charts showing:
   - Electricity usage over time (total consumption and daily averages)
   - Tiered usage breakdown per bill
   - Total charges over time


## Example Output

### Python CLI Tool
After running the script, the extracted data will be displayed in the console and saved as a CSV file. The CSV file will include the following columns:

- `filename`: The name of the PDF file
- `total_consumption_kwh`: The total electricity consumption in kWh
- `rates`: A list of tiered rates, each containing `kwh` and `rate`

```
--- Extracted Data ---
      filename  total_consumption_kwh  rates
0  01 2025.PDF                 1203.0  [{'kwh': 670.685, 'rate': 2.987}, {'kwh': 532.315, 'rate': 4.1338}]
1  03 2025.PDF                  761.0  [{'kwh': 552.329, 'rate': 2.987}, {'kwh': 208.671, 'rate': 4.1338}]
2  04 2025.PDF                  889.0  [{'kwh': 572.055, 'rate': 2.987}, {'kwh': 316.945, 'rate': 4.1338}]
3  02 2025.PDF                  889.0  [{'kwh': 631.233, 'rate': 2.987}, {'kwh': 257.767, 'rate': 4.1338}]
```

### Web Interface
The web interface provides interactive charts that visualize:
- **Usage trends**: Line charts showing total consumption and daily averages over time
- **Tiered breakdown**: Stacked bar charts showing how much electricity was consumed in each pricing tier
- **Charge analysis**: Line chart displaying total charges across billing periods

Each parsed PDF contributes data points that are automatically sorted by billing period for chronological analysis.


## Testing

run `node ./tests/testParsing.js` for running tests.
