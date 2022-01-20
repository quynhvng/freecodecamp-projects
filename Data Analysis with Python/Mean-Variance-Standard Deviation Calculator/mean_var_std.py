import numpy as np

def calculate(num_list):
    """Convert a 9-digit list into a 3x3 matrix. Return the descriptive statistics for the matrix
    (along both axes and when flattened)."""

    try:
        flat = np.asfarray(num_list)
        matrix = np.reshape(flat, (3, 3))
    except:
        raise ValueError("List must contain nine numbers.")

    calculations = {}
    functions = {
        "mean": np.mean,
        "variance": np.var,
        "standard deviation": np.std,
        "max": np.max,
        "min": np.min,
        "sum": np.sum
    }
    for i, f in functions.items():
        calculations[i] = [f(matrix, axis=0).tolist(), f(matrix, axis=1).tolist(), f(flat)]

    return calculations