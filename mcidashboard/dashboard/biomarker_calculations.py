import pandas as pd
import numpy as np

def expand_data(data):
    return [item["biomarker_value"] for item in data for _ in range(item["frequency"])]


def threshold_calc(data):
    # print("Threshold Calculation")
    # print(data)
    '''
    {'mci': [{'biomarker_value': 299.0, 'frequency': 1}, {'biomarker_value': 300.0, 'frequency': 4}, {'biomarker_value': 364.0, 'frequency': 1}, {'biomarker_value': 377.0, 'frequency': 1}, {'biomarker_value': 399.0, 'frequency': 1}, {'biomarker_value': 400.0, 'frequency': 3}, {'biomarker_value': 470.0, 'frequency': 1}, {'biomarker_value': 500.0, 'frequency': 1}, {'biomarker_value': 501.0, 'frequency': 2}, {'biomarker_value': 504.0, 'frequency': 1}, {'biomarker_value': 541.0, 'frequency': 1}, {'biomarker_value': 562.0, 'frequency': 1}, {'biomarker_value': 600.0, 'frequency': 1}, {'biomarker_value': 632.0, 'frequency': 1}, {'biomarker_value': 646.0, 'frequency': 1}, {'biomarker_value': 703.0, 'frequency': 1}, {'biomarker_value': 734.0, 'frequency': 1}], 'healthy': [{'biomarker_value': 201.0, 'frequency': 1}, {'biomarker_value': 223.0, 'frequency': 1}, {'biomarker_value': 262.0, 'frequency': 1}, {'biomarker_value': 299.0, 'frequency': 3}, {'biomarker_value': 300.0, 'frequency': 4}, {'biomarker_value': 326.0, 'frequency': 1}, {'biomarker_value': 364.0, 'frequency': 1}, {'biomarker_value': 382.0, 'frequency': 1}, {'biomarker_value': 399.0, 'frequency': 1}, {'biomarker_value': 400.0, 'frequency': 4}, {'biomarker_value': 417.0, 'frequency': 1}, {'biomarker_value': 443.0, 'frequency': 1}, {'biomarker_value': 499.0, 'frequency': 1}, {'biomarker_value': 560.0, 'frequency': 1}, {'biomarker_value': 601.0, 'frequency': 1}]}
    '''
    mci_data = data['mci']
    healthy_data = data['healthy']

    # print(mci_data)
    # print(healthy_data)

    mci_expanded = expand_data(mci_data)
    healthy_expanded = expand_data(healthy_data)
    mci_df = pd.DataFrame(mci_expanded, columns=["biomarker_value"])
    healthy_df = pd.DataFrame(healthy_expanded, columns=["biomarker_value"])

    combined_df = pd.concat([mci_df.assign(group="MCI"), healthy_df.assign(group="Healthy")])
    combined_df = combined_df.sort_values("biomarker_value").reset_index(drop=True)
    
    threshold_value = combined_df["biomarker_value"].median()
    return threshold_value


import matplotlib.pyplot as plt
import seaborn as sns

# data dist chart. trying python option as a backup
def plot_biomarker_bar_chart(data, threshold):
    color_below = (33/255, 174/255, 238/255, 0.7)  
    color_above = (250/255, 93/255, 93/255, 0.7)   
    border_color_below = (25/255, 135/255, 185/255, 1)  
    border_color_above = (200/255, 74/255, 74/255, 1)

    if data['isLowGood'] == True:
        color_below, color_above = color_above, color_below
        border_color_below, border_color_above = border_color_above, border_color_below

    mci_values = [item['biomarker_value'] for item in data['mci']]
    mci_frequencies = [item['frequency'] for item in data['mci']]
    
    healthy_values = [item['biomarker_value'] for item in data['healthy']]
    healthy_frequencies = [item['frequency'] for item in data['healthy']]
    
    current_user_value = data['current_user']['biomarker_value']

    mci_expanded = np.repeat(mci_values, mci_frequencies)
    healthy_expanded = np.repeat(healthy_values, healthy_frequencies)

    all_values = np.concatenate((mci_expanded, healthy_expanded))
    bins = np.linspace(all_values.min(), all_values.max(), 12)  

    plt.figure(figsize=(12, 6))

    plt.hist(
        mci_expanded[mci_expanded <= threshold],
        bins=bins,
        color=color_below,
        edgecolor=border_color_below,
        label="Below Threshold (Healthy)",
        alpha=0.7,
        linewidth=1.5
    )

    plt.hist(
        mci_expanded[mci_expanded > threshold],
        bins=bins,
        color=color_above,
        edgecolor=border_color_above,
        label="Above Threshold (MCI)",
        alpha=0.7,
        linewidth=1.5
    )

    # Threshold
    plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
    
    # Current user biomarker value
    plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1, label=f'Current User = {current_user_value}')
    
    plt.xlabel('Biomarker Value')
    plt.ylabel('Frequency')
    plt.title('Biomarker Value Distribution for MCI Group')
    plt.legend()
    plt.show()

    # Healthy
    plt.figure(figsize=(12, 6))

    # Below threshold
    plt.hist(
        healthy_expanded[healthy_expanded <= threshold],
        bins=bins,
        color=color_below,
        edgecolor=border_color_below,
        label="Below Threshold (Healthy)",
        alpha=0.7,
        linewidth=1.5
    )

    # Above threshold
    plt.hist(
        healthy_expanded[healthy_expanded > threshold],
        bins=bins,
        color=color_above,
        edgecolor=border_color_above,
        label="Above Threshold (MCI)",
        alpha=0.7,
        linewidth=1.5
    )

    # Threshold
    plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
    
    # Current user biomarker value
    plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1, label=f'Current User = {current_user_value}')
    
    plt.xlabel('Biomarker Value')
    plt.ylabel('Frequency')
    plt.title('Biomarker Value Distribution for Healthy Group')
    plt.legend()
    plt.show()

