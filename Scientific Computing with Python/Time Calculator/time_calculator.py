week_days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

def add_time(start_time, duration, day=None):
    """Get the time string a duration forward from start time.
    
    Parameters
    ---------
    start_time : str
        The starting time (hh:mm am).
    duration : str
        The time duration to add (h:m).
    day : str, optional
        The starting day.
        
    Returns
    -------
    str
        The arrived time (hh:mm am).
    """

    total_mins = to_minute(start_time) + to_minute(duration)
    total_days = total_mins // (24 * 60)
    end_time = to_clock12(total_mins % (24 * 60))
    
    if day:
        day = day.strip().capitalize()
        if day in week_days:
            i = (week_days.index(day) + total_days) % 7
            end_time += ", " + week_days[i]
    
    if total_days == 1:
        end_time += " (next day)"
    elif total_days > 1:
        end_time += " ({} days later)".format(total_days)

    return end_time


def to_clock12(minutes):
    """Convert number of minutes into time string (hh:mm am)."""

    try:
        t = int(minutes)
        if t < 0:
            raise ValueError
        t = t % (24 * 60)
    except ValueError:
        print("Minutes should be a positive integer")
        raise
    
    m = t % 60
    h = t // 60
    period = "AM" * (h < 12) + "PM" * (h >= 12)

    if h == 0:
        # day starts from 12:00 AM
        h = 12
    if h > 12:
        h -= 12
    
    return "{}:{:0>2} {}".format(h, m, period)


def to_minute(time_str):
    """Convert h:m time string into minutes (int)."""

    t = time_str.strip()
    # get the day period if input follow (hh:mm am) format
    t, *day_period = t.split()

    try:        
        h, m = [int(x) for x in t.split(":")]
        if h < 0 or m < 0 or m > 59:
            raise ValueError
    except ValueError:
        print("Invalid time string.")
        raise

    if day_period:
        day_period = "".join(day_period).upper()

        if day_period not in ("AM", "PM") or h > 12:
            print("Invalid 12-hour clock format.")
            raise ValueError
        
        if day_period == "AM" and h == 12:
            h = 0
        if day_period == "PM" and h < 12:
            h += 12

    return h * 60 + m