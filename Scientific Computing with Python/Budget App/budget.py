from itertools import zip_longest

class Category:
  def __init__(self, label):
    self.label = str(label)
    self.amount = 0
    self.ledger = []

  def __str__(self):
    output = self.label.center(30, "*") + "\n"
    for item in self.ledger:
      output += item["description"][:23].ljust(23, " ") + str("{:.2f}".format(item["amount"])).rjust(7, " ") + "\n"
    output += "Total: " + str(self.amount)
    return output
  
  def deposit(self, amount, desc=""):
    self.amount += amount
    self.ledger.append({"amount": amount, "description": str(desc)})

  def withdraw(self, amount, desc=""):
    if self.check_funds(amount):
      self.amount -= amount
      self.ledger.append({"amount": -amount, "description": str(desc)})
      return True
    else:
      return False

  def transfer(self, amount, category):
    if self.check_funds(amount):
      self.withdraw(amount, "Transfer to " + category.label)
      category.deposit(amount, "Transfer from " + self.label)
      return True
    else:
      return False

  def get_balance(self):
    return self.amount

  def check_funds(self, amount):
    return True if self.amount >= amount else False

def create_spend_chart(categories):
  labels = []
  subtotals = []
  percentages = []
  total = 0
  output = ""

  for category in categories:
    labels.append(category.label)

    subtotal = 0
    for item in category.ledger:
      subtotal += -item['amount'] if item['amount'] < 0 else 0

    subtotals.append(subtotal)
    total += subtotal

  for subtotal in subtotals:
    percentages.append(int(round(100*subtotal/total,-1)))

  output += "Percentage spent by category\n"

  for y_val in range(100, -10, -10):
    output += str(y_val).rjust(3, " ") + "| "

    for percentage in percentages:
      output += "o" if percentage >= y_val else " "
      output += "  "

    output += "\n"

  output += "    " + "-"*(1 + 3*len(percentages)) + "\n"

  legends = []
  for x in zip_longest(*labels, fillvalue=" "):
    legends.append("     " + "  ".join(x) + "  ")
  
  output += "\n".join(legends)

  return output