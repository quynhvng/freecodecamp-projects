def arithmetic_arranger(problems, display_ans=False):
    """Arrange arithmetic problems vertically and side-by-side. Limited to five problems,
    +/- operations and integers only.
    
    Parameters
    ----------
    problems : list of str
        A list of problems to be arranged.
    display_ans : bool, optional
        A flag to display the problems' answers.
        
    Returns
    -------
    str
        A string of the problems arranged or an error message on failure.
    """

    if len(problems) > 5:
        return "Error: Too many problems."

    # vertically arrange individual problems
    try:
        arranged_problems = [arrange_one(p, display_ans) for p in problems]
    except Exception as err:
        return "Error: " + str(err)
    
    # arrange all problems side-by-side
    arranged_lines = []
    add_with_gap = lambda a, b : a + " " * 4 + b

    for problem in arranged_problems:
        lines = problem.split("\n")
        if not arranged_lines:
            arranged_lines = lines
        else:
            arranged_lines = map(add_with_gap, arranged_lines, lines)

    return "\n".join(arranged_lines)


def arrange_one(problem, display_ans=False):
    """Take an in-line, two-operand arithmetic problem and arranged it vertically. 
    Limited to +/- operations and integers only.
    
    Parameters
    ----------
    problems : str
        A string of the problem to be arranged.
    display_ans : bool, optional
        A flag to display answer.
        
    Returns
    -------
    str
        A string of the problem arranged vertically.
    """
    
    # parse problem
    try:
        parts = problem.strip().split(" ")
        num1, op, num2 = parts
    except:
        raise Exception("""Problem must contain only two operands separated from
        the operator by a single space.""")

    # validate input
    if op not in ["+", "-"]:
        raise Exception("Operator must be '+' or '-'.")
    if not (num1.isdigit() and num2.isdigit()):
        raise Exception("Numbers must only contain digits.")
    if len(num1) > 4 or len(num2) > 4:
        raise Exception("Numbers cannot be more than four digits.")
    
    # format problem line by line
    lines = []
    width = max(len(num1), len(num2)) + 2

    lines.append(num1.rjust(width))
    lines.append(op + num2.rjust(width)[1:])
    lines.append("".rjust(width, "-"))
    
    if display_ans:
        lines.append(str(eval(problem)).rjust(width))

    return "\n".join(lines)