var Mayan = Mayan || {};

/////////////////////////////////////////////////////////////////////////////////
// Long Count Calendar

/*

The Long Count calendar was used to keep track of dates
across a large span of time.

There are five numbers that together represent the number
of days since the Mayan Creation Date.

kin     = day
winal   = month (20 days)
tun     = year (18 winals)
katun   = 20 tuns
baktun  = 20 katuns

It is usually represented in the following format:
    <baktun>.<katun>.<tun>.<winal>.<kin>

December 21, 2012 is represented by (13.0.0.0.0) on the Long Count calendar.
On that day, the baktun incremented to 13, while the others reset to 0.

*/

Mayan.LongCount = function(baktun,katun,tun,winal,kin) {

    // Define steps per cycle of a given category
    this.baktunCount = 20;
    this.katunCount = 20;
    this.tunCount = 20;
    this.winalCount = 18;
    this.kinCount = 20;

    // Define a smooth counter used for animating between counts.
    this.smoothCounter = new Mayan.MechCounter(
        new Mayan.MechCounterDigit(0,this.kinCount),
        new Mayan.MechCounterDigit(0,this.winalCount),
        new Mayan.MechCounterDigit(0,this.tunCount),
        new Mayan.MechCounterDigit(0,this.katunCount),
        new Mayan.MechCounterDigit(0,this.baktunCount));

    // Define how many days each step per category is worth.
    this.winalDays = this.kinCount;
    this.tunDays = this.winalDays * this.winalCount;    // 360
    this.katunDays = this.tunDays * this.tunCount;      // 7200
    this.baktunDays = this.katunDays * this.katunCount; // 144000
    this.maxDays = this.baktunDays * this.baktunCount;  // 2880000

    // Define and create other Mayan calendars to be synced with ours.
    this.tzolkin = new Mayan.Tzolkin();
    this.haab = new Mayan.Haab();
    this.lords = new Mayan.Lords();

    // Initialize the calendar.
    this.set(baktun,katun,tun,winal,kin);

    // Initialize smooth counter for animating.
    this.setSmoothCount(this.count);
};

Mayan.LongCount.prototype = {

    // Create standard string representation.
    toString: function() {
        return [this.baktun,this.katun,this.tun,this.winal,this.kin].join(".");
    },

    // Set the calendar to a fractional count (days since creation date).
    // The fraction part will only be used for computing intermediate
    // positions of the visual calendar wheels.
    // It will be truncated to integer values for usual day-length granularity.
    setSmoothCount: function(count) {
        // Remember the current smooth count.
        this.smoothCount = count;

        // Update smooth counter to compute intermediate positions.
        this.smoothCounter.set(count);

        // Create variables to represent intermediate positions.
        this.smoothBaktun =   this.smoothCounter.digits[4].count;
        this.smoothKatun =    this.smoothCounter.digits[3].count;
        this.smoothTun =      this.smoothCounter.digits[2].count;
        this.smoothWinal =    this.smoothCounter.digits[1].count;
        this.smoothKin =      this.smoothCounter.digits[0].count;

        // Sync smooth count with our other calendars.
        this.tzolkin.setSmoothCount(count);
        this.haab.setSmoothCount(count);
        this.lords.setSmoothCount(count);
        
        // Set the normal integer count.
        this.setFromCount(Math.floor(count));
    },

    // Synchronize with our other calendars.
    syncCalendars: function() {
        this.tzolkin.setFromCount(this.count);
        this.haab.setFromCount(this.count);
        this.lords.setFromCount(this.count);
    },

    // Set the date using the number of days since Mayan creation date.
    setFromCount: function(count) {
        // Save the given count and sync other calendars.
        this.count = count;
        this.syncCalendars();

        // Calculate values for each category.
        this.baktun = Math.floor(count / this.baktunDays);
        count %= this.baktunDays;
        this.katun = Math.floor(count / this.katunDays);
        count %= this.katunDays;
        this.tun = Math.floor(count / this.tunDays);
        count %= this.tunDays;
        this.winal = Math.floor(count / this.winalDays);
        this.kin = count % this.winalDays;
    },

    // Set the date using the individual Mayan date categories.
    set: function(baktun,katun,tun,winal,kin) {

        // Default all parameters to zero.
        if(typeof(baktun)==='undefined') baktun = 0;
        if(typeof(katun)==='undefined') katun = 0;
        if(typeof(tun)==='undefined') tun = 0;
        if(typeof(winal)==='undefined') winal = 0;
        if(typeof(kin)==='undefined') kin = 0;

        this.baktun = baktun;
        this.katun = katun;
        this.tun = tun;
        this.winal = winal;
        this.kin = kin;

        // Update days since creation date.
        this.count = (
            baktun * this.baktunDays +
            katun * this.katunDays +
            tun * this.tunDays +
            winal * this.winalDays +
            kin);

        // Sync with other calendars.
        this.syncCalendars();
    },

    // Set the date using a Gregorian date format.
    setFromGregorian: function(year, month, day) {
        var jd = gregorian_to_jd(year,month,day);
        this.set.apply(this, jd_to_mayan_count(jd));
    },

    // Set the date using a Javascript Date object.
    setFromDateObject: function(d) {
        this.setFromGregorian(d.getFullYear(), d.getMonth()+1, d.getDate());
    },

    // Get the Gregorian representation of our current date.
    getGregorian: function() {
        var jd = mayan_count_to_jd(this.baktun, this.katun, this.tun, this.winal, this.kin);
        return jd_to_gregorian(jd);
    },
};

/////////////////////////////////////////////////////////////////////////////////
// Tzolkin Calendar

/*
The Tzolkin Calendar is a 260-day cycling calendar,
used for religious and ceremonial events.

It combines 20 day names with 13 day numbers:

       NAMES:           NUMBERS:
       =========        ==========
        imix                1
        ik                  2
        akbal               3
        kan                 4 <----
        chikchan            5
        kimi                6
        manik               7
        lamat               8
        muluk               9
        ok                  10
        chuwen              11
        eb                  12
        ben                 13
        ix
        men
        kib
        kaban
        etznab
        kawak
        ajaw <------

   NOTE: the creation date starts with "ajaw.4"

The Name and Number increment in tandem on each day.

For example, these are the first few days of the Tzolkin calendar:

        ajaw        4
        imix*       5
        ik          6
        akbal       7
        kan         8
        chikchan    9
        kimi        10
        manik       11
        lamat       12
        muluk       13
        ok          1*
        chuwen      2

    *: Note the cycle resets independently for the name and number at the asterisks.

*/

Mayan.tzolkin_days = [
    "imix",     // 0
    "ik",       // 1
    "akbal",    // 2
    "kan",      // 3
    "chikchan", // 4
    "kimi",     // 5
    "manik",    // 6
    "lamat",    // 7
    "muluk",    // 8
    "ok",       // 9
    "chuwen",   // 10
    "eb",       // 11
    "ben",      // 12
    "ix",       // 13
    "men",      // 14
    "kib",      // 15
    "kaban",    // 16
    "etznab",   // 17
    "kawak",    // 18
    "ajaw",     // 19
];

Mayan.Tzolkin = function() {

    // Initialize the day number.
    // (we represent it using 0-based index, though its true range is 1-13)
    this.num = 0;

    // Initialize the day name.
    // (we represent it using 0-based index, with valid range 0-19)
    this.day = 0;

    // The Tzolkin calendar starts on "ajaw.4"
    this.numStart = 3;  // 4 in one-based numbering
    this.dayStart = 19; // ajaw

    // Define each cycle length.
    this.numCount = 13;
    this.dayCount = 20;
};

Mayan.Tzolkin.prototype = {

    // Set the calendar to a fractional count (days since creation date).
    // The fraction part will only be used for computing intermediate
    // positions of the visual calendar wheels.
    // It will be truncated to integer values for usual day-length granularity.
    setSmoothCount: function(count) {

        // Create variables to represent intermediate positions.
        this.smoothNum = (this.numStart + count) % this.numCount;
        this.smoothDay = (this.dayStart + count) % this.dayCount;

        // Set the normal integer count.
        this.setFromCount(Math.floor(count));
    },

    // Set the date using the number of days since Mayan creation date.
    setFromCount: function(count) {
        this.num = (this.numStart + count) % this.numCount;
        this.day = (this.dayStart + count) % this.dayCount;
    },

    // Create a standard string representation.
    toString: function() {
        return this.getDayNumStr() + "." + this.getDayNameStr();
    },

    // Get the string representing the day number.
    getDayNumStr: function() {
        return String(this.num+1);
    },

    // Get the string representing the day name.
    getDayNameStr: function() {
        return Mayan.tzolkin_days[this.day];
    },
};

/////////////////////////////////////////////////////////////////////////////////
// Haab Calendar

/*

The Haab Calendar is a 365-day cycling solar calendar.

There are 19 months.  The first 18 months have 20 days each.
The last month has only 5 days.

  MONTH      DAYS OF THE MONTH
  ==========|==================
    pop     |  20 (0 to 19)
    wo      |  20 (0 to 19)
    sip     |  20 (0 to 19)
    sotz    |  20 (0 to 19)
    sek     |  20 (0 to 19)
    xul     |  20 (0 to 19)
    yaxkin  |  20 (0 to 19)
    mol     |  20 (0 to 19)
    chen    |  20 (0 to 19)
    yax     |  20 (0 to 19)
    sak     |  20 (0 to 19)
    keh     |  20 (0 to 19)
    mak     |  20 (0 to 19)
    kankin  |  20 (0 to 19)
    muwan   |  20 (0 to 19)
    pax     |  20 (0 to 19)
    kayab   |  20 (0 to 19)
    kumku*  |  20 (0 to 19)
    wayeb   |   5 (0 to  4)

The Mayan creation date was on kumku 8.

*/


Mayan.haab_months = [
    "pop",      // 0
    "wo",       // 1
    "sip",      // 2
    "sotz",     // 3
    "sek",      // 4
    "xul",      // 5
    "yaxkin",   // 6
    "mol",      // 7
    "chen",     // 8
    "yax",      // 9
    "sak",      // 10
    "keh",      // 11
    "mak",      // 12
    "kankin",   // 13
    "muwan",    // 14
    "pax",      // 15
    "kayab",    // 16
    "kumku",    // 17
    "wayeb",    // 18
];

Mayan.Haab = function() {

    // Initialize the day and month.
    this.day = 0;
    this.month = 0;

    // Define days per month and year.
    this.daysPerMonth = 20; // all months except last
    this.daysPerYear = 365;

    // Derive months per year and days on last month.
    this.monthsPerYear = Math.ceil(this.daysPerYear / this.daysPerMonth);
    this.daysPerLastMonth = this.daysPerYear - (this.monthsPerYear-1) * this.daysPerMonth;

    // Define the start date.
    this.dayStart = 8;
    this.monthStart = 17; // kumku
};

Mayan.Haab.prototype = {

    // Set the calendar to a fractional count (days since creation date).
    // The fraction part will only be used for computing intermediate
    // positions of the visual calendar wheels.
    // It will be truncated to integer values for usual day-length granularity.
    setSmoothCount: function(count) {

        // Convert days since creation to a day on the Haab cycle.
        count = (count + this.monthStart*this.daysPerMonth + this.dayStart) % this.daysPerYear;

        // Initialize the intermediate month to its integer value.
        this.smoothMonth = Math.floor(count / this.daysPerMonth);

        // Set the intermediate day position.
        this.smoothDay = count % this.daysPerMonth;

        // Get the number of days belonging to this month.
        this.daysThisMonth = (
            (this.smoothMonth == this.monthsPerYear - 1) ? this.daysPerLastMonth : this.daysPerMonth);

        // Add the fractional part of the intermediate month if appropriate.
        if (this.smoothDay > this.daysThisMonth - 1) {
            this.smoothMonth += (this.smoothDay % 1);
        }

        // Set the normal integer count.
        this.setFromCount(Math.floor(count));
    },

    // Set the date using the number of days since Mayan creation date.
    setFromCount: function(count) {

        // Convert days since creation to a day on the Haab cycle.
        count = (count + this.monthStart*this.daysPerMonth + this.dayStart) % this.daysPerYear;

        // Set the month and day.
        this.month = Math.floor(count / this.daysPerMonth);
        this.day = count % this.daysPerMonth;
    },

    // Create a standard string representation.
    toString: function() {
        return this.getDayStr() + "." + this.getMonthStr();
    },

    // Get the string representing the day.
    getDayStr: function() {
        return String(this.day);
    },

    // Get the string representing the month.
    getMonthStr: function() {
        return Mayan.haab_months[this.month];
    },
};

/////////////////////////////////////////////////////////////////////////////////
// Lords of the Night Series

/*

This is a 9-day cycle tracked by the Mayans.

The lords take turns watching each night.  Their names have been lost, so they
are referred to by numbers: (g1 g2 g3 g4 g5 g6 g7 g8 g9)

The creation date started with g9.

*/

Mayan.Lords = function() {

    // Initialize the lord with zero-based index.
    this.lord = 0;

    // Define number of lords.
    this.lordCount = 9;

    // Define the starting lord.
    this.lordStart = 8; // =g9
};

Mayan.Lords.prototype = {
    // Set the calendar to a fractional count (days since creation date).
    // The fraction part will only be used for computing intermediate
    // positions of the visual calendar wheels.
    // It will be truncated to integer values for usual day-length granularity.
    setSmoothCount: function(count) {

        // Create variable to represent intermediate position.
        this.smoothLord = (count + this.lordStart) % this.lordCount;

        // Set the normal integer count.
        this.setFromCount(Math.floor(count));
    },

    // Set the date using the number of days since Mayan creation date.
    setFromCount: function(count) {
        this.lord = (count + this.lordStart) % this.lordCount;
    },

    // Create a standard string representation.
    toString: function() {
        return "g"+(this.lord+1);
    },
};

