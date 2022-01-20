class Category:
    """Budget of one category such as food, clothing, etc."""

    def __init__(self, category):
        self.name = str(category).capitalize()
        self.ledger = []
        self.balance = 0

    def __str__(self):
        string = "{:*^30}".format(self.name) + "\n"
        for item in self.ledger:
            string += "{:23.23}{:7.2f}\n".format(item["description"], item["amount"])
        string += "Total: {:.2f}".format(self.balance)
        return string

    def __validate_amount(self, amount):
        "Return False and a message if input is not a positive number."
        if amount <= 0:
            print("Amount should be a positive number.")
        return amount > 0

    def __create_entry(self, amount, desc, credit=False):
        """Create an entry object. Return None if inputs are invalid."""
        entry = None
        if self.__validate_amount(amount):
            entry = { "amount": amount, "description": str(desc) }
            if credit:
                entry["amount"] *= -1
        return entry

    def __record_entry(self, entry):
        self.ledger.append(entry)
        self.balance += entry["amount"]
        #print("New entry in {}: {}".format(self.name, entry))

    def deposit(self, amount, description=""):
        entry = self.__create_entry(amount, description)
        if not entry:
            return False
        self.__record_entry(entry)
        return True
    
    def withdraw(self, amount, description=""):
        if not self.check_funds(amount):
            print("Could not withdraw: not enough fund.")
            return False
        entry = self.__create_entry(amount, description, credit=True)
        if not entry:
            return False
        self.__record_entry(entry)
        return True
        
    
    def get_balance(self):
        return round(self.balance, 2)
    
    def transfer(self, amount, destination):
        if not isinstance(destination, Category):
            print("Could not transfer: destination should be a Category object.")
            return False
        if not self.check_funds(amount):
            print("Could not transfer: not enough fund.")
            return False
        self.withdraw(amount, "Transfer to " + destination.name)
        destination.deposit(amount, "Transfer from " + self.name)
        return True
    
    def check_funds(self, amount):
        return amount <= self.balance

    def get_amount_spent(self):
        return abs(sum([i["amount"] for i in self.ledger if i["amount"] < 0]))


def create_spend_chart(categories):
    """Return a string representation of a bar chart, showing the percentage spent in each category."""

    if not isinstance(categories, list) or any([not isinstance(obj, Category) for obj in categories]):
        print("Input should be a list of Category object(s)")
        return None

    # prepare spending data
    total_spent = sum([obj.get_amount_spent() for obj in categories])
    data = []
    for obj in categories:
        data_point = {
            "x": obj.name,
            "y": obj.get_amount_spent() / total_spent * 100
        }
        data.append(data_point)

    # draw chart
    chart = "Percentage spent by category\n" #title
    
    y_scale = range(100, -1, -10)
    # draw y axis with value bars
    for y in y_scale:
        line = "{:>3}|".format(y)
        for d in data:
            if d["y"] < y:
                line += "   "
            else:
                line += " o "
        chart += line + " \n"
    
    x_axis_height = max([len(d["x"]) for d in data])
    # draw x axis
    pad_left = " " * 4
    chart += pad_left + "---" * len(data) + "-\n"
    for i in range(0, x_axis_height):
        line = pad_left
        for d in data:
            if len(d["x"]) > i:
                line += " {} ".format(d["x"][i])
            else:
                line += "   "
        chart += line + " \n"

    chart = chart.strip("\n")

    return chart