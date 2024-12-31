import mysql.connector
import pandas as pd
from sdv.metadata.single_table import SingleTableMetadata
from sdv.single_table import CTGANSynthesizer

def mysql_connection():
    """
    Establish a connection to the MySQL database.
    """
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="rasimrasim14",
        database="local_solitaire"
    )
    return mydb

def get_table_from_db(table_name):
    """
    Fetch data from the given table in the database as a pandas DataFrame.
    """
    connection = mysql_connection()
    query = f"SELECT * FROM {table_name}"
    df = pd.read_sql(query, connection)
    connection.close()
    return df

# Load data from MySQL
game_table = get_table_from_db("dashboard_game")
person_table = get_table_from_db("dashboard_person")
biomarker_table = get_table_from_db("dashboard_biomarker")
personbiomarker_table = get_table_from_db("dashboard_personbiomarkers")
biomarkertype_table = get_table_from_db("dashboard_biomarkertype")
move_table = get_table_from_db("dashboard_move")

# Verify loaded data
# print(game_table.head())

# Step 1: Metadata detection and cleanup
metadata = SingleTableMetadata()

# Clean up column names if needed
move_table.columns = move_table.columns.str.strip().str.replace('"', '').str.replace(';', '')
print("Cleaned columns:", move_table.columns)

# Detect metadata directly from the DataFrame
metadata.detect_from_dataframe(move_table)
print(metadata)

# Set the primary key
if 'id' in move_table.columns:
    metadata.set_primary_key('id')
else:
    raise ValueError("Primary key 'id' not found in the table columns.")

# Step 2: Synthesize data for the game table
move_table_synthesizer = CTGANSynthesizer(metadata)
move_table_synthesizer.fit(move_table)

# Generate synthetic data
new_game_data = move_table_synthesizer.sample(num_rows=len(move_table))

csv_url = "C:\\Users\\rasim\\OneDrive - KU Leuven\\KU Leuven-LAPTOP-U7MALKQJ\\Thesis\\Dev Folder\\dummy_data_pre\\"

# save to csv file
new_game_data.to_csv(csv_url + 'move_new_data.csv', index=False)

from sdv.evaluation.single_table import get_column_plot

# Plot the distribution of the 'score' column
fig = get_column_plot(
    move_table,
    new_game_data,
    metadata,
    'MCI',
    )
# fig1 = get_column_plot(
#         person_table,
#     new_game_data,
#     metadata,
#     'isSolved',
#     )
# Save the plot to a file
fig.show()

# Save synthetic data to a new table in the database
def save_to_db(table_name, df):
    """
    Save a DataFrame to the specified table in the database.
    """
    connection = mysql_connection()
    cursor = connection.cursor()
    
    # Create insert query
    columns = ", ".join(df.columns)
    placeholders = ", ".join(["%s"] * len(df.columns))
    query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
    
    # Execute insert queries
    for row in df.itertuples(index=False, name=None):
        cursor.execute(query, row)
    
    connection.commit()
    connection.close()
    print(f"Synthetic data inserted into table '{table_name}'.")

# save_to_db("dashboard_game_synthesized", new_game_data)
