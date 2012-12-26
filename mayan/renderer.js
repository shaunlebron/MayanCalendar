Mayan.Renderer = function(stelaCanvas) {
    this.cal = new Mayan.LongCount;
    this.targetCal = new Mayan.LongCount;
    this.stela = new Mayan.Stela(stelaCanvas, this.cal);
};
Mayan.Renderer.prototype = {
    easeCalToTarget: function() {
        var targetCount = this.targetCal.count;
        var count = this.cal.smoothCount;
        if (targetCount != count) {
            if (Math.abs(targetCount-count) < 0.001) {
                this.cal.setSmoothCount(targetCount);
            }
            else {
                count += (targetCount-count) * 0.2;
                this.cal.setSmoothCount(count);
            }
        }
    },
    render: function() {
        this.easeCalToTarget();
        this.stela.render();

        var that = this;
        requestAnimationFrame(function(){that.render();});
    },
};
