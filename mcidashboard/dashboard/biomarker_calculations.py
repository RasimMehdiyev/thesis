import pandas as pd
import numpy as np

def expand_data(data):
    return [item["biomarker_value"] for item in data for _ in range(item["frequency"])]


def threshold_calc(data):
    print("Threshold Calculation")
    # print(data)
    '''
    {'mci': [{'biomarker_value': 299.0, 'frequency': 1}, {'biomarker_value': 300.0, 'frequency': 4}, {'biomarker_value': 364.0, 'frequency': 1}, {'biomarker_value': 377.0, 'frequency': 1}, {'biomarker_value': 399.0, 'frequency': 1}, {'biomarker_value': 400.0, 'frequency': 3}, {'biomarker_value': 470.0, 'frequency': 1}, {'biomarker_value': 500.0, 'frequency': 1}, {'biomarker_value': 501.0, 'frequency': 2}, {'biomarker_value': 504.0, 'frequency': 1}, {'biomarker_value': 541.0, 'frequency': 1}, {'biomarker_value': 562.0, 'frequency': 1}, {'biomarker_value': 600.0, 'frequency': 1}, {'biomarker_value': 632.0, 'frequency': 1}, {'biomarker_value': 646.0, 'frequency': 1}, {'biomarker_value': 703.0, 'frequency': 1}, {'biomarker_value': 734.0, 'frequency': 1}], 'healthy': [{'biomarker_value': 201.0, 'frequency': 1}, {'biomarker_value': 223.0, 'frequency': 1}, {'biomarker_value': 262.0, 'frequency': 1}, {'biomarker_value': 299.0, 'frequency': 3}, {'biomarker_value': 300.0, 'frequency': 4}, {'biomarker_value': 326.0, 'frequency': 1}, {'biomarker_value': 364.0, 'frequency': 1}, {'biomarker_value': 382.0, 'frequency': 1}, {'biomarker_value': 399.0, 'frequency': 1}, {'biomarker_value': 400.0, 'frequency': 4}, {'biomarker_value': 417.0, 'frequency': 1}, {'biomarker_value': 443.0, 'frequency': 1}, {'biomarker_value': 499.0, 'frequency': 1}, {'biomarker_value': 560.0, 'frequency': 1}, {'biomarker_value': 601.0, 'frequency': 1}]}
    '''
    mci_data = data['mci']
    healthy_data = data['healthy']

    print(mci_data)
    print(healthy_data)
    # Expand data based on frequencies
    mci_expanded = expand_data(mci_data)
    healthy_expanded = expand_data(healthy_data)
    mci_df = pd.DataFrame(mci_expanded, columns=["biomarker_value"])
    healthy_df = pd.DataFrame(healthy_expanded, columns=["biomarker_value"])

    # Combine and sort
    combined_df = pd.concat([mci_df.assign(group="MCI"), healthy_df.assign(group="Healthy")])
    combined_df = combined_df.sort_values("biomarker_value").reset_index(drop=True)
    
    # Calculate weighted median as threshold
    threshold_value = combined_df["biomarker_value"].median()
    print(threshold_value)
    return threshold_value


