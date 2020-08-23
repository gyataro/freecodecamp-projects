import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file
    df = pd.read_csv('epa-sea-level.csv')

    # Create scatter plot
    plt.figure(figsize=(12,5))
    plt.scatter(df['Year'], df['CSIRO Adjusted Sea Level'])

    # Create first line of best fit
    slope, intercept, r_value, p_value, std_err = linregress(df['Year'], df['CSIRO Adjusted Sea Level'])

    best_x = np.arange(df['Year'][0], 2050)
    best_y = intercept + slope * best_x

    plt.plot(best_x, best_y, color='orange', linewidth=2.0)

    # Create second line of best fit
    df_2 = df[df['Year'] >= 2000].reset_index()
    slope, intercept, r_value, p_value, std_err = linregress(df_2['Year'], df_2['CSIRO Adjusted Sea Level'])

    best_x_2 = np.arange(df_2['Year'][0], 2050)
    best_y_2 = intercept + slope * best_x_2

    plt.plot(best_x_2, best_y_2, color='red', linewidth=2.0)
    
    # Add labels and title
    plt.xlabel('Year')
    plt.ylabel('Sea Level (inches)')
    plt.title('Rise in Sea Level')
    
    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()