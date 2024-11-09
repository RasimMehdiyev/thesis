import pandas as pd

# Load the files
url = "C:\\Users\\rasim\\OneDrive - KU Leuven\\KU Leuven-LAPTOP-U7MALKQJ\\Thesis\\Dev Folder\\dummy_data_pre\\"

file1 = pd.read_csv(url + 'restructured_person_game_biomarkers_v2.csv')
file2 = pd.read_excel(url + 'fictional_input_output.xlsx')

# Melt the second file to make biomarkers identifiable
numeric_columns = file2.select_dtypes(include='number').columns
file2_melted = file2.melt(
    id_vars=['gameID', 'personID'],
    value_vars=[col for col in numeric_columns if col not in ['gameID', 'personID']],
    var_name='biomarkerID',
    value_name='value'
)

# Ensure biomarkerID is numeric for proper matching
file2_melted['biomarkerID'] = pd.to_numeric(file2_melted['biomarkerID'], errors='coerce')

# Merge the two files on personID, gameID, and biomarkerID
merged_file = file1.merge(file2_melted, on=['personID', 'gameID', 'biomarkerID'], how='left')

# Save the result
output_path = url + 'updated_file.csv'
merged_file.to_csv(output_path, index=False)

print(f"The updated file has been saved at {output_path}")
