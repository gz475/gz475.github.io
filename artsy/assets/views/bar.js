(function() {
  define(['views/view_base', 'd3', 'hammer'], function(viewBase, d3, Hammer) {
    return function() {
      var bar, base, styleAxes;
      base = viewBase();
      styleAxes = function(xSel, ySel) {
        xSel.select("path").attr({
          "display": "block"
        });
        ySel.select("path").attr({
          "display": "none"
        });
        ySel.selectAll("line").attr({
          "stroke-width": 0
        });
        return ySel.selectAll("text").style({
          "font-size": "12px",
          "font-weight": "normal"
        });
      };
      bar = function(sel) {
        var artists, chart, delayLength, deps, key, sortedArtists, xSc, xSel, ySc, ySel, _i, _len, _ref;
        window.clearTimeout(this.enterTimeout);
        window.clearTimeout(this.updateTimeout);
        window.clearTimeout(this.exitTimeout);
        base.clean(sel, deps = ['.xaxis', '.yaxis', '.chart', '.bar']);
        artists = base.nodes();
        if (Array.isArray((_ref = artists[0]) != null ? _ref.values : void 0)) {
          sortedArtists = [];
          for (_i = 0, _len = artists.length; _i < _len; _i++) {
            key = artists[_i];
            sortedArtists = sortedArtists.concat(key.values);
          }
          artists = sortedArtists;
        }
        base.yScale(d3.scale.ordinal());
        base.xScale(d3.scale.linear());
        base.yScale().domain(artists.map(function(d) {
          return d['name'];
        }));
        base.xScale().domain([
          0, d3.max(artists, function(d) {
            return base.xProp()(d);
          })
        ]);
        base.setRange();
        base.yScale().rangeRoundBands([0, base.innerHeight()], .075);
        base.drawAxes(sel);
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
        styleAxes(xSel, ySel);
        xSc = base.xScale();
        ySc = base.yScale();
        chart = sel.select(".chart:not(.exiting)>g");
        bar = chart.selectAll(".bar:not(.exiting)").data(artists, function(d) {
          return base.yProp()(d);
        });
        delayLength = 0;
        bar.exit().each(function(d, i) {
          return delayLength = 600;
        });
        bar.exit().transition().duration(600).attr({
          "width": 0
        });
        this.exitTimeout = window.setTimeout(function() {
          return bar.exit().remove();
        }, 600);
        this.enterTimeout = window.setTimeout(function() {
          var enters, yTicks;
          base.callX(xSel);
          base.callY(ySel);
          styleAxes(xSel, ySel);
          yTicks = ySel.selectAll("text");
          yTicks.classed("ranking", true).each(function() {
            var a, curArtist, _j, _len1, _results;
            curArtist = d3.select(this).text();
            _results = [];
            for (_j = 0, _len1 = artists.length; _j < _len1; _j++) {
              a = artists[_j];
              if (curArtist === a.name) {
                Hammer(this, {
                  preventDefault: true
                }).on('tap', function() {
                  return base.select(a);
                });
                break;
              } else {
                _results.push(void 0);
              }
            }
            return _results;
          });
          enters = bar.enter().append("rect");
          enters.attr({
            "class": function(d) {
              return "bar " + d['gender'];
            },
            'fill-opacity': 0,
            "x": 0,
            "y": function(d) {
              return ySc(d['name']);
            },
            "width": 0,
            "height": ySc.rangeBand()
          }).each(function(d) {
            return Hammer(this, {
              preventDefault: true
            }).on('tap', function() {
              return base.select(d);
            });
          });
          return enters.transition().duration(600).attr({
            'fill-opacity': 1,
            "x": 0,
            "y": function(d) {
              return ySc(d['name']);
            },
            "width": function(d) {
              return xSc(base.xProp()(d));
            },
            "height": ySc.rangeBand()
          });
        }, delayLength * 2);
        return this.updateTimeout = window.setTimeout(function() {
          base.callX(xSel);
          base.callY(ySel);
          styleAxes(xSel, ySel);
          return bar.attr({
            'fill-opacity': 1
          }).transition().duration(600).attr({
            'fill-opacity': 1,
            "x": 0,
            "y": function(d) {
              return ySc(d['name']);
            },
            "width": function(d) {
              return xSc(base.xProp()(d));
            },
            "height": ySc.rangeBand()
          });
        }, delayLength);
      };
      return d3.rebind(bar, base, 'nodes', 'xType', 'yType', 'isAvg', 'yAxisLabel', 'xAxisLabel', 'normalize', 'klass', 'width', 'height', 'innerHeight', 'xScale', 'yScale', 'yProp', 'xProp', 'yNumFormat', 'xNumFormat', 'setRange', 'setRangeBoundBands', 'drawAxes', 'on');
    };
  });

}).call(this);
