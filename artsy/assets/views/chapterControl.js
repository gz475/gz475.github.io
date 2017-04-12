(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'd3', 'underscore'], function(Backbone, d3, _) {
    var ChapterControlView;
    return ChapterControlView = (function(_super) {
      __extends(ChapterControlView, _super);

      function ChapterControlView() {
        return ChapterControlView.__super__.constructor.apply(this, arguments);
      }

      ChapterControlView.prototype.el = "#chapter-control";

      ChapterControlView.prototype.initialize = function(options) {
        this.store = options.store;
        this.animation = options.animation;
        this.sel = d3.select(this.el);
        this.listenTo(this.model, 'change', this.render.bind(this));
        return this.listenTo(this.animation, "change", this.render.bind(this));
      };

      ChapterControlView.prototype.render = function() {
        var animation, artist_container, brush_height, brush_width, container_height, container_width, filter, filter_selection, filters, property, resizeSq, sel, store, _ref;
        store = this.store;
        sel = this.sel;
        filters = this.model.get('filters');
        animation = this.animation;
        if (this.animation.isPlaying()) {
          this.sel.select(".button").classed("play", false).classed("pause", true);
        } else {
          this.sel.select(".button").classed("play", true).classed("pause", false);
        }
        this.sel.select('.button').on('mousedown', (function(_this) {
          return function() {
            if (_this.animation.active()) {
              return _this.animation.trigger("toggle");
            } else {
              return _this.animation.trigger("start");
            }
          };
        })(this));
        filter_selection = sel.selectAll('.slider').data((function() {
          var _results;
          _results = [];
          for (property in filters) {
            filter = filters[property];
            _results.push({
              property: property,
              filter: filter
            });
          }
          return _results;
        })());
        artist_container = filter_selection.enter().append('div').classed('slider', true);
        artist_container.append('div').classed('input', true).style("position", "absolute");
        brush_width = 350;
        brush_height = resizeSq = 38;
        _ref = [this.el.offsetWidth, this.el.offsetHeight], container_width = _ref[0], container_height = _ref[1];
        return filter_selection.select('.input').each(function(d) {
          var brush, brushHandler, dimension_g, extent, group, lower_bound, padding, resize_e, scale, svg;
          svg = d3.select(this).select('svg');
          if (svg.empty()) {
            svg = d3.select(this).append('svg');
          }
          svg.attr('width', container_width).attr('height', container_height);
          group = store.artists.properties[d.property].dimension.group().all();
          group = group.filter(function(d) {
            return (d.key != null) && d.value;
          });
          if (group.length > 0) {
            extent = [1850, 2014];
            lower_bound = store.artists.properties[d.property].type !== 'quantitative' ? group[0].key : 0;
            if (extent == null) {
              extent = [lower_bound, group[group.length - 1].key + 1];
            }
            if (extent[0] <= 0) {
              extent[0] = 1;
            }
            padding = 0;
            scale = d3.scale.linear().domain(extent).range([padding, brush_width]);
          }
          brush = d3.svg.brush();
          brush.x(scale);
          if (filters[d.property] != null) {
            brush.extent(filters[d.property]);
          }
          brushHandler = function() {
            var eWidth, resize_e;
            dimension_g.select(".brush").selectAll(".background, .extent").attr({
              "x": -resizeSq
            });
            dimension_g.select(".brush").selectAll(".background").attr({
              "width": brush_width + resizeSq
            });
            eWidth = +dimension_g.select(".brush .extent").attr("width");
            dimension_g.select(".brush .extent").attr({
              "width": eWidth + resizeSq
            });
            resize_e = dimension_g.selectAll(".brush .resize.e");
            if (resize_e.select("text").empty()) {
              resize_e.append("text").classed("year", true).attr({
                "x": -resizeSq / 2 + .5,
                "y": resizeSq / 2 + 4,
                "text-anchor": "middle"
              });
            }
            return resize_e.select("text").text(d3.format("f")(brush.extent()[1]));
          };
          brush.on("brush.cosmetic", brushHandler);
          brush.on('brushend', function(filter) {
            filters = _.clone(filters);
            filters[d.property] = _.clone(brush.extent());
            return model.set('filters', filters);
          });
          brush.on("brushstart.suspend", (function(_this) {
            return function(filter) {
              if (animation.isPlaying()) {
                filter.suspended = true;
                return animation.trigger("toggle");
              }
            };
          })(this));
          brush.on('brushend.unsuspend', function(filter) {
            if (filter.suspended) {
              filter.suspended = false;
              return animation.trigger("toggle");
            }
          });
          dimension_g = svg.select('.dimension');
          if (dimension_g.empty()) {
            dimension_g = svg.append('g').attr("transform", "translate(50,54)").classed('dimension', true);
            dimension_g.append('g').attr("transform", "translate(" + brush_height + ",-5)").classed('brush', true);
          }
          dimension_g.select('.brush').call(brush).selectAll('.background, .extent').attr({
            "height": brush_height
          }).style({
            "pointer-events": "none"
          });
          if (dimension_g.select("#extent-pattern, #background-pattern").empty()) {
            dimension_g.select(".brush").append("defs").append("pattern").attr({
              "id": "extent-pattern",
              "x": -resizeSq,
              "y": 0,
              "width": 160,
              "height": brush_height,
              "viewBox": "0 70 160 " + brush_height,
              "patternUnits": "userSpaceOnUse"
            }).append("rect").attr({
              "x": 0,
              "y": 70,
              "width": brush_width,
              "height": brush_height
            }).style({
              "fill": "#fff"
            });
            dimension_g.select("#extent-pattern").append("image").attr({
              "xlink:href": "assets/play_control.png",
              "x": 0,
              "y": 0,
              "width": 160,
              "height": 200
            });
            dimension_g.select("defs").append("pattern").attr({
              "id": "background-pattern",
              "x": -resizeSq,
              "y": 0,
              "width": 160,
              "height": brush_height,
              "viewBox": "0 0 160 " + brush_height,
              "patternUnits": "userSpaceOnUse"
            }).append("rect").attr({
              "x": 0,
              "y": 0,
              "width": brush_width,
              "height": brush_height
            }).style({
              "fill": "#fff"
            });
            dimension_g.select("#background-pattern").append("image").attr({
              "xlink:href": "assets/play_control.png",
              "x": 0,
              "y": 0,
              "width": 160,
              "height": 200
            });
          }
          dimension_g.select(".background").attr({
            "fill": "url(#background-pattern)"
          });
          dimension_g.select(".extent").attr({
            "fill": "url(#extent-pattern)"
          });
          brushHandler();
          dimension_g.select(".brush .resize.w").remove();
          resize_e = dimension_g.selectAll(".brush .resize.e");
          return resize_e.select("rect").attr({
            "x": -resizeSq,
            "height": resizeSq,
            "width": resizeSq + 1
          }).style({
            "fill": "#BB62E6",
            "visibility": "visible"
          });
        });
      };

      return ChapterControlView;

    })(Backbone.View);
  });

}).call(this);
