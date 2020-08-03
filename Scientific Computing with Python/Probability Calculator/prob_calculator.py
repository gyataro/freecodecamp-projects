import copy
import random
from collections import Counter

class Hat:
  def __init__(self, **kwargs):
    self.contents = []
    for ball, value in kwargs.items():
      self.contents.extend([ball] * value)
  
  def draw(self, size):
    draw_list = []

    for i in range(0, min(len(self.contents), size)):
      draw = random.choice(self.contents)
      self.contents.pop(self.contents.index(draw))
      draw_list.append(draw)
    
    return draw_list
    
def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
  num_success = 0

  for i in range(0, num_experiments):
    draw_hat = copy.deepcopy(hat)
    draw_list = draw_hat.draw(num_balls_drawn)
    c_list = Counter(draw_list)

    num_success += 1
    for ball, value in expected_balls.items():
      if c_list[ball] < value:
        num_success -= 1
        break

  return num_success / num_experiments

        


