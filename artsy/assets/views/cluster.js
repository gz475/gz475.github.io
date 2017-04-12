(function() {
  define(['views/view_base', 'd3', 'underscore'], function(viewBase, d3, _) {
    return function() {
      var base, cluster, genes, sizeNumFormat;
      genes = [];
      sizeNumFormat = null;
      base = viewBase().x(Number).y(Number).xProp(function(d) {
        return d.x;
      }).yProp(function(d) {
        return d.y;
      }).keyFunction(function(d) {
        return d.slug;
      }).klass('artist');
      cluster = function(sel) {
        var all_groups, angle, circleKey, cx, cy, deflation_factor, deps, display_genes, gene_selection, group, group_set, groups_by_key, height, i, key, largestNode, long, maxSize, max_radius, node, num_spots, rad, roundT, scaling, shift, short, tick, tickExtend, tickPadding, ticks, tx, width, x1, x2, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _results;
        base.clean(sel, deps = ['.artist', '.gene', '.key']);
        largestNode = null;
        base.nodes().forEach(function(d) {
          var _base, _ref, _ref1;
          d.value = (_ref = typeof (_base = base.rProp()) === "function" ? _base(d) : void 0) != null ? _ref : 1;
          if (d.value > ((_ref1 = largestNode != null ? largestNode.value : void 0) != null ? _ref1 : 0)) {
            return largestNode = d;
          }
        });
        base.dMax(largestNode.value);
        genes = genes.filter(function(d) {
          return d != null;
        }).slice(0, 3);
        group_set = (function() {
          if (genes == null) {
            return [base.nodes()];
          } else {
            groups_by_key = d3.nest().key(function(artist) {
              return _.intersection(genes, artist.genes.map(function(gene) {
                return gene.ref.name;
              }));
            }).map(base.nodes());
            all_groups = [];
            for (key in groups_by_key) {
              group = groups_by_key[key];
              group.key = key;
              group.order = (function() {
                switch (genes.length) {
                  case 2:
                    switch (key) {
                      case String(genes):
                        return 0;
                      case String(genes[0]):
                        return 1;
                      case String(genes[1]):
                        return 2;
                    }
                    break;
                  case 3:
                    switch (key) {
                      case String(genes):
                        return 0;
                      case String(genes[0]):
                        return 1;
                      case String(genes.slice(0, 2)):
                        return 2;
                      case String(genes[1]):
                        return 3;
                      case String(genes.slice(1, 3)):
                        return 4;
                      case String(genes[2]):
                        return 5;
                      case String([genes[0], genes[2]]):
                        return 6;
                    }
                }
              })();
              all_groups.push(group);
            }
            return all_groups.sort(function(a, b) {
              return a.order - b.order;
            });
          }
        })();
        d3.layout.pack().size([base.width(), base.height()]).children(function(d) {
          if (Array.isArray(d)) {
            return d;
          }
        }).padding(2).nodes(group_set);
        num_spots = Math.pow(2, genes.length) - 1;
        _ref = [base.width(), base.height()], width = _ref[0], height = _ref[1];
        _ref1 = [width / 2, height / 2], cx = _ref1[0], cy = _ref1[1];
        if ((_ref2 = genes.length) === 2 || _ref2 === 3) {
          deflation_factor = 0.9;
          max_radius = deflation_factor * (genes.length === 2 ? ((_ref3 = width > height ? [width, height] : [height, width], long = _ref3[0], short = _ref3[1], _ref3), Math.min(long / 6, short / 2)) : Math.min(width, height) / 6);
          scaling = max_radius / d3.max(group_set, function(group) {
            return group.r;
          });
          for (_i = 0, _len = group_set.length; _i < _len; _i++) {
            group = group_set[_i];
            for (_j = 0, _len1 = group.length; _j < _len1; _j++) {
              node = group[_j];
              node.x -= group.x;
              node.y -= group.y;
            }
            if (group.order === 0) {
              _ref4 = [cx, cy], group.x = _ref4[0], group.y = _ref4[1];
            } else {
              angle = (group.order - 1) / (num_spots - 1) * (2 * Math.PI);
              if (genes.length === 2 && width > height) {
                group.x = cx - max_radius * 2 * Math.cos(angle);
                group.y = cy - max_radius * 2 * Math.sin(angle);
              } else {
                group.x = cx - max_radius * 2 * Math.sin(angle);
                group.y = cy - max_radius * 2 * Math.cos(angle);
              }
              group.r *= scaling;
            }
          }
          for (_k = 0, _len2 = group_set.length; _k < _len2; _k++) {
            group = group_set[_k];
            for (_l = 0, _len3 = group.length; _l < _len3; _l++) {
              node = group[_l];
              node.x = node.x * scaling + group.x;
              node.y = node.y * scaling + group.y;
              node.r *= scaling;
            }
          }
        }
        display_genes = genes.length === 1 ? [] : genes.map(function(gene) {
          return {
            name: gene
          };
        });
        if (genes.length === 2 && width > height) {
          display_genes.push({
            name: "Both",
            type: "center"
          });
        }
        gene_selection = sel.selectAll('.gene').data(display_genes, function(d) {
          return d.name;
        });
        gene_selection.enter().append('div').classed('gene', true).html(function(d) {
          return d.name;
        });
        gene_selection.each(function(d, i) {
          var styles, x, y;
          angle = i / genes.length * (2 * Math.PI);
          if (genes.length === 2 && width > height) {
            if (d.type === "center") {
              x = cx;
              y = cy - 1.1 * max_radius;
            } else {
              x = cx - max_radius * 2 * Math.cos(angle);
              y = cy - max_radius * 2 * Math.sin(angle) - 1.1 * max_radius;
            }
          } else {
            x = cx - max_radius * 3 * Math.sin(angle);
            y = cy - max_radius * 3 * Math.cos(angle);
          }
          styles = Math.sin(angle) > 1e-6 ? {
            'text-align': 'right',
            'left': "" + (x - 240) + "px",
            'top': "" + y + "px"
          } : Math.sin(angle) < -1e-6 ? {
            'text-align': 'left',
            'left': "" + x + "px",
            'top': "" + y + "px"
          } : {
            'text-align': 'center',
            'left': "" + (x - 120) + "px",
            'top': "" + (y - 12) + "px"
          };
          return d3.select(this).style(styles);
        });
        gene_selection.exit().remove();
        sel.call(base.maxRadius(largestNode.r));
        ticks = base.r().nice().ticks(3);
        ticks = ticks.slice().reverse().filter(function(t) {
          return t > 0;
        });
        roundT = ticks.map(Math.round);
        ticks = _.uniq(roundT);
        maxSize = base.r()(ticks[0]);
        tickExtend = 5;
        tickPadding = 3;
        x2 = tickExtend + base.r()(ticks[0]);
        tx = x2 + tickPadding;
        if (!d3.select(".key").empty()) {
          d3.select(".key").remove();
        }
        if (sel.select(".key:not(.exiting)").empty()) {
          circleKey = sel.append("svg").classed("key", true).attr({
            "width": base.width(),
            "height": base.height()
          });
        }
        circleKey = sel.select(".key").append("g").classed("circle-key", true).attr({
          "transform": "translate(" + (maxSize + 15) + "," + (base.height() - 50) + ")"
        });
        _ref5 = ticks.slice(0);
        _results = [];
        for (i = _m = 0, _len4 = _ref5.length; _m < _len4; i = ++_m) {
          tick = _ref5[i];
          rad = base.r()(tick);
          shift = base.r()(25 * i);
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
          _results.push(group.append("text").attr({
            "transform": "translate(" + tx + ",0)",
            "y": -rad + 6
          }).style({
            "text-anchor": "start"
          }).text((sizeNumFormat != null ? sizeNumFormat : String)(tick)));
        }
        return _results;
      };
      cluster.genes = function(_g) {
        if (!arguments.length) {
          return _g;
        }
        genes = _g;
        return cluster;
      };
      cluster.sizeNumFormat = function(n) {
        if (!arguments.length) {
          return n;
        }
        sizeNumFormat = n;
        return cluster;
      };
      return d3.rebind(cluster, base, 'nodes', 'klass', 'xProp', 'yProp', 'rProp', 'width', 'height', 'on', 'image', 'maxRadius', 'colorWithGenes');
    };
  });

}).call(this);
