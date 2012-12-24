// emulates a mechanical counter (e.g. odometer)

Mayan.MechCounter = function(count,base,carryCounter) {
    this.count = count;
    this.base = base;
    this.carryCounter = null;
};

Mayan.MechCounter.prototype = {
    set: function(count) {
        this.count = count % this.base;
        if (this.count < 0) {
            this.count += this.base;
        }

        var carry = this.carryCounter;
        if (carry && this.count > (this.base-1)) {
            carry.set(Math.floor(carry.count) + (this.count % 1)
        }
    },
};
