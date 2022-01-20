import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from scipy.stats import linregress

def draw_plot():
    # Read data from file
    df = pd.read_csv('epa-sea-level.csv', usecols=['Year', 'CSIRO Adjusted Sea Level'])

    # Create scatter plot
    fig, ax = plt.subplots()
    ax.scatter('Year', 'CSIRO Adjusted Sea Level', color='gray', edgecolors='none', alpha=0.7, data=df)

    # Create first line of best fit
    start_year = df.iloc[0, 0]
    time_frame1 = np.arange(start_year, 2051)
    regress1 = linregress(df)
    y_est1 = regress1.intercept + regress1.slope * time_frame1
    ax.plot(time_frame1, y_est1, color='g', label=f'Best fit 1 ({start_year}–2050)')

    # Create second line of best fit
    time_frame2 = np.arange(2000, 2051)
    index = 2000 - start_year
    regress2 = linregress(df.iloc[index:,])
    y_est2 = regress2.intercept + regress2.slope * time_frame2
    ax.plot(time_frame2, y_est2, color='r', label='Best fit 2 (2000–2050)')

    # Add labels and title
    ax.set_title('Rise in Sea Level')
    ax.set_xlabel('Year')
    ax.set_ylabel('Sea Level (inches)')
    ax.legend()
    
    # Save plot and return data for testing (DO NOT MODIFY)
    plt.savefig('sea_level_plot.png')
    return plt.gca()