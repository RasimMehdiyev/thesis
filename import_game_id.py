import pandas as pd

# Load the CSV files
ml_data = pd.read_csv("C:\\Users\\rasim\\OneDrive - KU Leuven\\KU Leuven-LAPTOP-U7MALKQJ\\Thesis\\Dev Folder\\dummy_data_pre\\Copy of Fictional_input_output_ground_truth.xlsx")
game_table = pd.read_csv("C:\\Users\\rasim\\Downloads\\Game-2024-11-09.xlsx")
restructured_biomarkers  = pd.read_csv("../Users/rasim/downloads/restructured_person_game_biomarkers_v2.csv")

# Extract gameTime from column '19' in the MLData file
ml_data['gameTime'] = ml_data['19']

# Merge the gameTable with MLData on 'gameTime' to get the 'gameID'
game_table = game_table.rename(columns={'gametime': 'gameTime'})
game_table = game_table[['id', 'gameTime']]  # Only keep id (gameID) and gameTime

# Merge with restructured biomarkers data
merged_data = restructured_biomarkers.merge(
    ml_data[['gameTime']],  # Add gameTime to restructured data
    left_index=True, right_index=True
)

# Merge with game_table to get the gameID
merged_data = merged_data.merge(
    game_table,
    on='gameTime',
    how='left'
)

# Rename 'id' to 'gameID_id' for clarity
merged_data = merged_data.rename(columns={'id': 'gameID_id'})

# Drop unnecessary columns and reorganize the columns for clarity
final_data = merged_data[['personID_id', 'gameID_id', 'biomarkerID_id', 'value']]

# Save the updated table
final_data.to_csv("updated_restructured_person_game_biomarkers.csv", index=False)

print("Updated data saved to 'updated_restructured_person_game_biomarkers.csv'")
