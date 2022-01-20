import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import numpy as np

# Import data
df = pd.read_csv('medical_examination.csv')

# Add 'overweight' column
df['bmi'] = df['weight'] / (df["height"]/100)**2
df['overweight'] = (df['bmi'] > 25) * 1
df = df.drop(columns='bmi')

# Normalize data by making 0 always good and 1 always bad. If the value of 'cholesterol' or 'gluc' is 1, make the value 0. If the value is more than 1, make the value 1.
df['cholesterol'] = (df['cholesterol'] > 1) * 1
df['gluc'] = (df['gluc'] > 1) * 1

# Draw Categorical Plot
def draw_cat_plot():
    # Create DataFrame for cat plot using `pd.melt` using just the values from 'cholesterol', 'gluc', 'smoke', 'alco', 'active', and 'overweight'.
    df_cat = df[['cardio', 'cholesterol', 'gluc', 'smoke','alco', 'active', 'overweight']]
    df_cat = df_cat.melt(id_vars=['cardio'])

    # Group and reformat the data to split it by 'cardio'. Show the counts of each feature. You will have to rename one of the columns for the catplot to work correctly.
    df_cat = df_cat.groupby(['cardio', 'variable', 'value']).size().reset_index()
    df_cat = df_cat.rename(columns={0: 'total'})

    # Draw the catplot with 'sns.catplot()'
    fig = sns.catplot(x='variable', y='total', hue='value', col='cardio', kind='bar', data=df_cat)

    # Do not modify the next two lines
    fig.savefig('catplot.png')
    return fig


# Draw Heat Map
def draw_heat_map():
    # Clean the data
    df_heat = df.loc[
        (df['ap_lo'] <= df['ap_hi'])
        & (df['height'] >= df['height'].quantile(0.025))
        & (df['height'] <= df['height'].quantile(0.975))
        & (df['weight'] >= df['weight'].quantile(0.025))
        & (df['weight'] <= df['weight'].quantile(0.975))
    ]

    # Calculate the correlation matrix
    corr = df_heat.corr()

    # Generate a mask for the upper triangle
    mask = ~np.tri(corr.shape[0], k=-1, dtype=np.bool_)

    # Set up the matplotlib figure
    fig, ax = plt.subplots(layout='tight')

    # Draw the heatmap with 'sns.heatmap()'
    sns.heatmap(data=corr, annot=True, fmt='.1f', mask=mask, ax=ax)


    # Do not modify the next two lines
    fig.savefig('heatmap.png')
    return fig
