(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['views/view_base', 'd3'], function(viewBase, d3) {
    return function() {
      var base, birth_years, cumulative, filtered_genes, genes, isTotal, lineGenes, living, maxYear, minYear, normalize, ratio, ratioGene, ratioLine, ratios, ryScale, styleAxes, xSc, ySc, _aliveByYear, _birthyearsArray, _generateRatioGeneData, _generateRatiosData, _keyGenes;
      base = viewBase();
      isTotal = false;
      genes = [];
      ratioGene = null;
      normalize = false;
      ratios = false;
      minYear = 0;
      maxYear = 0;
      birth_years = [];
      living = null;
      ratioLine = null;
      ratio = null;
      xSc = null;
      ySc = null;
      ryScale = null;
      filtered_genes = null;
      cumulative = true;
      _generateRatioGeneData = function(gene, total) {
        var d, i, r, rt, _i, _len;
        rt = [];
        if (total.length === 0 || (gene == null)) {
          return rt;
        } else {
          for (i = _i = 0, _len = gene.length; _i < _len; i = ++_i) {
            d = gene[i];
            r = total[i].lineY > 0 ? d.lineY / total[i].lineY : 0;
            rt.push({
              year: d.year,
              ratio: r
            });
          }
          return rt;
        }
      };
      _generateRatiosData = function(genes) {
        var d, data, gene, i, r, total, _i, _len;
        total = genes["_"];
        for (gene in genes) {
          data = genes[gene];
          if (gene !== "_") {
            for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
              d = data[i];
              r = total[i].lineY > 0 ? d.lineY / total[i].lineY : 0;
              genes[gene][i].ratio = r;
            }
          }
        }
        return genes;
      };
      _keyGenes = function() {
        var artist, artistGenes, g, gene, group_set, i, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref;
        group_set = [];
        if (genes != null) {
          for (_i = 0, _len = genes.length; _i < _len; _i++) {
            gene = genes[_i];
            group_set.push({
              key: gene,
              artists: []
            });
          }
          _ref = base.nodes();
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            artist = _ref[_j];
            artistGenes = _.intersection(genes, artist.genes.map(function(gene) {
              return gene.ref.name;
            }));
            for (_k = 0, _len2 = artistGenes.length; _k < _len2; _k++) {
              g = artistGenes[_k];
              for (_l = 0, _len3 = group_set.length; _l < _len3; _l++) {
                i = group_set[_l];
                if (g === i.key) {
                  i.artists.push(artist);
                }
              }
            }
          }
          group_set.push({
            key: "_",
            artists: base.nodes()
          });
        } else {
          group_set = base.nodes();
        }
        return group_set;
      };
      _birthyearsArray = function() {
        var artist, _i, _len, _ref, _ref1;
        birth_years = [];
        _ref = base.nodes();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          artist = _ref[_i];
          if (_ref1 = artist['birth_date'], __indexOf.call(birth_years, _ref1) < 0) {
            birth_years.push(artist['birth_date']);
          }
        }
        return birth_years.sort(function(a, b) {
          return a - b;
        });
      };
      _aliveByYear = function(group) {
        var alive, byYear, gene, isAvg, lineY, _i, _len;
        alive = {};
        _birthyearsArray();
        isAvg = base.isAvg();
        for (_i = 0, _len = group.length; _i < _len; _i++) {
          gene = group[_i];
          byYear = _.groupBy(gene.artists, "birth_date");
          lineY = 0;
          alive[gene.key] = birth_years.map((function(_this) {
            return function(year) {
              var _ref;
              if (!cumulative) {
                lineY = 0;
              }
              return {
                year: year,
                lineY: lineY += d3.sum((_ref = byYear[year]) != null ? _ref : [], function(d) {
                  return base.yProp()(d);
                })
              };
            };
          })(this));
        }
        return alive;
      };
      styleAxes = function(xSel, ySel) {
        xSel.select("path").attr({
          "display": "none"
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
      lineGenes = function(sel) {
        var chart, clip, clipRect, clipRectPadding, dashsize, data, defs, deps, gene, geneArray, kg, lSel, labelPos, lineFn, lines, max, padding, prev_xSc, rAxis, rHeight, rLabel, rSel, rl, rt, tSel, tweenPathString, xSel, yMax, ySel;
        base.clean(sel, deps = ['.xaxis', '.yaxis', '.chart', '.line', '.text', '.laxis', '.raxis', '.rlabel', '.ratio-line']);
        ratioGene = base.ratioGene();
        normalize = base.normalize();
        kg = _keyGenes();
        living = _aliveByYear(kg);
        ratio = [];
        base.xScale(d3.scale.linear());
        base.yScale(d3.scale.linear());
        if ((birth_years != null ? birth_years.length : void 0) > 0) {
          base.xScale().domain(d3.extent(birth_years));
        }
        if (ratios) {
          base.yScale().domain([0, 1]).nice();
        } else {
          max = [];
          for (gene in living) {
            data = living[gene];
            if (gene !== "_") {
              max.push(d3.max(data, function(d) {
                return d.lineY;
              }));
            }
          }
          if (max.length !== 0) {
            yMax = d3.max(max);
            base.yScale().domain([0, yMax]).nice();
          }
          rHeight = base.yScale()(yMax);
        }
        base.setRange();
        if ((ratioGene != null) && __indexOf.call(genes, ratioGene) >= 0) {
          rt = _generateRatioGeneData(living[ratioGene], living["_"]);
          ratio = [
            {
              key: "ratio",
              value: rt
            }
          ];
          ryScale = d3.scale.linear();
          ryScale.domain([0, 1]);
          padding = 15;
          labelPos = 75;
          ryScale.range([base.innerHeight(), rHeight]);
        } else if (ratios) {
          living = _generateRatiosData(living);
        }
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
        chart = sel.select(".chart:not(.exiting)>g");
        if (chart.empty()) {
          sel.append("svg").classed("chart", true).attr({
            "width": base.width(),
            "height": base.height()
          }).append("g");
          chart = sel.select(".chart:not(.exiting)>g");
        }
        if ((defs = chart.select("defs")).empty()) {
          defs = chart.append("defs");
        }
        if ((clip = defs.select("#chart-clip")).empty()) {
          clip = defs.append("clipPath").attr("id", "chart-clip");
        }
        if ((clipRect = clip.select("rect")).empty()) {
          clipRect = clip.append("rect");
        }
        clipRectPadding = 2;
        clipRect.attr({
          "x": -clipRectPadding,
          "y": -clipRectPadding,
          "width": base.innerWidth() + clipRectPadding * 2,
          "height": base.innerHeight() + clipRectPadding * 2
        });
        if ((birth_years != null ? birth_years.length : void 0) > 0) {
          base.drawAxes(sel);
          base.callX(xSel);
          base.callY(ySel);
          base.drawLineTicks(sel);
          styleAxes(xSel, ySel);
        } else {
          xSel.remove();
          ySel.remove();
          d3.select(".y.label").remove();
          d3.select(".x.label").remove();
          d3.select(".laxis").remove();
        }
        rSel = chart.select(".r.axis:not(.exiting)");
        rLabel = chart.select(".r.label:not(.exiting)");
        if ((ratioGene != null) && __indexOf.call(genes, ratioGene) >= 0) {
          rAxis = d3.svg.axis().ticks(5).tickFormat(d3.format("%"));
          rAxis.scale(ryScale).orient("right");
          if (rSel.empty()) {
            rSel = chart.append("g").classed("r axis raxis", true);
          }
          rSel.attr({
            "transform": "translate(" + (base.innerWidth() + padding) + " , 0)"
          });
          rSel.transition().duration(600).call(rAxis);
          if (rLabel.empty()) {
            rLabel = chart.append("text").classed('r label rlabel', true);
          }
          rLabel.attr({
            "text-anchor": "middle",
            "transform": "translate(" + (base.innerWidth() + labelPos) + "," + (base.innerHeight() / 2) + ")rotate(-90)"
          });
          rLabel.text("% " + ratioGene);
        } else {
          rSel.remove();
          rLabel.remove();
        }
        prev_xSc = xSc;
        xSc = base.xScale();
        ySc = base.yScale();
        if (base.nodes().length === 1) {
          chart.select(".errortext").remove();
          chart.append("text").attr({
            "class": "errortext",
            "x": base.width() / 2,
            "y": base.height() / 2,
            "text-anchor": "middle"
          }).text("There is only one artist to display. Select some Color By Genes");
        } else if (base.nodes().length === 0) {
          chart.select(".errortext").remove();
          chart.append("text").attr({
            "class": "errortext",
            "x": base.width() / 2,
            "y": base.height() / 2,
            "text-anchor": "middle"
          }).text("There are no artists to display. Select some Color By Genes");
        } else {
          chart.select(".errortext").remove();
        }
        lines = [];
        lineFn = d3.svg.line().x(function(d) {
          return xSc(d.year);
        }).y(ratios ? function(d) {
          return ySc(d.ratio);
        } : function(d) {
          return ySc(d.lineY);
        });
        ratioLine = d3.svg.line().x(function(d) {
          return xSc(d.year);
        }).y(function(d) {
          return ryScale(d.ratio);
        });
        lSel = chart.selectAll(".line");
        tSel = chart.selectAll(".text");
        if (!tSel.empty()) {
          tSel.attr({
            'stroke': 0
          }).remove();
        }
        geneArray = d3.entries(living);
        filtered_genes = geneArray.filter(function(l) {
          return l.key !== "_";
        });
        lines = chart.selectAll('.line:not(.exiting)').data(filtered_genes, function(d) {
          return d.key;
        });
        lines.enter().append('path').attr({
          "stroke-width": 3,
          "d": function(d) {
            return lineFn(d.value);
          },
          "fill": 'none',
          "clip-path": "url(#chart-clip)"
        }).each(function() {
          var length;
          length = this.getTotalLength();
          return d3.select(this).attr({
            'stroke-dasharray': "" + length + "px " + length + "px",
            'stroke-dashoffset': "" + length + "px"
          });
        });
        tweenPathString = function(generate, d, i, a) {
          var next_scale, points, prev_birth_years, prev_scale, union_birth_years;
          if (prev_xSc == null) {
            return function() {
              return generate(d.value);
            };
          } else {
            points = a.replace("M", "").split("L").map(function(d) {
              return d.split(/,| /).map(parseFloat);
            });
            prev_birth_years = points.map(_.first).map(prev_xSc.invert);
            union_birth_years = _.sortBy(_.union(prev_birth_years, birth_years));
            prev_scale = d3.scale.linear().domain(prev_birth_years).range(points.map(_.last));
            next_scale = d3.scale.linear().domain(birth_years).range(d.value.map(generate.y()));
            return d3.interpolate.apply(d3, [
              union_birth_years.map(function(d) {
                return [prev_xSc(d), prev_scale(d)];
              }), union_birth_years.map(function(d) {
                return [xSc(d), next_scale(d)];
              })
            ].map(d3.svg.line()));
          }
        };
        lines.attr("class", function(d, i) {
          return "line geneColor" + i;
        }).transition().duration(1000).attrTween("d", tweenPathString.bind(this, lineFn)).attr('stroke-dashoffset', 0).each('end', function() {
          return d3.select(this).attr('d', function(d) {
            return lineFn(d.value);
          }).attr('stroke-dasharray', null);
        });
        lines.exit().each(function() {
          var length;
          length = this.getTotalLength();
          return d3.select(this).attr({
            'stroke-dasharray': "0px " + length + "px " + length + "px 0px",
            'stroke-dashoffset': "-" + length + "px"
          });
        }).transition().duration(1000).attr('stroke-dashoffset', 0).remove();
        rl = chart.selectAll(".ratio-line:not(.exiting)").data(ratio, function(d) {
          return d.key;
        });
        rl.exit().remove();
        if ((ratioGene != null) && __indexOf.call(genes, ratioGene) >= 0) {
          dashsize = 5;
          rl.enter().append("path").attr({
            "class": "ratio-line",
            "d": function(d) {
              return ratioLine(d.value);
            },
            "clip-path": "url(#chart-clip)"
          }).each(function() {
            var length;
            length = this.getTotalLength();
            return d3.select(this).attr({
              'stroke-dasharray': new Array(Math.floor(length / (dashsize * 2)) + 1).join("" + dashsize + " " + dashsize + " ") + ("0 " + length + "px"),
              'stroke-dashoffset': "" + length + "px"
            });
          });
          return rl.transition().duration(1000).attrTween('d', tweenPathString.bind(this, ratioLine)).attr('stroke-dashoffset', 0).each('end', function() {
            return d3.select(this).attr({
              'stroke-dasharray': "" + dashsize + " " + dashsize
            });
          });
        }
      };
      lineGenes.genes = function(_g) {
        if (!arguments.length) {
          return genes;
        }
        genes = _g;
        return lineGenes;
      };
      lineGenes.ratios = function(_r) {
        if (!arguments.length) {
          return ratios;
        }
        ratios = _r;
        return lineGenes;
      };
      lineGenes.cumulative = function(_c) {
        if (!arguments.length) {
          return cumulative;
        }
        cumulative = _c;
        return lineGenes;
      };
      lineGenes.makeChartRunnerArray = function(mousePos) {
        var bisection, f, i, runnerInfo, valToDisplay, x0, yearBisector, _i, _len;
        x0 = Math.round(xSc.invert(mousePos[0] - base.margin().left));
        yearBisector = d3.bisector(function(d) {
          return d.year;
        }).left;
        runnerInfo = [];
        if ((ratioGene != null) && __indexOf.call(genes, ratioGene) >= 0) {
          bisection = yearBisector(ratio[0].value, x0);
          if (bisection >= ratio[0].value.length) {
            bisection = ratio[0].value.length - 1;
          }
          runnerInfo.push({
            x: xSc(ratio[0].value[bisection].year) + base.margin().left,
            y: ryScale(ratio[0].value[bisection].ratio) + base.margin().top,
            key: "% " + ratioGene,
            value: d3.format(".1%")(ratio[0].value[bisection].ratio),
            explicitColorClass: "line ratio"
          });
        }
        valToDisplay = isTotal ? 'total' : ratios ? 'ratio' : 'lineY';
        for (i = _i = 0, _len = filtered_genes.length; _i < _len; i = ++_i) {
          f = filtered_genes[i];
          bisection = yearBisector(f.value, x0);
          if (bisection >= f.value.length) {
            bisection = f.value.length - 1;
          }
          runnerInfo.push({
            x: xSc(f.value[bisection].year) + base.margin().left,
            y: ySc(f.value[bisection][valToDisplay]) + base.margin().top,
            key: f.key,
            value: ratios ? d3.format(".1%")(f.value[bisection][valToDisplay]) : f.value[bisection][valToDisplay],
            explicitColorClass: "line geneColor" + i
          });
        }
        return runnerInfo;
      };
      return d3.rebind(lineGenes, base, 'nodes', 'ratioGene', 'xType', 'yType', 'setInnerDimensions', 'isAvg', 'normalize', 'klass', 'yAxisLabel', 'xAxisLabel', 'xProp', 'yProp', 'width', 'height', 'xNumFormat', 'yNumFormat', 'xScale', 'yScale', 'setRange', 'drawAxes', 'drawLineTicks', 'on');
    };
  });

}).call(this);
