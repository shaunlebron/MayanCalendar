var Mayan = Mayan || {};

/////////////////////
// Tests

Mayan.runTests = function(){
    var assertEqual = function(a,b) {
        if (a+"" !== b+"") {
            console.error("AssertEqual failed: (" + a + ", " + b +")");
        }
    };

    var c = new Mayan.LongCount();

    c.setFromCount(0);
    assertEqual(c.toString(),"0.0.0.0.0");
    assertEqual(c.count, 0);
    assertEqual(c.tzolkin.toString(), "4.ajaw");
    assertEqual(c.haab.toString(), "8.kumku");
    assertEqual(c.lords.toString(), "G9");
    assertEqual(c.getGregorian(), [-3113,8,11]);

    c.set(13,0,0,0,0);
    assertEqual(c.toString(),"13.0.0.0.0");
    assertEqual(c.count, 1872000);
    assertEqual(c.tzolkin.toString(), "4.ajaw");
    assertEqual(c.haab.toString(), "3.kankin");
    assertEqual(c.lords.toString(), "G9");
    assertEqual(c.getGregorian(), [2012,12,21]);

    c.setFromGregorian(1987,7,2);
    assertEqual(c.toString(),"12.18.14.2.16");
    assertEqual(c.count, 1862696);
    assertEqual(c.tzolkin.toString(), "8.kib");
    assertEqual(c.haab.toString(), "4.sek");
    assertEqual(c.lords.toString(), "G2");
    assertEqual(c.getGregorian(), [1987,7,2]);
};

////////////////////////
// Long Count Calendar

Mayan.LongCount = function(baktun,katun,tun,winal,kin) {
    this.baktunCount = 20;
    this.katunCount = 20;
    this.tunCount = 20;
    this.winalCount = 18;
    this.kinCount = 20;

    this.winalDays = 20;
    this.tunDays = this.winalDays * this.winalCount; // 360
    this.katunDays = this.tunDays * this.tunCount; // 7200
    this.baktunDays = this.katunDays * this.katunCount; // 144000
    this.maxDays = this.baktunDays * this.baktunCount; // 2880000

    // dependent calendars
    this.tzolkin = new Mayan.Tzolkin();
    this.haab = new Mayan.Haab();
    this.lords = new Mayan.Lords();

    this.set(baktun,katun,tun,winal,kin);
};

Mayan.LongCount.prototype = {
    toString: function() {
        return [this.baktun,this.katun,this.tun,this.winal,this.kin].join(".");
    },

    setFromCount: function(count) {
        count %= this.maxDays;
        this.count = count;
        this.updateDependentCalendars();

        this.baktun = Math.floor(count / this.baktunDays);
        count %= this.baktunDays;
        this.katun = Math.floor(count / this.katunDays);
        count %= this.katunDays;
        this.tun = Math.floor(count / this.tunDays);
        count %= this.tunDays;
        this.winal = Math.floor(count / this.winalDays);
        this.kin = count % this.winalDays;
    },

    updateDependentCalendars: function() {
        this.tzolkin.setFromCount(this.count);
        this.haab.setFromCount(this.count);
        this.lords.setFromCount(this.count);
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
    setFromCount: function(count) {
        this.num = (this.numStart + count) % this.numCount;
        this.day = (this.dayStart + count) % this.dayCount;
    },

    toString: function() {
        return (this.num+1) + "." + Mayan.tzolkin_days[this.day];
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

    this.dayStart = 8;
    this.monthStart = 17; // kumku
};

Mayan.Haab.prototype = {
    setFromCount: function(count) {
        count = (count + this.monthStart*this.daysPerMonth + this.dayStart) % this.daysPerYear;
        this.month = Math.floor(count / this.daysPerMonth);
        this.day = count % this.daysPerMonth;
    },

    toString: function() {
        return this.day + "." + Mayan.haab_months[this.month];
    },
};

/////////////////////////////////
// Lords of the Night Calendar

Mayan.Lords = function() {
    this.lord = 0;
    this.lordCount = 9;
};

Mayan.Lords.prototype = {
    setFromCount: function(count) {
        this.lord = (count + 8) % this.lordCount;
    },

    toString: function() {
        return "G"+(this.lord+1);
    },
};

// run at startup for now
Mayan.runTests();

///////////
// Glyphs

Mayan.glyphs = {
    // numerals
    "0": "img/0.gif",
    "1": "img/1.gif",
    "2": "img/2.gif",
    "3": "img/3.gif",
    "4": "img/4.gif",
    "5": "img/5.gif",
    "6": "img/6.gif",
    "7": "img/7.gif",
    "8": "img/8.gif",
    "9": "img/9.gif",
    "10": "img/10.gif",
    "11": "img/11.gif",
    "12": "img/12.gif",
    "13": "img/13.gif",
    "14": "img/14.gif",
    "15": "img/15.gif",
    "16": "img/16.gif",
    "17": "img/17.gif",
    "18": "img/18.gif",
    "19": "img/19.gif",

    // long count
    "baktun": "img/baktun.gif",
    "katun": "img/katun.gif",
    "tun": "img/tun.gif",
    "winal": "img/winal.gif",
    "kin": "img/kin.gif",

    // tzolkin
    "ajaw": "img/tzolkin/ajaw.gif",
    "akbal": "img/tzolkin/akbal.gif",
    "ben": "img/tzolkin/ben.gif",
    "chikchan": "img/tzolkin/chikchan.gif",
    "chuwen": "img/tzolkin/chuwen.gif",
    "eb": "img/tzolkin/eb.gif",
    "etznab": "img/tzolkin/etznab.gif",
    "ik": "img/tzolkin/ik.gif",
    "imix": "img/tzolkin/imix.gif",
    "ix": "img/tzolkin/ix.gif",
    "kaban": "img/tzolkin/kaban.gif",
    "kan": "img/tzolkin/kan.gif",
    "kawak": "img/tzolkin/kawak.gif",
    "kib": "img/tzolkin/kib.gif",
    "kimi": "img/tzolkin/kimi.gif",
    "lamat": "img/tzolkin/lamat.gif",
    "manik": "img/tzolkin/manik.gif",
    "men": "img/tzolkin/men.gif",
    "muluk": "img/tzolkin/muluk.gif",
    "ok": "img/tzolkin/ok.gif",

    // haab
    "chen": "img/haab/chen.gif",
    "kankin": "img/haab/kankin.gif",
    "kayab": "img/haab/kayab.gif",
    "keh": "img/haab/keh.gif",
    "kumku": "img/haab/kumku.gif",
    "mak": "img/haab/mak.gif",
    "mol": "img/haab/mol.gif",
    "muwan": "img/haab/muwan.gif",
    "pax": "img/haab/pax.gif",
    "pop": "img/haab/pop.gif",
    "sak": "img/haab/sak.gif",
    "sek": "img/haab/sek.gif",
    "sip": "img/haab/sip.gif",
    "sotz": "img/haab/sotz.gif",
    "wayeb": "img/haab/wayeb.gif",
    "wo": "img/haab/wo.gif",
    "xul": "img/haab/xul.gif",
    "yax": "img/haab/yax.gif",
    "yaxkin": "img/haab/yaxkin.gif",

    // lords of the night
    "g1": "img/g1.gif",
    "g2": "img/g2.gif",
    "g3": "img/g3.gif",
    "g4": "img/g4.gif",
    "g5": "img/g5.gif",
    "g6": "img/g6.gif",
    "g7": "img/g7.gif",
    "g8": "img/g8.gif",
    "g9": "img/g9.gif",
};


