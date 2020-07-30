import re

def arithmetic_arranger(problems, solution=False):
    arranged_problems = ""

    if len(problems) > 5:
        arranged_problems = "Error: Too many problems."
        return arranged_problems
    
    first_line = []
    second_line = []
    separator_line = []
    third_line = []
  
    for problem in problems:
        errors = re.search("[^0-9\+\-\s\/\*]+", problem)
        operands = re.findall("[0-9]+", problem)
        operators = re.findall("\s([+-])\s", problem)

        if errors:
            arranged_problems = "Error: Numbers must only contain digits."
            return arranged_problems
    
        elif len(operators) != 1:
            arranged_problems = "Error: Operator must be '+' or '-'."
            return arranged_problems
    
        for operand in operands:
            if(len(operand) > 4):
                arranged_problems = "Error: Numbers cannot be more than four digits."
                return arranged_problems
        
        width = max(len(operands[0]), len(operands[1])) + 2
        
        if operators[0] == "+":
          ans = str(int(operands[0]) + int(operands[1]))
        elif operators[0] == "-":
          ans = str(int(operands[0]) - int(operands[1]))
        
        first_line.append(operands[0].rjust(width, ' '))
        second_line.append(operators[0] + " " + (operands[1]).rjust(width - 2, ' '))
        separator_line.append("-"*width)
        third_line.append(ans.rjust(width, ' '))
    
    arranged_problems += "    ".join(first_line) + "\n" + "    ".join(second_line) + "\n" + "    ".join(separator_line)
    
    if(solution):
        arranged_problems += "\n" + "    ".join(third_line)

    return arranged_problems
  
print(arithmetic_arranger(["3 + 855", "3801 - 2", "45 + 43", "123 + 49"]))


