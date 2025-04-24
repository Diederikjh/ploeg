# README.md

# Municipal Electricity Data Scraper from PDF

(A type of scraper in Afrikaans is a [ploeg](https://af.wikipedia.org/wiki/Ploeg))

This Python project extracts electricity consumption and rate data from municipal PDF files. It processes all PDFs in a specified directory, extracts relevant data using regular expressions, and outputs the results as a CSV file.

## Features

- Extracts total electricity consumption (in kWh) from PDF files.
- Extracts tiered electricity rates (kWh and rate per kWh).
- Processes all PDF files in a specified directory.
- Outputs the extracted data as a CSV file for further analysis.

## Library requirements

The project requires the following Python libraries:

- `PyMuPDF` (for PDF processing)
- `pandas` (for data manipulation)

Install the dependencies using the following command:

```bash
pip install -r requirements.txt
```

## Usage

1. Clone this repository or copy the script to your local machine.
2. Update the `pdf_folder` variable in `ploeg.py` to point to the directory containing your PDF files.
3. Run the script:

```bash
python ploeg.py
```

4. If the script successfully processes the PDFs, it will display the extracted data in the console and save it as a CSV file (`extracted_electricity_data.csv`) in the same directory as the PDFs.


## Example Output

After running the script, the extracted data will be displayed in the console and saved as a CSV file. The CSV file will include the following columns:

- `filename`: The name of the PDF file.
- `total_consumption_kwh`: The total electricity consumption in kWh.
- `rates`: A list of tiered rates, each containing `kwh` and `rate`.

```
--- Extracted Data ---
      filename  total_consumption_kwh                                                                rates
0  01 2025.PDF                 1203.0  [{'kwh': 670.685, 'rate': 2.987}, {'kwh': 532.315, 'rate': 4.1338}]
1  03 2025.PDF                  761.0  [{'kwh': 552.329, 'rate': 2.987}, {'kwh': 208.671, 'rate': 4.1338}]
2  04 2025.PDF                  889.0  [{'kwh': 572.055, 'rate': 2.987}, {'kwh': 316.945, 'rate': 4.1338}]
3  02 2025.PDF                  889.0  [{'kwh': 631.233, 'rate': 2.987}, {'kwh': 257.767, 'rate': 4.1338}]
```
