// Stela Canvas

Mayan.Stela = function(canvas,cal) {
    this.cal = cal;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.wheels = [
        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
            function() { return cal.smoothBaktun; }),
        new Mayan.StelaWheel(["baktun"]),

        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
            function() { return cal.smoothKatun; }),
        new Mayan.StelaWheel(["katun"]),

        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
            function() { return cal.smoothTun; }),
        new Mayan.StelaWheel(["tun"]),

        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"],
            function() { return cal.smoothWinal; }),
        new Mayan.StelaWheel(["winal"]),

        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
            function() { return cal.smoothKin; }),
        new Mayan.StelaWheel(["kin"]),

        new Mayan.StelaWheel(
            ["1","2","3","4","5","6","7","8","9","10","11","12","13"],
            function() { return cal.tzolkin.smoothNum; }),
        new Mayan.StelaWheel(
            Mayan.tzolkin_days,
            function() { return cal.tzolkin.smoothDay; }),

        new Mayan.StelaWheel(
            ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19"],
            function() { return cal.haab.smoothDay; },
            function() { return cal.haab.daysThisMonth; }),
        new Mayan.StelaWheel(
            Mayan.haab_months,
            function() { return cal.haab.smoothMonth; }),

        new Mayan.StelaWheel(
            ["g1","g2","g3","g4","g5","g6","g7","g8","g9"],
            function() { return cal.lords.smoothLord; }),
    ];

};

Mayan.Stela.prototype = {
    render: function() {
        var canvas = this.canvas;
        var ctx = this.ctx;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        var x = 0;
        var y = 0;
        var i;
        for (i=0; i<this.wheels.length; i++) {
            x += this.wheels[i].draw(ctx,x,y);
        }
    },
    getCanvasBounds: function() {
        var w = 0;
        var h = 0;
        var b;
        var bounds = Mayan.glyphBounds;
        for (b in bounds) {
            if (bounds.hasOwnProperty(b)) {
                h = Math.max(h, bounds[b].height);
                w += bounds[b].width;
            }
        }
        w += Mayan.glyphBounds["numerals"].width * 6;
        w += Mayan.glyphBounds["long"].width * 4;
        return [w,h];
    },
    updateCanvasSize: function() {
        var bounds = this.getCanvasBounds();
        this.canvas.width = bounds[0];
        this.canvas.height = bounds[1];
    },
};

Mayan.StelaWheel = function(names,getIndex,getLength) {
    if (getIndex == undefined) {
        getIndex = function() { return 0; };
    }
    if (getLength == undefined) {
        getLength = function() { return names.length; };
    }

    this.getIndex = getIndex;
    this.getLength = getLength;
    this.names = names;

    this.glyphGroup = Mayan.getGlyphGroup(names[0]);
    this.bounds = Mayan.glyphBounds[this.glyphGroup];
};

Mayan.StelaWheel.prototype = {
    draw: function(ctx,x,y) {
        var glyphs = Mayan.glyphImages;
        var index = this.getIndex(); 
        var length = this.getLength();

        var currIndex = Math.floor(index);
        var nextIndex = (currIndex + 1) % length;

        var currName = this.names[currIndex];
        var nextName = this.names[nextIndex];

        var currImg = Mayan.glyphImages[currName];
        var nextImg = Mayan.glyphImages[nextName];

        var w = this.bounds.width;
        var h = this.bounds.height;

        var y0 = (index % 1)*h;
        ctx.drawImage(nextImg,x,y+y0-h);
        var w0 = currImg.width, h0 = Math.max(0,currImg.height-y0);
        if (h0 > 0) {
            ctx.drawImage(currImg, 0,0,w0,h0, x,y+y0,w0,h0);
        }

        return w;
    },
};
