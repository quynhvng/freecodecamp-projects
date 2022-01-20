import copy
import random

class Hat:
    "Hat containing colored ball(s)."

    def __init__(self, **colors):
        contents = []
        for color in colors:
            num = colors[color]
            if isinstance(num, int):
                contents += [color] * num
        if not contents:
            raise ValueError("There are no balls. Input positive integer as number of balls to the color kwargs.")
        self.contents = contents

    def draw(self, num):
        total = len(self.contents)
        if not isinstance(num, int) or num <= 0:
            raise ValueError("Number of balls drawn is zero, negative or not an integer.")
        if num >= total:
            return self.contents
        sample = random.sample(self.contents, num)
        for ball in sample:
            self.contents.remove(ball)
        return sample
    

def experiment(hat, expected_balls, num_balls_drawn, num_experiments):
    if not isinstance(hat, Hat):
        raise ValueError("Input object is not a hat.")
    
    if not isinstance(num_experiments, int):
        raise ValueError("Number of experiments to perform is not an integer.")

    try:
        num_balls_expected = sum([num for color, num in expected_balls.items()])
    except:
        raise ValueError("Argument expected_balls should be a dictionary of color: number pair(s).")
     
    if (num_balls_expected > num_balls_drawn):
        return 0.0
    
    occurrence = 0
    for i in range(num_experiments):
        hat_copy = copy.deepcopy(hat)
        balls_drawn = hat_copy.draw(num_balls_drawn)
        # counting balls by color
        colors = set(balls_drawn)
        balls_count = {color : balls_drawn.count(color) for color in colors}
        # check if expected balls are drawn
        if all([color in balls_count and balls_count[color] >= expected_balls[color] for color in expected_balls]):
            occurrence += 1
    
    return occurrence / num_experiments
