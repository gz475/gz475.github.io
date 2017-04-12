(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['d3', 'jquery', 'hammer'], function(d3, $, Hammer) {
    return function() {
      var artistSet, axisPadding, base, colorWith, colorWithGenes, dMax, dispatch, dontTransition, height, image, image_size_range, innerHeight, innerWidth, isAvg, keyFunction, klass, margin, maxRadius, minimumImageSize, nodes, normalize, padding, r, rProp, ratioGene, width, x, xAxis, xAxisLabel, xNumFormat, xProp, xScale, xType, y, yAxis, yAxisLabel, yNumFormat, yProp, yScale, yType;
      image_size_range = d3.scale.threshold().range(["small", "medium", "large", "larger"]).domain([50, 75, 200]);
      nodes = [];
      klass = 'any';
      x = null;
      y = null;
      keyFunction = null;
      r = d3.scale.sqrt();
      dMax = null;
      yNumFormat = null;
      xNumFormat = null;
      xProp = null;
      yProp = null;
      rProp = null;
      width = null;
      height = null;
      normalize = false;
      isAvg = false;
      xAxisLabel = null;
      yAxisLabel = null;
      image = null;
      minimumImageSize = 14;
      maxRadius = null;
      yType = null;
      xType = null;
      ratioGene = null;
      xAxis = null;
      yAxis = null;
      xScale = null;
      yScale = null;
      margin = null;
      padding = null;
      axisPadding = 9;
      innerWidth = null;
      innerHeight = null;
      dontTransition = false;
      colorWith = function(d) {
        return null;
      };
      colorWithGenes = [];
      artistSet = function(d) {
        return [d];
      };
      dispatch = d3.dispatch('inspect', 'uninspect', 'select', 'transitionstep', 'transitionend');
      base = function(sel) {
        var applySharedStyles, node;
        applySharedStyles = function(node) {
          return node.style({
            'left': function(d) {
              return "" + d.left + "px";
            },
            'top': function(d) {
              return "" + d.top + "px";
            },
            'opacity': function(d, i) {
              if (d.inView) {
                return 1;
              } else {
                return 0;
              }
            }
          });
        };
        base.setRadii();
        node = sel.selectAll(".node." + klass + ":not(.exiting)").data(nodes, keyFunction);
        node.enter().append('div').classed('node', true).classed(klass, true).style({
          'width': 0,
          'height': 0,
          'margin-top': 0,
          'margin-left': 0
        }).on('mouseleave', function(d) {
          dispatch.uninspect();
          return sel.selectAll(".node." + klass).classed('inactive', false);
        }).on('mouseenter', function(d) {
          dispatch.inspect(artistSet(d));
          sel.selectAll(".node." + klass).classed('inactive', true);
          return d3.select(this).classed('inactive', false);
        }).each(function(d) {
          this.d = d;
          return Hammer(this, {
            preventDefault: true
          }).on('tap', function() {
            dispatch.select(artistSet(this.d));
            sel.selectAll(".node." + klass).classed('inactive', true);
            return d3.select(this).classed('inactive', false);
          });
        });
        node.each(function(d, i) {
          var cleanClasses, geneMax, _ref, _ref1;
          this.d = d;
          d.visNode = this;
          cleanClasses = d3.select(this).attr("class").replace(/geneColor\d+/g, "");
          if (colorWithGenes != null ? colorWithGenes.length : void 0) {
            geneMax = d.genes.filter(function(gene) {
              var _ref;
              return _ref = gene.ref.name, __indexOf.call(colorWithGenes, _ref) >= 0;
            }).reduce(function(geneMax, gene) {
              if ((geneMax != null) && gene.value <= geneMax.value) {
                return geneMax;
              } else {
                return gene;
              }
            }, null);
            if (geneMax != null) {
              cleanClasses += " geneColor" + colorWithGenes.indexOf(geneMax.ref.name);
            }
          }
          d3.select(this).attr({
            "class": cleanClasses
          });
          d.left = x != null ? x(xProp != null ? xProp(d, i) : 0) : 0;
          d.top = y != null ? y(yProp != null ? yProp(d, i) : 0) : 0;
          d.inView = (0 <= (_ref = d.left) && _ref <= width) && (0 <= (_ref1 = d.top) && _ref1 <= height);
          if (d.values != null) {
            d.gene_country_name = d.values[0].gene_country_name;
            d.hometown_country_name = d.values[0].hometown_country_name;
            return d.hometown = d.values[0].hometown;
          }
        });
        setTimeout(function() {
          return node.style({
            'transition-property': dontTransition ? "none" : "width, height, margin-top, margin-left, opacity, background-color",
            'pointer-events': "" + (rProp != null ? 'all' : 'none'),
            'width': function(d, i) {
              return "" + (2 * d.radius) + "px";
            },
            'height': function(d) {
              return "" + (2 * d.radius) + "px";
            },
            'margin-top': function(d) {
              return "" + (-d.radius) + "px";
            },
            'margin-left': function(d) {
              return "" + (-d.radius) + "px";
            },
            'background-image': function(d) {
              if (d.image !== "" && (d.image != null) && d.image !== "missing_image.png" && (2 * d.radius) > minimumImageSize) {
                return ("url('" + d.image + "')").replace("small", image_size_range(d.radius));
              } else {
                return "none";
              }
            }
          });
        }, 0);
        node.each(function(d, i) {
          if (d3.select(this).classed('group')) {
            if (dontTransition) {
              return applySharedStyles(d3.select(this));
            } else {
              return applySharedStyles(d3.select(this).transition().duration(1600));
            }
          } else {
            d3.select(this).style('transition-delay', function(d, i) {
              return i * 600 / nodes.length + 'ms';
            });
            return setTimeout((function(_this) {
              return function() {
                return applySharedStyles(d3.select(_this));
              };
            })(this), 0);
          }
        });
        if (!dontTransition) {
          node.sort(function(a, b) {
            return b.radius - a.radius;
          });
        }
        return node.exit().classed('exiting', true).style({
          'opacity': 0,
          'width': 0,
          'height': 0,
          'margin-top': 0,
          'margin-left': 0
        }).call(function(exitingGroups) {
          return setTimeout((function() {
            return exitingGroups.remove();
          }), 1000);
        });
      };
      base.yAxisLabel = function(_yl) {
        if (!arguments.length) {
          return yAxisLabel;
        }
        yAxisLabel = _yl;
        return base;
      };
      base.xAxisLabel = function(_xl) {
        if (!arguments.length) {
          return xAxisLabel;
        }
        xAxisLabel = _xl;
        return base;
      };
      base.nodes = function(n) {
        if (!arguments.length) {
          return nodes;
        }
        nodes = n;
        return base;
      };
      base.klass = function(k) {
        if (!arguments.length) {
          return klass;
        }
        klass = k;
        return base;
      };
      base.xProp = function(xp) {
        if (!arguments.length) {
          return xProp;
        }
        xProp = d3.functor(xp);
        return base;
      };
      base.yProp = function(yp) {
        if (!arguments.length) {
          return yProp;
        }
        yProp = yp;
        return base;
      };
      base.rProp = function(rp) {
        if (!arguments.length) {
          return rProp;
        }
        rProp = rp;
        return base;
      };
      base.dMax = function(dm) {
        if (!arguments.length) {
          return rMax;
        }
        dMax = dm;
        return base;
      };
      base.width = function(w) {
        if (!arguments.length) {
          return width;
        }
        width = w;
        return base;
      };
      base.height = function(h) {
        if (!arguments.length) {
          return height;
        }
        height = h;
        return base;
      };
      base.x = function(_x) {
        if (!arguments.length) {
          return x;
        }
        x = _x;
        return base;
      };
      base.y = function(_y) {
        if (!arguments.length) {
          return y;
        }
        y = _y;
        return base;
      };
      base.r = function(_r) {
        if (!arguments.length) {
          return r;
        }
        r = _r;
        return base;
      };
      base.maxRadius = function(_mR) {
        if (!arguments.length) {
          return maxRadius;
        }
        maxRadius = _mR;
        return base;
      };
      base.artistSet = function(_artistSet) {
        if (!arguments.length) {
          return artistSet;
        }
        artistSet = _artistSet;
        return base;
      };
      base.keyFunction = function(_key) {
        if (!arguments.length) {
          return keyFunction;
        }
        keyFunction = _key;
        return base;
      };
      base.innerHeight = function(_ih) {
        if (!arguments.length) {
          return innerHeight;
        }
        innerHeight = _ih;
        return base;
      };
      base.innerWidth = function(_iw) {
        if (!arguments.length) {
          return innerWidth;
        }
        innerWidth = _iw;
        return base;
      };
      base.innerHeight = function(_ih) {
        if (!arguments.length) {
          return innerHeight;
        }
        innerHeight = _ih;
        return base;
      };
      base.yNumFormat = function(_nf) {
        if (!arguments.length) {
          return yNumFormat;
        }
        yNumFormat = _nf;
        return base;
      };
      base.xNumFormat = function(_nf) {
        if (!arguments.length) {
          return xNumFormat;
        }
        xNumFormat = _nf;
        return base;
      };
      base.xScale = function(_xs) {
        if (!arguments.length) {
          return xScale;
        }
        xScale = _xs;
        return base;
      };
      base.yScale = function(_ys) {
        if (!arguments.length) {
          return yScale;
        }
        yScale = _ys;
        return base;
      };
      base.margin = function(_m) {
        if (!arguments.length) {
          return margin;
        }
        margin = _m;
        return base;
      };
      base.image = function(_i) {
        if (!arguments.length) {
          return image;
        }
        image = _i;
        return base;
      };
      base.colorWith = function(_cB) {
        if (!arguments.length) {
          return colorWith;
        }
        colorWith = _cB;
        return base;
      };
      base.colorWithGenes = function(_cWG) {
        if (!arguments.length) {
          return colorWithGenes;
        }
        colorWithGenes = _cWG;
        return base;
      };
      base.xType = function(_t) {
        if (!arguments.length) {
          return xType;
        }
        xType = _t;
        return base;
      };
      base.yType = function(_t) {
        if (!arguments.length) {
          return yType;
        }
        yType = _t;
        return base;
      };
      base.grabNode = function(criteria) {
        var n, _i, _len;
        for (_i = 0, _len = nodes.length; _i < _len; _i++) {
          n = nodes[_i];
          if (criteria(n)) {
            return n;
          }
        }
      };
      base.drawAxes = function(sel, xTicks) {
        var chart, svg, xSel, ySel;
        yAxis = d3.svg.axis().tickSize(7, 7).tickPadding(6).tickFormat(yNumFormat ? yNumFormat : void 0);
        xAxis = d3.svg.axis().tickSize(7, 7).tickPadding(6).tickFormat(xNumFormat ? xNumFormat : void 0);
        yAxis.scale(yScale).orient("left").ticks(5);
        xAxis.scale(xScale).orient("bottom");
        if (xTicks != null) {
          xAxis.tickValues(xTicks);
        }
        this.setInnerDimensions();
        chart = sel.select(".chart:not(.exiting)");
        svg = chart.select("g");
        if (chart.empty()) {
          chart = sel.append("svg").classed("chart", true);
          svg = chart.append("g");
        }
        chart.attr({
          "width": width,
          "height": height
        });
        svg.transition().attr({
          "transform": "translate(" + margin.left + " , " + margin.top + ")"
        });
        ySel = svg.select(".y.axis:not(.exiting)");
        if (ySel.empty()) {
          ySel = svg.append("g").classed("y axis yaxis", true);
          this.callY(ySel);
        }
        ySel.attr({
          "transform": "translate(" + (-1 * axisPadding) + ",0)"
        });
        xSel = svg.select(".x.axis:not(.exiting)");
        if (xSel.empty()) {
          xSel = svg.append("g").classed("x axis xaxis", true);
          this.callX(xSel);
        }
        xSel.attr({
          "transform": "translate(0 , " + (innerHeight + axisPadding) + ")"
        });
        return this.drawLabels(sel);
      };
      base.setRadii = function() {
        if (rProp != null) {
          r.domain([0, dMax != null ? dMax : d3.max(nodes, rProp)]);
        }
        r.range([0, maxRadius]);
        return nodes.forEach(function(d) {
          return d.radius = (rProp != null) && nodes.length > 1 ? r(rProp(d)) : nodes.length === 1 ? 10 : 0;
        });
      };
      base.drawLabels = function(sel) {
        var svg, xLabel, yLabel;
        padding = {
          left: 25,
          top: 8
        };
        svg = sel.select(".chart:not(.exiting)");
        xLabel = svg.select(".x.label");
        yLabel = svg.select(".y.label");
        if (xLabel.empty()) {
          xLabel = svg.append("text").classed('x label', true).text("");
        }
        xLabel.transition().attr({
          "text-anchor": "middle",
          "transform": "translate(" + (innerWidth / 2 + margin.left) + "," + (innerHeight + margin.top + margin.bottom - padding.top) + ")"
        });
        if (yLabel.empty()) {
          yLabel = svg.append("text").classed('y label', true).text("");
        }
        yLabel.attr({
          "text-anchor": "middle",
          "transform": "translate(" + padding.left + "," + (margin.top + innerHeight / 2) + ")rotate(-90)"
        });
        xLabel.text(xAxisLabel);
        return yLabel.text(yAxisLabel);
      };
      base.callX = function(xSel) {
        return xSel.transition().duration(600).call(xAxis);
      };
      base.callY = function(ySel) {
        return ySel.transition().duration(600).call(yAxis);
      };
      base.setRange = function() {
        this.setInnerDimensions();
        xScale.range([0, innerWidth]);
        return yScale.range([innerHeight, 0]);
      };
      base.setInnerDimensions = function() {
        margin = {
          top: 95,
          bottom: 75
        };
        margin.left = 100 + 95 * (yType === "ordinal");
        margin.right = 100 + 10 * (ratioGene != null);
        innerWidth = width - margin.left - margin.right;
        return innerHeight = height - margin.top - margin.bottom;
      };
      base.drawLineTicks = function(sel) {
        var chart, lAxis, lScale, lSel;
        chart = sel.select(".chart:not(.exiting)>g");
        lScale = yScale;
        lAxis = d3.svg.axis().ticks(5).tickSize(-1 * innerWidth);
        lAxis.scale(lScale).orient("left");
        lSel = chart.select(".l.axis:not(.exiting)");
        if (lSel.empty()) {
          lSel = chart.append("g").classed("l axis laxis", true);
        }
        return lSel.transition().duration(600).call(lAxis);
      };
      base.normalize = function(_n) {
        if (!arguments.length) {
          return normalize;
        }
        normalize = _n;
        return base;
      };
      base.isAvg = function(_avg) {
        if (!arguments.length) {
          return isAvg;
        }
        isAvg = _avg;
        return base;
      };
      base.isAvg = function(_avg) {
        if (!arguments.length) {
          return isAvg;
        }
        isAvg = _avg;
        return base;
      };
      base.ratioGene = function(_rg) {
        if (!arguments.length) {
          return ratioGene;
        }
        ratioGene = _rg;
        return base;
      };
      base.dontTransition = function(_dT) {
        if (!arguments.length) {
          return dontTransition;
        }
        dontTransition = _dT;
        return base;
      };
      base.yAxis = function() {
        return yAxis;
        return base;
      };
      base.clean = function(sel, deps) {
        var dep, duration, selectors, waste, _i, _len;
        if (deps == null) {
          deps = [];
        }
        this.setInnerDimensions();
        selectors = ['.node', '.group', '#vectorMap', '.axis', '.gene', '.line', '.chart', '.bar', '.bin', '.text', '.errortext', '.yaxis', '.xaxis', '.raxis', '.rlabel', '.laxis', '.ratio-line', '.legend', '.key'];
        waste = sel.selectAll(selectors);
        for (_i = 0, _len = deps.length; _i < _len; _i++) {
          dep = deps[_i];
          waste = waste.filter(":not(" + dep + ")");
        }
        duration = 1000;
        waste.filter('.legend').style({
          "opacity": 0
        });
        waste.filter('.node').style({
          'opacity': 0,
          'width': 0,
          'height': 0,
          'margin-top': 0,
          'margin-left': 0
        });
        waste.filter('.group').style({
          'opacity': 0,
          'width': 0,
          'height': 0,
          'margin-top': 0,
          'margin-left': 0
        });
        waste.filter('#vectorMap').attr({
          'fill-opacity': 0,
          'stroke-width': 0
        });
        waste.filter('.raxis').attr({
          'fill-opacity': 0,
          'stroke-opacity': 0
        });
        waste.filter('.xaxis').attr({
          'fill-opacity': 0,
          'stroke-opacity': 0
        });
        waste.filter('.laxis').attr({
          'fill-opacity': 0,
          'stroke-opacity': 0
        });
        waste.filter('.yaxis').attr({
          'fill-opacity': 0,
          'stroke-opacity': 0
        });
        waste.filter('.gene').style({
          'opacity': 0
        });
        waste.filter('path.line').each(function(d, i) {
          var length;
          length = this.getTotalLength();
          return d3.select(this).attr({
            'stroke-opacity': 1,
            'stroke-dasharray': "0px " + length + "px " + length + "px 0px",
            'stroke-dashoffset': "-" + length + "px"
          });
        }).transition().duration(duration).attr({
          'stroke-dashoffset': function() {
            return "0px";
          },
          'stroke-opacity': 0
        });
        waste.filter('.ratio-line').each(function(d, i) {
          return d3.select(this).attr({
            'stroke-opacity': 1
          });
        }).transition().duration(duration).attr({
          'stroke-opacity': 0
        });
        waste.filter('.bar').transition().duration(duration).attr({
          'fill-opacity': 0,
          'width': 0
        });
        waste.filter('.key').transition().duration(duration).attr({
          'stroke-opacity': 0,
          'fill-opacity': 0
        });
        waste.filter('.bin').transition().duration(duration).attr({
          'fill-opacity': 0,
          'height': 0,
          'y': innerHeight
        });
        waste.filter('.text').text("");
        waste.filter('.rlabel').text("");
        waste.filter('.errortext').text("");
        return waste.classed('exiting', true).call(function(exiting) {
          return setTimeout((function() {
            return exiting.remove();
          }), duration);
        });
      };
      return d3.rebind(base, dispatch, 'on', 'inspect', 'uninspect', 'select', 'transitionstep', 'transitionend');
    };
  });

}).call(this);
