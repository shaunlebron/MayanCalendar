var Mayan = Mayan || {};

////////////////////////
// Long Count Calendar

Mayan.LongCount = function(baktun,katun,tun,winal,kin) {
    this.baktunCount = 20;
    this.katunCount = 20;
    this.tunCount = 20;
    this.winalCount = 18;
    this.kinCount = 20;

    this.smoothCounter = new Mayan.MechCounter(
        new Mayan.MechCounterDigit(0,this.kinCount),
        new Mayan.MechCounterDigit(0,this.winalCount),
        new Mayan.MechCounterDigit(0,this.tunCount),
        new Mayan.MechCounterDigit(0,this.katunCount),
        new Mayan.MechCounterDigit(0,this.baktunCount));

    this.winalDays = this.kinCount;
    this.tunDays = this.winalDays * this.winalCount; // 360
    this.katunDays = this.tunDays * this.tunCount; // 7200
    this.baktunDays = this.katunDays * this.katunCount; // 144000
    this.maxDays = this.baktunDays * this.baktunCount; // 2880000

    // dependent calendars
    this.tzolkin = new Mayan.Tzolkin();
    this.haab = new Mayan.Haab();
    this.lords = new Mayan.Lords();

    this.set(baktun,katun,tun,winal,kin);
    this.setSmoothCount(this.count);
};

Mayan.LongCount.prototype = {
    toString: function() {
        return [this.baktun,this.katun,this.tun,this.winal,this.kin].join(".");
    },

    setSmoothCount: function(count) {
        this.smoothCount = count;
        this.smoothCounter.set(count);
        this.smoothBaktun =   this.smoothCounter.digits[4].count;
        this.smoothKatun =    this.smoothCounter.digits[3].count;
        this.smoothTun =      this.smoothCounter.digits[2].count;
        this.smoothWinal =    this.smoothCounter.digits[1].count;
        this.smoothKin =      this.smoothCounter.digits[0].count;

        this.tzolkin.setSmoothCount(count);
        this.haab.setSmoothCount(count);
        this.lords.setSmoothCount(count);
        
        this.setFromCount(Math.floor(count));
    },

    updateDependentCalendars: function() {
        this.tzolkin.setFromCount(this.count);
        this.haab.setFromCount(this.count);
        this.lords.setFromCount(this.count);
    },

    setFromCount: function(count) {
        count %= this.maxDays;
        this.count = count;
        this.updateDependentCalendars();

        this.kin = count % this.winalDays;

        this.baktun = Math.floor(count / this.baktunDays);
        count %= this.baktunDays;
        this.katun = Math.floor(count / this.katunDays);
        count %= this.katunDays;
        this.tun = Math.floor(count / this.tunDays);
        count %= this.tunDays;
        this.winal = Math.floor(count / this.winalDays);
    },

    set: function(baktun,katun,tun,winal,kin) {
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
        this.count = (
            baktun * this.baktunDays +
            katun * this.katunDays +
            tun * this.tunDays +
            winal * this.winalDays +
            kin);
        this.updateDependentCalendars();
    },

    setFromGregorian: function(year, month, day) {
        var jd = gregorian_to_jd(year,month,day);
        this.set.apply(this, jd_to_mayan_count(jd));
    },

    setFromDateObject: function(d) {
        this.setFromGregorian(d.getFullYear(), d.getMonth()+1, d.getDate());
    },

    getGregorian: function() {
        var jd = mayan_count_to_jd(this.baktun, this.katun, this.tun, this.winal, this.kin);
        return jd_to_gregorian(jd);
    },
};

////////////////////////
// Tzolkin Calendar

Mayan.tzolkin_days = "imix ik akbal kan chikchan kimi manik lamat muluk ok chuwen eb ben ix men kib kaban etznab kawak ajaw".split(" ");

Mayan.Tzolkin = function() {

    this.num = 0; // 1 to 13
    this.day = 0;

    this.numStart = 3; // = 4 in one-based numbering
    this.dayStart = 19; // ajaw

    this.numCount = 13;
    this.dayCount = 20;
};

Mayan.Tzolkin.prototype = {
    setSmoothCount: function(count) {
        this.smoothNum = (this.numStart + count) % this.numCount;
        this.smoothDay = (this.dayStart + count) % this.dayCount;
        this.setFromCount(Math.floor(count));
    },

    setFromCount: function(count) {
        this.num = (this.numStart + count) % this.numCount;
        this.day = (this.dayStart + count) % this.dayCount;
    },

    toString: function() {
        return this.getNumName() + "." + this.getDayName();
    },

    getNumName: function() {
        return String(this.num+1);
    },

    getDayName: function() {
        return Mayan.tzolkin_days[this.day];
    },
};

////////////////////////
// Haab Calendar

Mayan.haab_months = "pop wo sip sotz sek xul yaxkin mol chen yax sak keh mak kankin muwan pax kayab kumku wayeb".split(" ");

Mayan.Haab = function() {
    this.day = 0;
    this.month = 0;

    this.daysPerMonth = 20;
    this.daysPerYear = 365;

    this.monthsPerYear = Math.ceil(this.daysPerYear / this.daysPerMonth);
    this.daysPerLastMonth = this.daysPerYear - (this.monthsPerYear-1) * this.daysPerMonth;

    this.dayStart = 8;
    this.monthStart = 17; // kumku
};

Mayan.Haab.prototype = {
    setSmoothCount: function(count) {
        count = (count + this.monthStart*this.daysPerMonth + this.dayStart) % this.daysPerYear;
        this.smoothMonth = Math.floor(count / this.daysPerMonth);
        this.smoothDay = count % this.daysPerMonth;

        this.daysThisMonth = (this.smoothMonth == this.monthsPerYear - 1) ? this.daysPerLastMonth : this.daysPerMonth;

        if (this.smoothDay > this.daysThisMonth - 1) {
            this.smoothMonth += (this.smoothDay % 1);
        }

        this.setFromCount(Math.floor(count));
    },

    setFromCount: function(count) {
        count = (count + this.monthStart*this.daysPerMonth + this.dayStart) % this.daysPerYear;
        this.month = Math.floor(count / this.daysPerMonth);
        this.day = count % this.daysPerMonth;
    },

    toString: function() {
        return this.getDayName() + "." + this.getMonthName();
    },

    getDayName: function() {
        return String(this.day);
    },

    getMonthName: function() {
        return Mayan.haab_months[this.month];
    },
};

/////////////////////////////////
// Lords of the Night Calendar

Mayan.Lords = function() {
    this.lord = 0;
    this.lordCount = 9;
    this.lordStart = 8;
};

Mayan.Lords.prototype = {
    setSmoothCount: function(count) {
        this.smoothLord = (count + this.lordStart) % this.lordCount;
        this.setFromCount(Math.floor(count));
    },

    setFromCount: function(count) {
        this.lord = (count + this.lordStart) % this.lordCount;
    },

    toString: function() {
        return "g"+(this.lord+1);
    },
};

