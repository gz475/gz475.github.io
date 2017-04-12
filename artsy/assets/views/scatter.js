(function() {
  var __slice = [].slice;

  define(['views/view_base', 'd3'], function(viewBase, d3) {
    return function() {
      var base, baseMethods, colorWithGenes, scatter, styleAxes;
      colorWithGenes = [];
      base = viewBase().keyFunction(function(d) {
        return d.slug;
      }).klass('artist');
      styleAxes = function(xSel, ySel) {
        xSel.select("path").attr({
          "display": "block"
        });
        ySel.select("path").attr({
          "display": "block"
        });
        ySel.selectAll("line").attr({
          "stroke-width": 1
        });
        return ySel.selectAll("text").style({
          "font-size": "12px",
          "font-weight": "normal"
        });
      };
      scatter = function(sel) {
        var chart, deps, xExt, xSc, xSel, yExt, ySc, ySel;
        base.clean(sel, deps = ['.artist', '.xaxis', '.yaxis', '.chart', '.errortext']);
        base.xScale(d3.scale.linear());
        base.yScale(d3.scale.sqrt());
        xExt = d3.extent(base.nodes(), base.xProp());
        yExt = d3.extent(base.nodes(), base.yProp());
        chart = sel.select(".chart:not(.exiting)>g");
        if (base.nodes().length === 1) {
          chart.select(".errortext").remove();
          base.xScale().domain([Math.max(xExt[0] - 1, 0), xExt[1] + 1]);
          base.yScale().domain([Math.max(yExt[0] - 1, 0), yExt[1] + 1]);
        } else if (base.nodes().length === 0) {
          chart.select(".errortext").remove();
          chart.append("text").attr({
            "class": "errortext",
            "x": base.width() / 3,
            "y": base.height() / 3
          }).text("There are no artists to display");
        } else {
          chart.select(".errortext").remove();
          base.xScale().domain(xExt);
          base.yScale().domain(yExt);
        }
        base.setRange();
        xSc = base.xScale();
        ySc = base.yScale();
        base.x(function(val) {
          return xSc(val) + base.margin().left;
        });
        base.y(function(val) {
          return ySc(val) + base.margin().top;
        });
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
        base.drawAxes(sel);
        base.callX(xSel);
        base.callY(ySel);
        styleAxes(xSel, ySel);
        return sel.call(base);
      };
      baseMethods = ['nodes', 'klass', 'xType', 'yType', 'xProp', 'yAxisLabel', 'xAxisLabel', 'yProp', 'rProp', 'width', 'height', 'xNumFormat', 'yNumFormat', 'xScale', 'yScale', 'setRange', 'drawAxes', 'on', 'image', 'maxRadius', 'colorWith', 'colorWithGenes'];
      return d3.rebind.apply(d3, [scatter, base].concat(__slice.call(baseMethods)));
    };
  });

}).call(this);
