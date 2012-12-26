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
            var bounds = Mayan.glyphBounds[Mayan.getGlyphGroup(g)];
            x += bounds.width;
        };
        drawGlyph(String(cal.baktun));
        drawGlyph("baktun");
        drawGlyph(String(cal.katun));
        drawGlyph("katun");
        drawGlyph(String(cal.tun));
        drawGlyph("tun");
        drawGlyph(String(cal.winal));
        drawGlyph("winal");
        drawGlyph(String(cal.kin));
        drawGlyph("kin");
        drawGlyph(cal.tzolkin.getNumName());
        drawGlyph(cal.tzolkin.getDayName());
        drawGlyph(cal.haab.getDayName());
        drawGlyph(cal.haab.getMonthName());
        drawGlyph(cal.lords.toString());
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
