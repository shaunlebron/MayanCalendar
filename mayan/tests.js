/////////////////////
// Tests

(function(){

    var assertEqual = function(a,b) {
        if (a+"" !== b+"") {
            console.error("AssertEqual failed: (" + a + ", " + b +")");
        }
    };

    Mayan.runCalendarTests = function(){

        var c = new Mayan.LongCount();

        c.setFromCount(0);
        assertEqual(c.toString(),"0.0.0.0.0");
        assertEqual(c.count, 0);
        assertEqual(c.tzolkin.toString(), "4.ajaw");
        assertEqual(c.haab.toString(), "8.kumku");
        assertEqual(c.lords.toString(), "g9");
        assertEqual(c.getGregorian(), [-3113,8,11]);

        c.set(13,0,0,0,0);
        assertEqual(c.toString(),"13.0.0.0.0");
        assertEqual(c.count, 1872000);
        assertEqual(c.tzolkin.toString(), "4.ajaw");
        assertEqual(c.haab.toString(), "3.kankin");
        assertEqual(c.lords.toString(), "g9");
        assertEqual(c.getGregorian(), [2012,12,21]);

        c.setFromGregorian(1987,7,2);
        assertEqual(c.toString(),"12.18.14.2.16");
        assertEqual(c.count, 1862696);
        assertEqual(c.tzolkin.toString(), "8.kib");
        assertEqual(c.haab.toString(), "4.sek");
        assertEqual(c.lords.toString(), "g2");
        assertEqual(c.getGregorian(), [1987,7,2]);
    };

    Mayan.runMechCounterTests = function() {
        var counter = Mayan.makeMechCounter();

        assertEqual(counter.max, 2880000);

        var total = 1872005;
        counter.set(total);
        assertEqual(counter.toString(), "13:0:0:0:5");
        assertEqual(counter.calcTotal(), total);

        total = 1856375;
        counter.set(total);
        assertEqual(counter.toString(), "12:17:16:10:15");
        assertEqual(counter.calcTotal(), total);

        total = 1856375.25;
        counter.set(total);
        assertEqual(counter.toString(), "12:17:16:10:15.25");
        assertEqual(counter.calcTotal(), Math.floor(total));

        total = 1871999;
        counter.set(total);
        assertEqual(counter.toString(), "12:19:19:17:19");
        assertEqual(counter.calcTotal(), total);

        total = 1871999.25;
        counter.set(total);
        assertEqual(counter.toString(), "12.25:19.25:19.25:17.25:19.25");
        assertEqual(counter.calcTotal(), Math.floor(total));
    };

    // run
    Mayan.runCalendarTests();
    Mayan.runMechCounterTests();

})();
