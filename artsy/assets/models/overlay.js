(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'd3', 'hammer'], function(Backbone, d3, Hammer) {
    var OverlayView;
    return OverlayView = (function(_super) {
      var bottomLeft, bottomRight, chartView, currentLabel, currentValue, formatValue, hoverMarkers, permanentMarkers, quadrants, topLeft, topRight;

      __extends(OverlayView, _super);

      function OverlayView() {
        this.setMarker = __bind(this.setMarker, this);
        this.setHoverMarker = __bind(this.setHoverMarker, this);
        this._marker = __bind(this._marker, this);
        this.setCurrentValue = __bind(this.setCurrentValue, this);
        this.setCurrentLabel = __bind(this.setCurrentLabel, this);
        return OverlayView.__super__.constructor.apply(this, arguments);
      }

      OverlayView.prototype.el = '#overlay';

      permanentMarkers = [];

      hoverMarkers = [];

      chartView = null;

      formatValue = function(d) {
        var num_significant;
        if (typeof d !== "string") {
          num_significant = 3;
          if (d < Math.pow(10, num_significant - 1)) {
            return d.toFixed(0);
          } else {
            return d3.format("." + num_significant + "s")(d).replace('G', 'B');
          }
        } else {
          return d;
        }
      };

      topRight = {
        positionArrow: function(d, i, marker) {
          return marker.append('div').classed('arrow bottom left', true);
        },
        positionContainer: function(d, i, marker) {
          return marker.style('margin-top', function() {
            return -(marker.property('offsetHeight') + 10) + 'px';
          }).style('margin-left', 1);
        }
      };

      bottomRight = {
        positionArrow: function(d, i, marker) {
          return marker.append('div').classed('arrow top left', true);
        },
        positionContainer: function(d, i, marker) {
          return marker.style('margin-top', function(d) {
            return '10px';
          }).style('margin-left', 1);
        }
      };

      bottomLeft = {
        positionArrow: function(d, i, marker) {
          return marker.append('div').classed('arrow top right', true);
        },
        positionContainer: function(d, i, marker) {
          marker.style('margin-top', function(d) {
            return '10px';
          });
          return marker.style('margin-left', function(d) {
            return (-marker.property('offsetWidth') - 1) + 'px';
          });
        }
      };

      topLeft = {
        positionArrow: function(d, i, marker) {
          return marker.append('div').classed('arrow bottom right', true);
        },
        positionContainer: function(d, i, marker) {
          marker.style('margin-left', function(d) {
            return (-marker.property('offsetWidth') - 1) + 'px';
          });
          return marker.style('margin-top', function(d) {
            return -(marker.property('offsetHeight') + 10) + 'px';
          });
        }
      };

      quadrants = [topRight, bottomLeft, topLeft, bottomRight];

      OverlayView.prototype.setElement = function(el) {
        OverlayView.__super__.setElement.call(this, el);
        return this.sel = d3.select(this.el);
      };

      currentLabel = null;

      OverlayView.prototype.setCurrentLabel = function(cL) {
        currentLabel = cL;
        return this;
      };

      currentValue = null;

      OverlayView.prototype.setCurrentValue = function(cV) {
        currentValue = cV;
        return this;
      };

      OverlayView.prototype._marker = function(m, eLabel, eValue, cFlag, eColorClass) {
        return {
          data: m,
          explicitLabel: eLabel != null ? eLabel : null,
          explicitValue: eValue != null ? eValue : null,
          clearFlag: cFlag != null ? cFlag : null,
          fading: null,
          explicitColorClass: eColorClass != null ? eColorClass : null
        };
      };

      OverlayView.prototype.setHoverMarker = function(m, eLabel, eValue, cFlag, eColorClass) {
        hoverMarkers[0] = this._marker(m, eLabel, eValue, cFlag, eColorClass);
        if (m.visNode != null) {
          this.render();
        }
        return hoverMarkers[0];
      };

      OverlayView.prototype.setMarker = function(m, eLabel, eValue, cFlag, eColorClass) {
        permanentMarkers.push(this._marker(m, eLabel, eValue, cFlag, eColorClass));
        return permanentMarkers[permanentMarkers.length - 1];
      };

      OverlayView.prototype.unsetHoverMarker = function() {
        if (hoverMarkers.length !== 0) {
          hoverMarkers = [];
          return this.render();
        }
      };

      OverlayView.prototype.fadeOutHoverMarker = function() {
        if (hoverMarkers[0] != null) {
          hoverMarkers[0].fading = true;
        }
        return this.render();
      };

      OverlayView.prototype.makePermanent = function() {
        permanentMarkers = permanentMarkers.concat(hoverMarkers);
        return hoverMarkers = [];
      };

      OverlayView.prototype.makeChartRunners = function(cView) {
        return chartView = cView;
      };

      OverlayView.prototype.clearWithFlag = function(clearFlag) {
        return permanentMarkers = permanentMarkers.filter(function(d) {
          return d.clearFlag !== clearFlag;
        });
      };

      OverlayView.prototype.removeChartRunners = function() {
        chartView = null;
        return this.clearWithFlag('chartRunner');
      };

      OverlayView.prototype.initialize = function() {
        return this.model = {};
      };

      OverlayView.prototype.render = function() {
        var exiting, m, markerElement, markersToRender, newMarkerElement, visualization, _chartEventFunction, _i, _len, _ref;
        _chartEventFunction = (function(_this) {
          return function(position) {
            return _this.sel.transition().ease('cubic-out').duration(400).tween("position", function() {
              var interpolatePosition, _ref;
              interpolatePosition = d3.interpolate((_ref = _this.position) != null ? _ref : [0, 0], position);
              return function(t) {
                var i, r, runnerInfo, _i, _len;
                _this.unsetHoverMarker();
                _this.clearWithFlag("chartRunner");
                runnerInfo = chartView != null ? chartView.makeChartRunnerArray(_this.position = interpolatePosition(t)) : void 0;
                if (runnerInfo != null) {
                  for (i = _i = 0, _len = runnerInfo.length; _i < _len; i = ++_i) {
                    r = runnerInfo[i];
                    _this.setMarker({
                      slug: r.key
                    }, r.key, r.value, 'chartRunner', r.explicitColorClass).vis = {
                      left: r.x,
                      top: r.y
                    };
                  }
                  return _this.render();
                }
              };
            });
          };
        })(this);
        visualization = d3.select('#visualization');
        if (chartView != null) {
          visualization.on('mousemove', (function(_this) {
            return function() {
              return _chartEventFunction(d3.mouse(visualization.node()));
            };
          })(this));
        } else {
          visualization.on('mousemove', null);
        }
        markersToRender = permanentMarkers.concat(hoverMarkers);
        markersToRender = markersToRender.filter(function(m) {
          return (m.data.visNode != null) || (m.vis != null);
        });
        for (_i = 0, _len = markersToRender.length; _i < _len; _i++) {
          m = markersToRender[_i];
          if (m.data.visNode != null) {
            m.vis = {
              left: parseFloat(m.data.visNode.style.left),
              top: (_ref = m.eTop) != null ? _ref : parseFloat(m.data.visNode.style.top),
              exiting: d3.select(m.data.visNode).classed('exiting')
            };
          }
        }
        markerElement = this.sel.selectAll('.marker:not(.exiting)').data(markersToRender);
        newMarkerElement = markerElement.enter().append('div').classed('marker', true).style('opacity', 1).style('left', function(d) {
          return d.vis.left + 'px';
        }).style('top', function(d) {
          return d.vis.top + 'px';
        });
        newMarkerElement.append('span').classed('markerLabel', true);
        newMarkerElement.append('span').classed('markerValue', true);
        newMarkerElement.each(function(d, i) {
          return d3.select(this).classed(d.explicitColorClass || ("geneColor" + (i % 5)), true);
        });
        if (chartView != null) {
          newMarkerElement.each(function(d, i) {
            return quadrants[i % quadrants.length].positionArrow(d, i, d3.select(this));
          });
        } else {
          newMarkerElement.each(function(d, i) {
            return quadrants[0].positionArrow(d, i, d3.select(this));
          });
        }
        markerElement.transition().ease('cubic-out').duration(chartView != null ? 100 : 600).style('left', function(d) {
          return d.vis.left + 'px';
        }).style('top', function(d) {
          return d.vis.top + 'px';
        }).style('opacity', function(d) {
          if (d.fading) {
            return 0;
          } else {
            return 1;
          }
        });
        markerElement.select('.markerLabel').text(function(d) {
          var _ref1;
          return (_ref1 = d.explicitLabel) != null ? _ref1 : d.data[currentLabel];
        });
        markerElement.select('.markerValue').text(function(d) {
          var val, _ref1;
          val = (_ref1 = d.explicitValue) != null ? _ref1 : d.data[currentValue];
          if (val != null) {
            return formatValue(val);
          }
        });
        markerElement.style('display', function(d) {
          if (d.vis.exiting) {
            return 'none';
          } else {
            return 'inline-block';
          }
        });
        if (chartView != null) {
          markerElement.each(function(d, i) {
            return quadrants[i % quadrants.length].positionContainer(d, i, d3.select(this));
          });
        } else {
          markerElement.each(function(d, i) {
            return quadrants[0].positionContainer(d, i, d3.select(this));
          });
        }
        exiting = markerElement.exit().classed('exiting', true).style('opacity', '0');
        return setTimeout((function() {
          return exiting.remove();
        }), 600);
      };

      return OverlayView;

    })(Backbone.View);
  });

}).call(this);
