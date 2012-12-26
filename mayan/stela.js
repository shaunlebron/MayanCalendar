// Stela Canvas

Mayan.Stela = function(canvas,cal) {
    this.cal = cal;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
};

Mayan.Stela.prototype = {
    render: function() {
        var canvas = this.canvas;
        var ctx = this.ctx;
        var cal = this.cal;
        var glyphs = Mayan.glyphImages;

        ctx.clearRect(0,0,canvas.width,canvas.height);
        var x = 0;
        var y = 0;
        var drawGlyph = function(g) {
            var img = glyphs[g];
            ctx.drawImage(img, x, y);
            x += img.width;
        };
        drawGlyph(cal.baktun);
        drawGlyph("baktun");
        drawGlyph(cal.katun);
        drawGlyph("katun");
        drawGlyph(cal.tun);
        drawGlyph("tun");
        drawGlyph(cal.winal);
        drawGlyph("winal");
        drawGlyph(cal.kin);
        drawGlyph("kin");
        drawGlyph(cal.tzolkin.getNumName());
        drawGlyph(cal.tzolkin.getDayName());
        drawGlyph(cal.haab.getDayName());
        drawGlyph(cal.haab.getMonthName());
        drawGlyph(cal.lords.toString());
    },
};
