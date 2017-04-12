(function() {
  define(['views/view_base', 'd3', 'hammer'], function(viewBase, d3, Hammer) {
    return function() {
      var base, bounds, histogram, isTotal, sizeByProp, sizeBySums, styleAxes;
      base = viewBase();
      sizeByProp = null;
      isTotal = false;
      bounds = null;
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
      sizeBySums = function(artists) {
        return artists.reduce(function(sum, d) {
          if (sizeByProp(d) != null) {
            return sum += sizeByProp(d);
          } else {
            return sum;
          }
        }, 0);
      };
      histogram = function(sel) {
        var artist, b, bin, binBounds, bin_nodes, bins, chart, colorWithGenes, curY, deps, gene, geneClass, gene_bins, gene_map, i, values, xSc, xSel, ySc, ySel, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _m, _n, _ref, _ref1;
        base.clean(sel, deps = ['.xaxis', '.yaxis', '.chart', '.bin']);
        if (base.xType() === 'time') {
          if (bounds == null) {
            bounds = d3.extent(base.nodes(), base.xProp());
          }
        } else {
          if (bounds == null) {
            bounds = [0, d3.max(base.nodes(), base.xProp())];
          }
        }
        base.yScale(d3.scale.linear());
        base.xScale(d3.scale.linear().domain(bounds));
        binBounds = base.xScale().ticks(20);
        if (base.xType() === "time") {
          binBounds = binBounds.filter(function(bound) {
            return bound % 1 < 1e-6;
          });
        }
        bin_nodes = d3.layout.histogram().value(base.xProp()).range(bounds).bins(binBounds);
        bins = bin_nodes(base.nodes());
        colorWithGenes = base.colorWithGenes().filter(function(d) {
          return d != null;
        });
        gene_bins = [];
        if ((colorWithGenes != null) && colorWithGenes.length) {
          for (_i = 0, _len = bins.length; _i < _len; _i++) {
            b = bins[_i];
            gene_map = {};
            for (_j = 0, _len1 = colorWithGenes.length; _j < _len1; _j++) {
              gene = colorWithGenes[_j];
              gene_map[gene] = [];
            }
            for (_k = 0, _len2 = b.length; _k < _len2; _k++) {
              artist = b[_k];
              _ref = artist.genes;
              for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
                gene = _ref[_l];
                if (gene.ref.name in gene_map) {
                  gene_map[gene.ref.name].push(artist);
                }
              }
            }
            curY = 0;
            for (i = _m = 0, _len4 = colorWithGenes.length; _m < _len4; i = ++_m) {
              gene = colorWithGenes[i];
              geneClass = gene != null ? "geneColor" + i : null;
              values = (_ref1 = gene_map[gene]) != null ? _ref1 : [];
              values.geneClass = geneClass;
              values.x = b.x;
              values.dx = b.dx;
              values.dy = sizeByProp != null ? sizeBySums(values) : values.length;
              values.y = curY;
              values.gene = gene;
              curY += values.dy;
              gene_bins.push(values);
            }
          }
        } else {
          for (_n = 0, _len5 = bins.length; _n < _len5; _n++) {
            values = bins[_n];
            values.dy = sizeByProp != null ? sizeBySums(values) : values.length;
            values.y = 0;
            gene_bins.push(values);
          }
        }
        base.yScale().domain([
          0, d3.max(gene_bins, function(d) {
            return d.y + d.dy;
          })
        ]);
        base.setRange();
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
        base.drawAxes(sel, binBounds);
        base.callX(xSel);
        base.callY(ySel);
        styleAxes(xSel, ySel);
        window.gene_bins = gene_bins;
        xSc = base.xScale();
        ySc = base.yScale();
        chart = sel.select(".chart:not(.exiting)>g");
        bin = chart.selectAll(".bin:not(.exiting)").data(gene_bins, function(d) {
          return "" + d.x + " ," + d.gene;
        });
        bin.enter().append("rect").attr({
          'fill-opacity': 0,
          "x": function(d) {
            return xSc(d.x);
          },
          "y": base.innerHeight(),
          "width": function(d, i) {
            return xSc(d.x + d.dx) - xSc(d.x);
          },
          "height": 0
        });
        bin.attr({
          "class": function(d) {
            if (d.geneClass != null) {
              return "" + d.geneClass + " bin";
            } else {
              return "bin";
            }
          }
        }).each(function(d) {
          return Hammer(this).on('tap', function() {
            return base.select(d);
          });
        }).transition().duration(500).attr({
          'fill-opacity': 1,
          "x": function(d) {
            return xSc(d.x);
          },
          "y": function(d) {
            return Math.floor(ySc(d.dy + d.y));
          },
          "width": function(d, i) {
            return (xSc(d.x + d.dx) - xSc(d.x)) - 1;
          },
          "height": function(d, i) {
            return Math.ceil(base.innerHeight() - ySc(d.dy));
          }
        });
        return bin.exit().transition().duration(500).attr({
          'fill-opacity': 0,
          "y": base.innerHeight(),
          "height": 0
        }).remove();
      };
      histogram.sizeByProp = function(_sp) {
        if (!arguments.length) {
          return sizeByProp;
        }
        sizeByProp = _sp;
        return histogram;
      };
      histogram.bounds = function(_b) {
        if (!arguments.length) {
          return bounds;
        }
        bounds = _b;
        return histogram;
      };
      return d3.rebind(histogram, base, 'yScale', 'colorWithGenes', 'colorWith', 'xType', 'on', 'yType', 'xScale', 'innerWidth', 'setRange', 'drawAxes', 'yProp', 'klass', 'width', 'height', 'xProp', 'nodes', 'xAxisLabel', 'xNumFormat', 'yAxisLabel', 'yNumFormat');
    };
  });

}).call(this);
