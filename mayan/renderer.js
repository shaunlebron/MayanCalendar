Mayan.Renderer = function(cal,stelaCanvas) {
    this.cal = cal;
    this.stela = new Mayan.Stela(stelaCanvas, cal);
    this.targetCal = new Mayan.LongCount;
};
Mayan.Renderer.prototype = {
    render: function() {
        this.stela.render();

        var that = this;
        requestAnimationFrame(function(){that.render();});
    },
};
