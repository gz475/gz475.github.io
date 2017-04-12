(function() {
  define(['views/view_base', 'd3', 'topojson'], function(viewBase, d3, topojson) {
    return function() {
      var animActive, arc, countryToRegion, countryToRegionMapping, dMaxForCurrentAnimation, filterlessMax, fireMouseEventOnRegionNode, formatId, g, getRegionNode, groups, isActive, label, lastAnimActiveState, linkFrom, linkTo, map, mapTo, nodes, path, projection, selectedGroups, sizeNumFormat, vectorMap, visibleGroups, zoomConfig, zoomTo;
      projection = d3.geo.equirectangular();
      path = d3.geo.path().projection(projection);
      mapTo = null;
      zoomTo = null;
      lastAnimActiveState = null;
      animActive = null;
      dMaxForCurrentAnimation = null;
      label = null;
      g = null;
      selectedGroups = null;
      visibleGroups = null;
      sizeNumFormat = null;
      isActive = false;
      filterlessMax = null;
      nodes = null;
      groups = viewBase().x(function(v) {
        return projection(v)[0];
      }).y(function(v) {
        return projection(v)[1];
      }).klass('group').xProp(function(d, i) {
        return d.values[0][mapTo];
      }).yProp(function(d, i) {
        return d.values[0][mapTo];
      }).keyFunction(function(k) {
        return k.key;
      }).artistSet(function(d) {
        return d;
      });
      vectorMap = null;
      countryToRegionMapping = null;
      d3.json("data/countries.topo.json", function(err, topoMap) {
        return d3.csv("data/country_to_region.csv", function(err, country_to_region) {
          vectorMap = topoMap;
          return countryToRegionMapping = country_to_region;
        });
      });
      zoomConfig = {
        "none": {
          center: [7, 10],
          scaleFactor: 1
        },
        "Europe": {
          center: [6, 48],
          scaleFactor: 6
        },
        "North America": {
          center: [-95, 38],
          scaleFactor: 4
        }
      };
      formatId = function(str) {
        return str.split(' ').join('').split(',').join('').split('(')[0];
      };
      getRegionNode = function(d) {
        return groups.grabNode((function(_this) {
          return function(n) {
            if (n.values[0]['gene_country_name'] != null) {
              return countryToRegion(d.properties.name) === formatId(n.values[0]['gene_country_name']);
            }
          };
        })(this));
      };
      fireMouseEventOnRegionNode = function(d, eventStr) {
        var node;
        if (mapTo !== 'gene_lon_lat') {
          return;
        }
        node = getRegionNode(d);
        if (node != null) {
          return d3.select(node.visNode).on(eventStr).call(node.visNode, node);
        }
      };
      countryToRegion = function(thisCountry) {
        var entry, _i, _len;
        for (_i = 0, _len = countryToRegionMapping.length; _i < _len; _i++) {
          entry = countryToRegionMapping[_i];
          if (thisCountry === entry.country) {
            return entry.region;
          }
        }
      };
      map = function(sel, dontTransition) {
        var circleKey, clipE, clipN, clipS, clipW, deps, group, i, interpolate, map_path, maxSize, prevZoom, rad, roundT, scaleFactor, scaleTo, selection, shift, tick, tickExtend, tickPadding, ticks, tweenStep, tx, x1, x2, zoom, _i, _len, _ref, _ref1, _ref2;
        groups.clean(sel, deps = ['.group', '#vectorMap']);
        projection.translate([groups.width() / 2, groups.height() / 2]);
        prevZoom = {
          center: projection.center(),
          scale: projection.scale()
        };
        scaleFactor = 0.45;
        scaleTo = Math.min(groups.height(), groups.width() * 0.37) * scaleFactor;
        zoom = {
          center: zoomConfig[zoomTo].center,
          scale: scaleTo * zoomConfig[zoomTo].scaleFactor
        };
        if (sel.select('#vectorMap:not(.exiting)').empty()) {
          g = sel.append('svg').attr('width', groups.width()).attr('height', groups.height()).attr('id', 'vectorMap').append('g').attr('id', 'countries');
        }
        map_path = g.selectAll("path").data(topojson.feature(vectorMap, vectorMap.objects.countries).features);
        map_path.enter().append('path').attr('id', function(d) {
          return countryToRegion(d.properties.name);
        }).attr('d', path).attr('vector-effect', 'non-scaling-stroke').classed('country', true).on('mouseenter', function(d) {
          return fireMouseEventOnRegionNode(d, 'mouseenter');
        }).on('mouseleave', function(d) {
          return fireMouseEventOnRegionNode(d, 'mouseleave');
        });
        sel.select('#vectorMap').attr({
          'width': groups.width(),
          'height': groups.height()
        });
        if (animActive && lastAnimActiveState !== animActive) {
          dMaxForCurrentAnimation = filterlessMax();
        }
        selectedGroups = d3.nest().key(function(d) {
          return d[mapTo].toString();
        }).entries(nodes);
        groups.width(groups.width()).height(groups.height()).on('inspect.map', (function(_this) {
          return function(artists) {
            return map.showLinksToGroup(artists);
          };
        })(this)).on('uninspect.map', (function(_this) {
          return function() {
            return map.eraseLinksToGroup();
          };
        })(this)).dMax(animActive ? dMaxForCurrentAnimation : null);
        map_path.classed('unrepresented', function(d) {
          if (mapTo !== 'gene_lon_lat') {
            return false;
          }
          return getRegionNode(d) == null;
        });
        projection.center(zoom.center).scale(zoom.scale);
        _ref = projection.invert([0, 0]), clipW = _ref[0], clipN = _ref[1];
        _ref1 = projection.invert([groups.width(), groups.height()]), clipE = _ref1[0], clipS = _ref1[1];
        visibleGroups = selectedGroups.filter(function(group) {
          var latlon, _ref2, _ref3;
          latlon = group.key.split(",").map(Number);
          return ((clipS < (_ref2 = latlon[1]) && _ref2 < clipN)) && ((clipW > clipE && (clipW < latlon[0] || clipE > latlon[0])) || (clipW <= clipE && (clipW < (_ref3 = latlon[0]) && _ref3 < clipE)));
        });
        groups.nodes(visibleGroups);
        map_path.classed('unrepresented', function(d) {
          if (mapTo !== 'gene_lon_lat') {
            return false;
          }
          return getRegionNode(d) == null;
        });
        if (dontTransition || animActive) {
          g.selectAll("path").attr("d", path);
          sel.call(groups.dontTransition(true));
        } else {
          groups.dontTransition(true);
          interpolate = {
            center: d3.geo.interpolate(prevZoom.center, zoom.center),
            scale: d3.interpolate(prevZoom.scale, zoom.scale)
          };
          tweenStep = (function(_this) {
            return function(t) {
              if (isActive) {
                groups.transitionstep();
                projection.center(interpolate.center(t)).scale(interpolate.scale(t));
                g.selectAll("path").attr("d", path);
                return sel.call(groups);
              }
            };
          })(this);
          d3.transition().duration(1600).tween("zoom", function() {
            return tweenStep;
          }).each("end", function() {
            return groups.transitionend();
          });
          tweenStep(0);
        }

        /* Legend */
        ticks = groups.r().nice().ticks(3);
        ticks = ticks.slice().reverse().filter(function(t) {
          return t > 0;
        });
        roundT = ticks.map(Math.round);
        ticks = _.uniq(roundT);
        maxSize = groups.r()(ticks[0]);
        tickExtend = 5;
        tickPadding = 3;
        x2 = tickExtend + groups.r()(ticks[0]);
        tx = x2 + tickPadding;
        if (!d3.select(".circle-key").empty()) {
          d3.select(".circle-key").remove();
        }
        circleKey = d3.select("#vectorMap").append("g").classed("circle-key", true).attr({
          "transform": "translate(" + (maxSize + 15) + "," + (groups.height() - 50) + ")"
        });
        _ref2 = ticks.slice(0);
        for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
          tick = _ref2[i];
          rad = groups.r()(tick);
          shift = groups.r()(25 * i);
          x1 = 0;
          group = circleKey.append("g").classed("circle-group", true).attr({
            "transform": "translate(0," + (-rad) + ")"
          });
          group.append('circle').attr({
            "cx": 0,
            "cy": 0,
            "r": rad
          });
          group.append("line").attr({
            "x1": x1,
            "x2": x2,
            "y1": -rad,
            "y2": -rad
          });
          group.append("text").attr({
            "transform": "translate(" + tx + ",0)",
            "y": -rad + 6
          }).style({
            "text-anchor": "start"
          }).text((sizeNumFormat != null ? sizeNumFormat : String)(tick));
        }
        lastAnimActiveState = animActive;
        return selection = sel;
      };
      map.mapTo = function(boundCoordinates) {
        if (!arguments.length) {
          return mapTo;
        }
        mapTo = boundCoordinates;
        return map;
      };
      map.zoomTo = function(zoomTarget) {
        if (!arguments.length) {
          return zoomTo;
        }
        zoomTo = zoomTarget;
        return map;
      };
      arc = d3.geo.greatArc();
      linkFrom = 'gene_lon_lat';
      linkTo = 'hometown_lon_lat';
      map.eraseLinksToGroup = function() {
        d3.select('#vectorMap').selectAll('path.arc').classed('exiting', true).transition().duration(500).ease('linear').attr('opacity', '0').each('end', function() {
          return d3.select(this).remove();
        });
        return d3.selectAll('.country.highlighted').classed('highlighted', false);
      };
      map.showLinksToGroup = function(artists) {
        var arcOpacityScale, arcs, artist, highlights, links, nestedLinks, _i, _len, _ref;
        links = [];
        if (mapTo === linkFrom) {
          _ref = artists.values;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            artist = _ref[_i];
            if ((artist[linkFrom] != null) && (artist[linkTo] != null)) {
              links.push({
                source: artist[linkFrom],
                target: artist[linkTo]
              });
            }
          }
          map.eraseLinksToGroup();
          nestedLinks = d3.nest().key(function(d) {
            return d.target;
          }).entries(links);
          arcOpacityScale = d3.scale.linear().domain([
            1, d3.max(nestedLinks, function(d) {
              return d.values.length;
            })
          ]).range([0.2, 1]);
          arcs = d3.select('#countries').selectAll("path.arc:not(.exiting)").data(nestedLinks).enter().append("path").attr('class', 'arc').attr('d', function(d) {
            return path(arc(d.values[0]));
          }).each(function(d, i) {
            var length, myArc;
            length = this.getTotalLength();
            myArc = d3.select(this);
            return myArc.attr({
              'stroke-dasharray': "" + length + "px " + length + "px",
              'stroke-dashoffset': "-" + length + "px"
            });
          }).attr('opacity', function(d) {
            return arcOpacityScale(d.values.length);
          }).transition().duration(400).attr('stroke-dashoffset', '0px');
          return highlights = d3.selectAll('#' + (formatId(artists.values[0]['gene_country_name']))).classed('highlighted', true);
        }
      };
      map.label = function(_m) {
        if (!arguments.length) {
          return label;
        }
        label = _m;
        return map;
      };
      map.nodes = function(_n) {
        if (!arguments.length) {
          return nodes;
        }
        nodes = _n;
        return map;
      };
      map.group = function() {
        return visibleGroups;
      };
      map.sizeNumFormat = function(_nf) {
        if (!arguments.length) {
          return sizeNumFormat;
        }
        sizeNumFormat = _nf;
        return map;
      };
      map.animActive = function(_aA) {
        if (!arguments.length) {
          return animActive;
        }
        animActive = _aA;
        return map;
      };
      map.filterlessMax = function(_fM) {
        if (!arguments.length) {
          return filterlessMax;
        }
        filterlessMax = _fM;
        return map;
      };
      map.isActive = function(ia) {
        if (!arguments.length) {
          return isActive;
        }
        isActive = ia;
        return map;
      };
      return d3.rebind(map, groups, 'rProp', 'on', 'maxRadius', 'width', 'height', 'dMax');
    };
  });

}).call(this);
