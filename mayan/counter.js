// emulates a mechanical counter (e.g. odometer)

Mayan.MechCounter = function() {
    this.digits = Array.prototype.slice.call(arguments);
    var i;
    var weight = 1;
    for (i=0; i<this.digits.length; i++) {
        if (i<this.digits.length-1) {
            this.digits[i].carryDigit = this.digits[i+1];
        }
        this.digits[i].weight = weight;
        weight *= this.digits[i].base;
    }
    this.max = weight;
};

Mayan.MechCounter.prototype = {
    set: function(count) {
        this.digits[0].set(count);
    },
    toString: function() {
        return this.digits.map(function(x) { return x.count+""; }).reverse().join(":");
    },
    calcTotal: function() {
        return this.digits.map(function(x) { return x.getDigitValue() * x.weight; }).reduce(function(a,b) { return a+b; });
    },
};

Mayan.MechCounterDigit = function(count,base,carryDigit) {
    this.base = base;
    this.carryDigit = carryDigit;
    this.set(count);
};

Mayan.MechCounterDigit.prototype = {
    set: function(count) {
        this.abs_count = count;
        this.count = count % this.base;
        if (this.count < 0) {
            this.count += this.base;
        }

        var carry = this.carryDigit;
        var carryValue;
        if (carry) {
            carryValue = Math.floor(this.abs_count / this.base);
            if (this.count > (this.base-1)) {
                carryValue += (this.count % 1);
            }
            carry.set(carryValue)
        }
    },
    getDigitValue: function() {
        return Math.floor(this.count);
    },
};

Mayan.makeMechCounter = function() {

    var kinDigit =      new Mayan.MechCounterDigit(0,20);
    var winalDigit =    new Mayan.MechCounterDigit(0,18);
    var tunDigit =      new Mayan.MechCounterDigit(0,20);
    var katunDigit =    new Mayan.MechCounterDigit(0,20);
    var baktunDigit =   new Mayan.MechCounterDigit(0,20);
    var counter = new Mayan.MechCounter(kinDigit,winalDigit,tunDigit,katunDigit,baktunDigit);

    return counter;
};

