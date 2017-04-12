(function() {
  define(['views/view_base', 'd3'], function(viewBase, d3) {
    return function() {
      var barGenes, base, genes, _splitByGene, _totalsByXprop;
      base = viewBase();
      genes = [];
      _totalsByXprop = function(artists) {
        if (genes != null) {
          return d3.nest().key(function(artist) {
            return _.intersection(genes, artist.genes.map(function(gene) {
              return gene.ref.name;
            }));
          }).rollup(function(keyedArtists) {
            var artist, denominator, total, v, val, _i, _len;
            val = 0;
            total = 0;
            denominator = 0;
            for (_i = 0, _len = keyedArtists.length; _i < _len; _i++) {
              artist = keyedArtists[_i];
              if (base.isAvg()) {
                denominator += artist['num_auctions'];
              }
              val += base.yProp()(artist);
              total++;
            }
            v = denominator === 0 ? val : val / denominator;
            return {
              yProp: v,
              total: total
            };
          }).entries(artists);
        } else {
          return artists;
        }
      };
      _splitByGene = function(counts) {
        var count, g, gene, group_set, t, tempstring, _i, _j, _k, _l, _len, _len1, _len2, _len3;
        group_set = [];
        for (_i = 0, _len = genes.length; _i < _len; _i++) {
          gene = genes[_i];
          group_set.push({
            key: gene
          });
        }
        for (_j = 0, _len1 = counts.length; _j < _len1; _j++) {
          count = counts[_j];
          tempstring = count.key.split(",");
          for (_k = 0, _len2 = tempstring.length; _k < _len2; _k++) {
            t = tempstring[_k];
            if (!(tempstring.length > 1)) {
              for (_l = 0, _len3 = group_set.length; _l < _len3; _l++) {
                g = group_set[_l];
                if (t === g.key) {
                  g.values = count.values.yProp;
                }
              }
            }
          }
        }
        return group_set;
      };
      barGenes = function(sel) {
        var bar, chart, counts, deps, xSc, xSel, ySc, ySel;
        base.clean(sel, deps = ['.xaxis', '.yaxis', '.chart', '.bar']);
        counts = _totalsByXprop(base.nodes());
        counts = _splitByGene(counts);
        base.xScale(d3.scale.ordinal());
        base.yScale(d3.scale.linear());
        base.xScale().domain(counts.map(function(d) {
          return d.key;
        }));
        base.yScale().domain([
          0, d3.sum(counts, function(d) {
            return d.values;
          })
        ]);
        base.setRange();
        base.xScale().rangeRoundBands([0, base.innerWidth()], .1);
        base.drawAxes(sel);
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
        base.callX(xSel);
        base.callY(ySel);
        xSc = base.xScale();
        ySc = base.yScale();
        chart = sel.select(".chart:not(.exiting)>g");
        bar = chart.selectAll(".bar:not(.exiting)").data(counts, function(d) {
          return d.key;
        });
        bar.enter().append("rect").attr({
          "class": "bar",
          'fill-opacity': 0
        });
        bar.exit().remove();
        return window.setTimeout(function() {
          return bar.attr({
            'fill-opacity': 1
          }).transition().attr({
            'fill-opacity': 1,
            "x": function(d) {
              return xSc(d.key);
            },
            "y": function(d) {
              return ySc(d.values);
            },
            "width": xSc.rangeBand(),
            "height": function(d) {
              return base.innerHeight() - ySc(d.values);
            }
          });
        }, 0);
      };
      barGenes.genes = function(_g) {
        if (!arguments.length) {
          return _g;
        }
        genes = _g;
        return barGenes;
      };
      return d3.rebind(barGenes, base, 'nodes', 'xType', 'yType', 'isAvg', 'yAxisLabel', 'xAxisLabel', 'normalize', 'klass', 'width', 'height', 'innerWidth', 'innerHeight', 'xScale', 'yScale', 'yProp', 'xProp', 'yNumFormat', 'setRange', 'setRangeBoundBands', 'drawAxes', 'on');
    };
  });

}).call(this);
