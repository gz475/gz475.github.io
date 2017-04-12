(function() {
  define(['views/view_base', 'd3'], function(viewBase, d3) {
    return function() {
      var base, isTotal, line, styleAxes, _yPropByYear;
      base = viewBase();
      isTotal = false;
      _yPropByYear = function(artists, isNormalized) {
        var alive, artist, f, fDenominator, fNum, fYprop, fyNormal, i, m, mDenominator, mNum, mYprop, myNormal, num_auctions, rto, rtp, tDenominator, tNum, tYprop, tempProp, total, tyNormal, yearExt, _i, _j, _len, _ref, _ref1;
        alive = [];
        yearExt = d3.extent(artists, function(d) {
          return d['birth_date'];
        });
        total = 0;
        m = 0;
        f = 0;
        tYprop = 0;
        mYprop = 0;
        fYprop = 0;
        mDenominator = 0;
        fDenominator = 0;
        fNum = 0;
        mNum = 0;
        tNum = 0;
        for (i = _i = _ref = yearExt[0], _ref1 = yearExt[1]; _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          for (_j = 0, _len = artists.length; _j < _len; _j++) {
            artist = artists[_j];
            tempProp = base.yProp()(artist);
            num_auctions = base.isAvg() ? artist['num_auctions'] : 0;
            if (artist['birth_date'] === i) {
              if (artist['gender'] === 'male') {
                mDenominator += num_auctions;
                m++;
                mYprop += tempProp;
              } else if (artist['gender'] === 'female') {
                fDenominator += num_auctions;
                f++;
                fYprop += tempProp;
              }
            }
          }
          total = m + f;
          tYprop = mYprop + fYprop;
          tDenominator = mDenominator + fDenominator;
          if (fDenominator === 0) {
            fNum = fYprop;
          } else {
            fNum = fYprop / fDenominator;
          }
          if (mDenominator === 0) {
            mNum = mYprop;
          } else {
            mNum = mYprop / mDenominator;
          }
          if (tDenominator === 0) {
            tNum = tYprop;
          } else {
            tNum = tYprop / tDenominator;
          }
          rto = rtp = 0;
          if (total === 0) {
            rto = 0;
          } else {
            rto = m / total;
          }
          if (tNum === 0) {
            rtp = 0;
          } else {
            rtp = mNum / tNum;
          }
          if (isNormalized) {
            myNormal = m > 0 ? mNum / m : 0;
            fyNormal = f > 0 ? fNum / f : 0;
            tyNormal = total > 0 ? tNum / total : 0;
            alive.push({
              year: i,
              ratios: {
                pMale: rto,
                yProp: rtp
              },
              total: {
                total: total,
                yProp: tyNormal
              },
              males: {
                total: m,
                yProp: myNormal
              },
              females: {
                total: f,
                yProp: fyNormal
              }
            });
          } else {
            alive.push({
              year: i,
              ratios: {
                pMale: rto,
                yProp: rtp
              },
              total: {
                total: total,
                yProp: tNum
              },
              males: {
                total: m,
                yProp: mNum
              },
              females: {
                total: f,
                yProp: fNum
              }
            });
          }
        }
        return alive;
      };
      styleAxes = function(sel) {
        var xSel, ySel;
        xSel = sel.select(".x.axis");
        ySel = sel.select(".y.axis");
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
          "font-size": "16px",
          "font-weight": "bold"
        });
      };
      line = function(sel) {
        var chart, deps, femaleLine, lSel, living, maleLine, padding, rAxis, rLabel, rSel, ratioLine, ryScale, xSc, ySc;
        base.clean(sel, deps = ['.raxis', '.xaxis', '.yaxis', '.chart', '.line', '.errortext', '.rlabel', '.laxis']);
        living = _yPropByYear(base.nodes(), base.normalize());
        base.xScale(d3.scale.linear());
        base.yScale(d3.scale.linear());
        ryScale = d3.scale.linear();
        base.xScale().domain(d3.extent(living, function(l) {
          return l.year;
        }));
        if (isTotal) {
          base.yScale().domain([
            0, d3.max(living, function(l) {
              return l.total.total;
            })
          ]);
          ryScale.domain([
            0, d3.max(living, function(l) {
              return l.ratios.pMale;
            })
          ]);
        } else {
          base.yScale().domain([
            0, d3.max(living, function(l) {
              return Math.max(l.males.yProp, l.females.yProp);
            })
          ]);
          ryScale.domain([0, 1]);
        }
        base.setRange();
        padding = 5;
        ryScale.range([base.innerHeight(), 0]);
        base.drawAxes(sel);
        styleAxes(sel);
        xSc = base.xScale();
        ySc = base.yScale();
        rAxis = d3.svg.axis().tickFormat(d3.format("%"));
        rAxis.scale(ryScale).orient("right");
        chart = sel.select(".chart:not(.exiting)>g");
        rSel = chart.select(".r.axis:not(.exiting)");
        if (rSel.empty()) {
          rSel = chart.append("g").classed("r axis raxis", true).attr({
            "transform": "translate(" + (base.innerWidth() + padding) + " , 0)"
          });
        }
        rSel.transition().duration(600).call(rAxis);
        rLabel = chart.select(".r.label");
        if (rLabel.empty()) {
          rLabel = chart.append("text").classed('r label rlabel', true).text("").attr({
            "text-anchor": "middle",
            "transform": "translate(" + (base.innerWidth() + 75) + "," + (base.innerHeight() / 2) + ")rotate(-90)"
          });
        }
        rLabel.text("Percent of Males");
        base.drawLineTicks(sel);
        if (isTotal) {
          maleLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ySc(d.males.total);
          }).interpolate("basis");
          femaleLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ySc(d.females.total);
          }).interpolate("basis");
          ratioLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ryScale(d.ratios.pMale);
          }).interpolate("basis");
        } else {
          maleLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ySc(d.males.yProp);
          }).interpolate("basis");
          femaleLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ySc(d.females.yProp);
          }).interpolate("basis");
          ratioLine = d3.svg.line().x(function(d) {
            return xSc(d.year);
          }).y(function(d) {
            return ryScale(d.ratios.yProp);
          }).interpolate("basis");
        }
        lSel = chart.selectAll(".line");
        if (!lSel.empty()) {
          lSel.attr({
            'stroke': 0
          }).remove();
        }
        if (base.nodes().length === 1) {
          chart.select(".errortext").remove();
          chart.append("text").attr({
            "class": "errortext",
            "x": base.width() / 2,
            "y": base.height() / 2
          }).text("There is only one artist to display");
        } else if (base.nodes().length === 0) {
          chart.select(".errortext").remove();
          chart.append("text").attr({
            "class": "errortext",
            "x": base.width() / 2,
            "y": base.height() / 2
          }).text("There are no artists to display");
        } else {
          chart.select(".errortext").remove();
        }
        chart.append("path").datum(living).attr("class", "male line").attr("d", maleLine);
        chart.append("path").datum(living).attr("class", "female line").attr("d", femaleLine);
        return chart.append("path").datum(living).attr("class", "ratio line").attr("d", ratioLine).attr("stroke-dasharray", "5,5");
      };
      line.isTotal = function(_t) {
        if (!arguments.length) {
          return isTotal;
        }
        isTotal = _t;
        return line;
      };
      return d3.rebind(line, base, 'nodes', 'isAvg', 'normalize', 'klass', 'yAxisLabel', 'xAxisLabel', 'xProp', 'yProp', 'width', 'height', 'xNumFormat', 'yNumFormat', 'xScale', 'yScale', 'setRange', 'drawAxes', 'drawLineTicks', 'on');
    };
  });

}).call(this);
