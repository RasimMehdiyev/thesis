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

    mci_expanded = expand_data(mci_data)
    healthy_expanded = expand_data(healthy_data)
    mci_df = pd.DataFrame(mci_expanded, columns=["biomarker_value"])
    healthy_df = pd.DataFrame(healthy_expanded, columns=["biomarker_value"])

    combined_df = pd.concat([mci_df.assign(group="MCI"), healthy_df.assign(group="Healthy")])
    combined_df = combined_df.sort_values("biomarker_value").reset_index(drop=True)
    
    threshold_value = combined_df["biomarker_value"].median()
    print(threshold_value)
    return threshold_value


import matplotlib.pyplot as plt
import seaborn as sns

def plot_biomarker_bar_chart(data, threshold):
    # Colors
    color_below = (33/255, 174/255, 238/255, 0.7)  # Blue for below threshold with transparency
    color_above = (250/255, 93/255, 93/255, 0.7)   # Red for above threshold with transparency
    border_color_below = (25/255, 135/255, 185/255, 1)  # Darker border for blue
    border_color_above = (200/255, 74/255, 74/255, 1)   # Darker border for red

    if data['isLowGood'] == True:
        color_below, color_above = color_above, color_below
        border_color_below, border_color_above = border_color_above, border_color_below

    # Extract biomarker values and frequencies for MCI and healthy groups
    mci_values = [item['biomarker_value'] for item in data['mci']]
    mci_frequencies = [item['frequency'] for item in data['mci']]
    
    healthy_values = [item['biomarker_value'] for item in data['healthy']]
    healthy_frequencies = [item['frequency'] for item in data['healthy']]
    
    current_user_value = data['current_user']['biomarker_value']

    # Expand the values based on their frequencies
    mci_expanded = np.repeat(mci_values, mci_frequencies)
    healthy_expanded = np.repeat(healthy_values, healthy_frequencies)

    # Calculate bin edges based on the full range of data
    all_values = np.concatenate((mci_expanded, healthy_expanded))
    bins = np.linspace(all_values.min(), all_values.max(), 12)  # 15 bins across the entire range

    # Plot MCI Group
    plt.figure(figsize=(12, 6))

    # Plot histogram for below threshold
    plt.hist(
        mci_expanded[mci_expanded <= threshold],
        bins=bins,
        color=color_below,
        edgecolor=border_color_below,
        label="Below Threshold (Healthy)",
        alpha=0.7,
        linewidth=1.5
    )

    # Plot histogram for above threshold
    plt.hist(
        mci_expanded[mci_expanded > threshold],
        bins=bins,
        color=color_above,
        edgecolor=border_color_above,
        label="Above Threshold (MCI)",
        alpha=0.7,
        linewidth=1.5
    )

    # Threshold line
    plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
    
    # Mark current user biomarker value
    plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1, label=f'Current User = {current_user_value}')
    
    # Labels and title
    plt.xlabel('Biomarker Value')
    plt.ylabel('Frequency')
    plt.title('Biomarker Value Distribution for MCI Group')
    plt.legend()
    plt.show()

    # Plot Healthy Group
    plt.figure(figsize=(12, 6))

    # Plot histogram for below threshold
    plt.hist(
        healthy_expanded[healthy_expanded <= threshold],
        bins=bins,
        color=color_below,
        edgecolor=border_color_below,
        label="Below Threshold (Healthy)",
        alpha=0.7,
        linewidth=1.5
    )

    # Plot histogram for above threshold
    plt.hist(
        healthy_expanded[healthy_expanded > threshold],
        bins=bins,
        color=color_above,
        edgecolor=border_color_above,
        label="Above Threshold (MCI)",
        alpha=0.7,
        linewidth=1.5
    )

    # Threshold line
    plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
    
    # Mark current user biomarker value
    plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1, label=f'Current User = {current_user_value}')
    
    # Labels and title
    plt.xlabel('Biomarker Value')
    plt.ylabel('Frequency')
    plt.title('Biomarker Value Distribution for Healthy Group')
    plt.legend()
    plt.show()





# import matplotlib.pyplot as plt
# import seaborn as sns
# import numpy as np

# def plot_patient_distribution_with_threshold(data):
#     # Extract data from the JSON structure
#     mci_values = [item['biomarker_value'] for item in data['mci']]
#     mci_frequencies = [item['frequency'] for item in data['mci']]
    
#     healthy_values = [item['biomarker_value'] for item in data['healthy']]
#     healthy_frequencies = [item['frequency'] for item in data['healthy']]
    
#     # Expand the values based on frequencies for smooth KDE
#     mci_expanded = np.repeat(mci_values, mci_frequencies)
#     healthy_expanded = np.repeat(healthy_values, healthy_frequencies)
    
#     current_user_value = data['current_user']['biomarker_value']
#     threshold = data['threshold']

#     plt.figure(figsize=(14, 10))
    
#     # Plot MCI distribution
#     plt.subplot(2, 1, 1)
#     # Plot below threshold in blue
#     sns.kdeplot(mci_expanded[mci_expanded <= threshold], color='blue', fill=True, linewidth=2, label="MCI (Below Threshold)")
#     # Plot above threshold in red
#     sns.kdeplot(mci_expanded[mci_expanded > threshold], color='red', fill=True, linewidth=2, label="MCI (Above Threshold)")
#     plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
#     plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1.5, label=f'Current User = {current_user_value}')
#     plt.fill_betweenx([0, plt.gca().get_ylim()[1]], x1=min(mci_expanded), x2=threshold, color='lightblue', alpha=0.2)
#     plt.fill_betweenx([0, plt.gca().get_ylim()[1]], x1=threshold, x2=max(mci_expanded), color='lightcoral', alpha=0.2)
#     plt.xlabel('Biomarker Value')
#     plt.ylabel('Density')
#     plt.title('Biomarker Value Distribution - MCI Patients')
#     plt.legend()

#     # Plot Healthy distribution
#     plt.subplot(2, 1, 2)
#     # Plot below threshold in blue
#     sns.kdeplot(healthy_expanded[healthy_expanded <= threshold], color='blue', fill=True, linewidth=2, label="Healthy (Below Threshold)")
#     # Plot above threshold in red
#     sns.kdeplot(healthy_expanded[healthy_expanded > threshold], color='red', fill=True, linewidth=2, label="Healthy (Above Threshold)")
#     plt.axvline(x=threshold, color='gray', linestyle='--', linewidth=2, label=f'Threshold = {threshold}')
#     plt.axvline(x=current_user_value, color='black', linestyle='-', linewidth=1.5, label=f'Current User = {current_user_value}')
#     plt.fill_betweenx([0, plt.gca().get_ylim()[1]], x1=min(healthy_expanded), x2=threshold, color='lightblue', alpha=0.2)
#     plt.fill_betweenx([0, plt.gca().get_ylim()[1]], x1=threshold, x2=max(healthy_expanded), color='lightcoral', alpha=0.2)
#     plt.xlabel('Biomarker Value')
#     plt.ylabel('Density')
#     plt.title('Biomarker Value Distribution - Healthy Patients')
#     plt.legend()

#     plt.tight_layout()
#     plt.show()

# # Example JSON data for plotting
# data = {
#     "current_user": {"biomarker_value": 1.14, "mci": 1},
#     "mci": [
#         {"biomarker_value": 1, "frequency": 5},
#         {"biomarker_value": 1.04, "frequency": 1},
#         {"biomarker_value": 1.06, "frequency": 2},
#         {"biomarker_value": 1.08, "frequency": 1},
#         {"biomarker_value": 1.11, "frequency": 1},
#         {"biomarker_value": 1.14, "frequency": 1},
#         {"biomarker_value": 1.23, "frequency": 1},
#         {"biomarker_value": 1.24, "frequency": 2},
#         {"biomarker_value": 1.27, "frequency": 1},
#         {"biomarker_value": 1.28, "frequency": 1},
#         {"biomarker_value": 1.35, "frequency": 1},
#         {"biomarker_value": 1.44, "frequency": 1},
#         {"biomarker_value": 1.51, "frequency": 1},
#         {"biomarker_value": 1.68, "frequency": 1},
#         {"biomarker_value": 1.69, "frequency": 1},
#         {"biomarker_value": 1.78, "frequency": 1},
#         {"biomarker_value": 1.8, "frequency": 1}
#     ],
#     "healthy": [
#         {"biomarker_value": 1.04, "frequency": 1},
#         {"biomarker_value": 1.08, "frequency": 1},
#         {"biomarker_value": 1.09, "frequency": 1},
#         {"biomarker_value": 1.14, "frequency": 1},
#         {"biomarker_value": 1.17, "frequency": 1},
#         {"biomarker_value": 1.18, "frequency": 1},
#         {"biomarker_value": 1.21, "frequency": 1},
#         {"biomarker_value": 1.22, "frequency": 1},
#         {"biomarker_value": 1.23, "frequency": 2},
#         {"biomarker_value": 1.27, "frequency": 1},
#         {"biomarker_value": 1.28, "frequency": 1},
#         {"biomarker_value": 1.29, "frequency": 1},
#         {"biomarker_value": 1.3, "frequency": 1},
#         {"biomarker_value": 1.31, "frequency": 1},
#         {"biomarker_value": 1.32, "frequency": 1},
#         {"biomarker_value": 1.33, "frequency": 1},
#         {"biomarker_value": 1.4, "frequency": 1},
#         {"biomarker_value": 1.41, "frequency": 1},
#         {"biomarker_value": 1.43, "frequency": 1},
#         {"biomarker_value": 1.5, "frequency": 2},
#         {"biomarker_value": 1.51, "frequency": 1}
#     ],
#     "threshold": 1.24
# }

# Call the function to plot
# plot_patient_distribution_with_threshold(data)

