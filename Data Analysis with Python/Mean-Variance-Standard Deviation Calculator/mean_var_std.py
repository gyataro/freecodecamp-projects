import numpy as np

def calculate(list):
  if len(list) != 9:
    raise ValueError("List must contain nine numbers.")

  calculations = {}
  matrix = np.reshape(np.array(list), [3, 3])

  functions = { 'mean': np.mean, 'variance': np.var, 'standard deviation': np.std, 'max': np.amax, 'min': np.amin, 'sum': np.sum }

  for key, value in functions.items():
    calculations[key] = [value(matrix, axis=0).tolist(), value(matrix, axis=1).tolist(), value(matrix)]

  return calculations