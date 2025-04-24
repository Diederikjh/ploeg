import fitz  # PyMuPDF
import re
import os
import pandas as pd

def extract_municipal_data(pdf_path):
    """
    Extracts electricity consumption and rate data from a single municipal PDF.

    Args:
        pdf_path (str): The full path to the PDF file.

    Returns:
        dict: A dictionary containing extracted data (filename, total_consumption, rates)
              Returns None if the file is not a valid PDF or data isn't found.
    """
    data = {
        'filename': os.path.basename(pdf_path),
        'total_consumption_kwh': None,
        'rates': [] # List to store tuples of (kWh, rate_per_kwh)
    }
    found_consumption = False # Flag to avoid grabbing multiple consumption values if format repeats

    try:
        # Open the PDF document
        with fitz.open(pdf_path) as doc:
            full_text = ""
            # Concatenate text from all pages
            for page in doc:
                full_text += page.get_text("text") + "\n" # Add newline between pages

            # --- Extract Total Consumption ---
            # Regex: Looks for "Consumption" followed by spaces, then captures digits.digits, then " kWh"
            consumption_match = re.search(r"Consumption\s+(\d+\.\d+)\s+kWh", full_text, re.IGNORECASE)
            if consumption_match:
                data['total_consumption_kwh'] = float(consumption_match.group(1))
                found_consumption = True

            # --- Extract Tiered Rates ---
            # Regex: Looks for "(number)" space, captures digits.digits "kWh @" space "R" space, captures digits.digits
            # re.findall finds all non-overlapping matches
            rate_matches = re.findall(r"\(\d+\)\s+(\d+\.\d+)\s+kWh\s+@\s+R\s+(\d+\.\d+)", full_text, re.IGNORECASE)

            if rate_matches:
                for match in rate_matches:
                    kwh = float(match[0])
                    rate = float(match[1])
                    data['rates'].append({'kwh': kwh, 'rate': rate})

            # --- Basic Validation ---
            # Only return data if we found at least consumption or some rates
            if data['total_consumption_kwh'] is not None or data['rates']:
                 return data
            else:
                 print(f"Warning: No relevant data found in {data['filename']}")
                 return None

    except Exception as e:
        print(f"Error processing file {os.path.basename(pdf_path)}: {e}")
        return None

def process_pdf_directory(directory_path):
    """
    Processes all PDF files in a given directory.

    Args:
        directory_path (str): Path to the folder containing the PDF files.

    Returns:
        pandas.DataFrame: A DataFrame containing the extracted data from all PDFs.
    """
    all_data = []
    if not os.path.isdir(directory_path):
        print(f"Error: Directory not found: {directory_path}")
        return pd.DataFrame() # Return empty DataFrame

    print(f"Scanning directory: {directory_path}")
    for filename in os.listdir(directory_path):
        if filename.lower().endswith(".pdf"):
            pdf_full_path = os.path.join(directory_path, filename)
            print(f"Processing: {filename}...")
            extracted_info = extract_municipal_data(pdf_full_path)
            if extracted_info:
                all_data.append(extracted_info)

    print(f"\nProcessed {len(all_data)} PDF files successfully.")
    return pd.DataFrame(all_data)

# --- Main Execution ---
if __name__ == "__main__":
    # *** IMPORTANT: SET THIS TO THE FOLDER CONTAINING YOUR PDFS ***
    pdf_folder = "/path/to/your/municipal/accounts/pdfs" # Use forward slashes / even on Windows

    # --- Check if the directory exists ---
    if not os.path.isdir(pdf_folder) or pdf_folder == "/path/to/your/municipal/accounts/pdfs":
         print("="*50)
         print("ERROR: Please update the 'pdf_folder' variable in the script")
         print("       to the actual path where your PDF files are located.")
         print("="*50)
    else:
        # Process the PDFs and get the data
        df_results = process_pdf_directory(pdf_folder)

        # Display the results
        if not df_results.empty:
            print("\n--- Extracted Data ---")
            print(df_results.to_string()) # Use to_string() to show all rows/cols

            # --- Optional: Save to CSV ---
            try:
                csv_output_path = os.path.join(pdf_folder, "extracted_electricity_data.csv")
                df_results.to_csv(csv_output_path, index=False)
                print(f"\nData successfully saved to: {csv_output_path}")
            except Exception as e:
                print(f"\nError saving data to CSV: {e}")
        else:
            print("\nNo data was extracted.")