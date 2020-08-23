from enum import Enum

class daysOfWeek(Enum):
  Monday = 0
  Tuesday = 1
  Wednesday = 2
  Thursday = 3
  Friday = 4
  Saturday = 5
  Sunday = 6

def add_time(start, duration, day = None):
  new_time = ""
  new_format = ""
  totalMins = 0
  
  parts = start.split(' ')
  format = parts[1]

  #Convert all time into minutes
  times = [parts[0]] + [duration]
  for time in times:
    time_parts = [int(s) for s in time.split(':')]
    totalMins += time_parts[0] * 60 + time_parts[1]
  
  totalMins += 720 if format == "PM" else 0
  
  totalHrs, mins = divmod(totalMins, 60)
  days, hrs = divmod(totalHrs, 24)

  if hrs >= 12:
    hrs -= 12 if hrs > 12 else 0
    new_format = "PM"
  else:
    new_format = "AM"
    if hrs == 0:
      hrs = 12

  new_time = ("%d:%02d" % (hrs, mins)) + " " + new_format

  if day != None:
    new_time += ", " + daysOfWeek((daysOfWeek[day.capitalize()].value + days) % 7).name

  if days == 1:
    new_time += " (next day)"
  elif days > 1:
    new_time += " (%d days later)" % (days)

  return new_time