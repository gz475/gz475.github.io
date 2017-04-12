(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['views/geneSelector', 'underscore', 'backbone', 'd3', 'typeahead', './animation'], function(GeneSelectorView, _, Backbone, d3, typeahead, AnimationControlsView) {
    var ControlsView, logProperties, neverLogProperties;
    logProperties = [];
    neverLogProperties = ['gender', 'birth_date', 'nationality'];
    return ControlsView = (function(_super) {
      __extends(ControlsView, _super);

      function ControlsView() {
        return ControlsView.__super__.constructor.apply(this, arguments);
      }

      ControlsView.prototype.el = '#controls';

      ControlsView.prototype.initialize = function(options) {
        var aggProps, apply_filters, field, model, name, opt, opts, property, quantProps, renderOptions, showhide, timeProps, viewType;
        this.store = options.store;
        quantProps = (function() {
          var _ref, _results;
          _ref = this.store.artists.properties;
          _results = [];
          for (name in _ref) {
            property = _ref[name];
            if (property.type === 'quantitative') {
              _results.push(name);
            }
          }
          return _results;
        }).call(this);
        aggProps = quantProps.concat(['num_artists']);
        timeProps = ['birth_date', 'death_date', 'lifespan'];
        this.fieldOptions = {
          sizeBy: aggProps,
          rankBy: quantProps,
          sizeByRank: quantProps,
          scatterX: quantProps.concat(timeProps),
          scatterY: quantProps.concat(timeProps),
          binBy: quantProps.concat(timeProps),
          lineY: aggProps,
          mapTo: ['hometown_lon_lat', 'hometown_country_lon_lat', 'gene_lon_lat'],
          zoomTo: ['none', 'Europe', 'North America'],
          filter_by_living_status: ["all", "living", "deceased"]
        };
        this.viewTypeOptions = {
          map: ['mapTo', 'sizeBy', 'zoomTo'],
          scatter: ['scatterX', 'sizeBy', 'scatterY', 'colorWithGenes'],
          cluster: ['colorWithGenes', 'sizeBy'],
          ranking: ['rankBy', 'sizeByRank'],
          timeline: ['lineY', 'colorWithGenes'],
          distribution: ['binBy', 'sizeBy', 'colorWithGenes'],
          barGenes: ['scatterY']
        };
        this.viewTypeSelectors = (function() {
          var _ref, _results;
          _ref = this.viewTypeOptions;
          _results = [];
          for (viewType in _ref) {
            opts = _ref[viewType];
            _results.push((function() {
              var _i, _len, _results1;
              _results1 = [];
              for (_i = 0, _len = opts.length; _i < _len; _i++) {
                opt = opts[_i];
                _results1.push('.' + opt);
              }
              return _results1;
            })());
          }
          return _results;
        }).call(this);
        this.sel = d3.select(this.el);
        model = this.model;
        this.sel.selectAll('.field').classed('applicable', true).filter(this.viewTypeSelectors).classed('applicable', false);
        this.sel.selectAll(".field:not(.filter_by_living_status)").append("div").classed("help", true).text("Help");
        renderOptions = (function(_this) {
          return function(field) {
            var fieldOptions, setRadioButtons, spanSel;
            setRadioButtons = function(button) {
              model.set('filter_by_living_status', button["data-value"]);
              d3.selectAll(".radio-circle").classed("active", false);
              d3.selectAll(".radio-label").classed("active", false);
              d3.select(button).select(".radio-circle").classed("active", true);
              return d3.select(button).select(".radio-label").classed("active", true);
            };
            fieldOptions = _this.fieldOptions;
            if (field === 'filter_by_living_status') {
              spanSel = _this.sel.select('.filter_by_living_status').append("div").classed("radio", true).selectAll("span").data(fieldOptions[field]).enter().append("span");
              spanSel.property({
                "data-value": function(d) {
                  return d;
                }
              }).append("div").classed("radio-circle", true);
              spanSel.append("div").classed("radio-label", true).text(function(d) {
                return model.dressString(d);
              });
              return spanSel.on("click", function() {
                return setRadioButtons(this);
              });
            } else {
              return _this.sel.select(".field." + field).append('div').append('span').classed('select_wrapper', true).append('select').on('change', function() {
                var value;
                value = fieldOptions[field][this.selectedIndex];
                return model.set(field, value);
              }).selectAll("option").data(fieldOptions[field]).enter().append("option").attr("value", function(d) {
                return d;
              }).html(_this.model.dressString);
            }
          };
        })(this);
        for (field in this.fieldOptions) {
          renderOptions(field);
        }
        this.sel.selectAll(".field.genes").append('div').classed('entry', true).append('div').classed('gene-selector', true).call((function(_this) {
          return function(sel) {
            var view;
            view = new GeneSelectorView({
              el: sel.node(),
              genes: _this.model.get('genes'),
              all_genes: _this.store.genes,
              setColors: false
            });
            _this.listenTo(view.model, 'change:genes', function(model, genes) {
              _this.model.set('genes', genes);
              _this.model.trigger('change');
              return view.render();
            });
            return _this.listenTo(_this.model, 'change:genes', function(model, genes) {
              view.model.set('genes', genes);
              return view.render();
            });
          };
        })(this));
        this.sel.selectAll(".field.colorWithGenes").append('div').classed('entry', true).append('div').classed('gene-selector', true).call((function(_this) {
          return function(sel) {
            var view;
            view = new GeneSelectorView({
              el: sel.node(),
              genes: _this.model.get('colorWithGenes'),
              all_genes: _this.store.genes,
              setColors: true
            });
            _this.listenTo(view.model, 'change:genes', function(model, genes) {
              _this.model.set('colorWithGenes', genes);
              return view.render();
            });
            return _this.listenTo(_this.model, 'change:colorWithGenes', function(model, genes) {
              view.model.set('genes', model.get('colorWithGenes'));
              return view.render();
            });
          };
        })(this));
        this.sel.select(".field.threshold").append('div').classed('entry', true).call(function() {
          this.append('input').attr({
            "type": "range",
            "min": 0,
            "max": 100,
            "step": 1
          }).on("input", function() {
            return model.set("geneThreshold", this.value);
          });
          return this.append('span');
        });
        (apply_filters = (function(_this) {
          return function() {
            var filters, _ref, _ref1;
            filters = _this.model.get('filters');
            _ref = _this.store.artists.properties;
            for (name in _ref) {
              property = _ref[name];
              property.dimension.filter((_ref1 = filters != null ? filters[name] : void 0) != null ? _ref1 : null);
            }
            window.clearTimeout(_this.render_timeout);
            return _this.render_timeout = window.setTimeout(_this.render.bind(_this), 0);
          };
        })(this))();
        this.listenTo(this.model, 'change', apply_filters);
        showhide = d3.select('.showhide');
        showhide.append("div").classed("show", true).style({
          "display": "inline-block"
        }).text("show").classed("clickable", true).on("mousedown", (function(_this) {
          return function() {
            _this.$el.show();
            d3.select("#visualization").style({
              "top": "33%"
            });
            return _this.model.trigger('change', _this.model);
          };
        })(this));
        showhide.append("span").text("/");
        showhide.append("div").classed("hide", true).style({
          "display": "inline-block"
        }).text("hide").classed("clickable", true).on('mousedown', (function(_this) {
          return function() {
            _this.$el.hide();
            d3.select("#visualization").style({
              "top": "100px"
            });
            return _this.model.trigger('change', _this.model);
          };
        })(this));
        return this.animControl = new AnimationControlsView({
          model: this.model,
          animation: options.animation
        });
      };

      ControlsView.prototype.render = function() {
        var artist_container, c, field, fields, filter, filter_selection, filter_width, filters, heading, living_status, model, opt, property, selectOption, store, threshold_sel, typeaheads, v, _ref;
        store = this.store;
        model = this.model;
        filters = (_ref = this.model.get('filters')) != null ? _ref : {};
        this.animControl.render();
        selectOption = (function(_this) {
          return function(field, option) {
            var index;
            index = _this.fieldOptions[field].indexOf(String(option));
            return _this.sel.select("." + field + " select").property('selectedIndex', index);
          };
        })(this);
        for (field in this.fieldOptions) {
          selectOption(field, this.model.get(field));
        }
        fields = this.sel.selectAll(this.viewTypeSelectors).classed('applicable', false);
        v = this.viewTypeOptions[this.model.get('viewType')];
        if ((this.model.get('viewType') != null) && (v.length > 0)) {
          fields.filter((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = v.length; _i < _len; _i++) {
              opt = v[_i];
              _results.push('.' + opt);
            }
            return _results;
          })()).classed('applicable', true);
        }
        filter_width = this.sel.select('.filters').property("offsetWidth");
        filter_selection = this.sel.select('.filters').selectAll('.filter').data((function() {
          var _ref1, _results;
          _ref1 = this.model.get('filters');
          _results = [];
          for (property in _ref1) {
            filter = _ref1[property];
            _results.push({
              property: property,
              filter: filter
            });
          }
          return _results;
        }).call(this), function(d) {
          return d.property;
        });
        artist_container = filter_selection.enter().append('div').classed('filter', true);
        heading = artist_container.append("div").classed("heading", true);
        heading.append('div').classed("label", true).html(function(d) {
          return "Filter by " + (model.dressString(d.property));
        });
        heading.append("span").classed("extent", true).html(function(d) {
          return "" + (d.filter != null ? d3.format("f")(d.filter[0]) + " - " + d3.format("f")(d.filter[1]) : "");
        });
        heading.append("div").classed("help", true).text("help").attr({
          "title": function(d) {
            var _ref1;
            if (d.property === "birth_date") {
              if ((_ref1 = model.get("viewType")) === "map" || _ref1 === "distribution") {
                return "Filter the groups by a range of birth dates. Click the '✕' to clear the filter.";
              } else {
                return "Filter the artists by a range of birth dates. Click the '✕' to clear the filter.";
              }
            } else {
              return "";
            }
          }
        });
        artist_container.append('div').classed('input', true).style("position", "absolute");
        artist_container.append('span').classed('scale-toggle', true).html(function(d) {
          var _ref1;
          if ((_ref1 = d.property, __indexOf.call(logProperties, _ref1) >= 0)) {
            return 'log';
          } else {
            return 'lin';
          }
        }).style('visibility', function(d) {
          var _ref1;
          if (!(_ref1 = d.property, __indexOf.call(neverLogProperties, _ref1) >= 0)) {
            return 'visible';
          } else {
            return 'hidden';
          }
        }).on('click', function(d) {
          var _ref1;
          if ((_ref1 = d.property, __indexOf.call(logProperties, _ref1) >= 0)) {
            logProperties = logProperties.filter(function(e) {
              return e !== d.property;
            });
            d3.select(this).text("lin");
          } else {
            logProperties.push(d.property);
            d3.select(this).text("log");
          }
          filters[d.property] = null;
          model.set('filters', _.clone(filters));
          return model.trigger('change');
        });
        artist_container.append('span').classed('clear-btn', true).html('✕').on('click', (function(_this) {
          return function(d) {
            filters = _.clone(_this.model.get('filters'));
            filters[d.property] = null;
            return model.set('filters', filters);
          };
        })(this));
        filter_selection.select('.clear-btn').style('visibility', (function(_this) {
          return function(d) {
            var _ref1;
            if (((_ref1 = _this.model.get('filters')) != null ? _ref1[d.property] : void 0) != null) {
              return 'visible';
            } else {
              return 'hidden';
            }
          };
        })(this));
        living_status = this.model.get('filter_by_living_status');
        c = this.sel.select('.filter_by_living_status').selectAll("span").filter(function() {
          return d3.select(this).property("data-value") === living_status;
        });
        d3.selectAll(".radio-circle").classed("active", false);
        d3.selectAll(".radio-label").classed("active", false);
        c.select(".radio-circle").classed("active", true);
        c.select(".radio-label").classed("active", true);
        typeaheads = this.typeaheads != null ? this.typeaheads : this.typeaheads = {};
        filter_selection.select('.input').each(function(d) {
          var axis, axis_g, brush, dimension_g, domain, extent, group, input, isFirstBrush, logFormat, lower_bound, numberFormat, padding, resizes, scale, svg, _ref1, _ref2, _ref3;
          switch (store.artists.properties[d.property].type) {
            case 'quantitative':
            case 'time':
              svg = d3.select(this).select('svg');
              if (svg.empty()) {
                svg = d3.select(this).append('svg');
              }
              svg.attr('width', filter_width).attr('height', 50);
              group = store.artists.properties[d.property].dimension.group().all();
              group = group.filter(function(d) {
                return (d.key != null) && d.value;
              });
              axis = null;
              if (group.length > 0) {
                extent = store.artists.properties[d.property].bounds;
                lower_bound = store.artists.properties[d.property].type !== 'quantitative' ? group[0].key : 0;
                if (extent == null) {
                  extent = [lower_bound, group[group.length - 1].key + 1];
                }
                if (extent[0] <= 0) {
                  extent[0] = 1;
                }
                padding = 14;
                if ((_ref1 = d.property, __indexOf.call(logProperties, _ref1) >= 0)) {
                  scale = d3.scale.log().domain(extent).range([padding, filter_width - padding]).nice();
                  numberFormat = store.artists.properties[d.property].format;
                  logFormat = function(d) {
                    var x, _ref2;
                    x = Math.log(d) / Math.log(10) + 1e-7;
                    if (Math.abs(x - Math.floor(x)) < .00002) {
                      if ((_ref2 = Math.floor(x), __indexOf.call(d3.range(0, 12, 2), _ref2) >= 0)) {
                        return numberFormat(d);
                      } else {
                        return "";
                      }
                    } else {
                      return "";
                    }
                  };
                  axis = d3.svg.axis().scale(scale).ticks(6).orient("top").tickSize(15, 5);
                  if (d.property === 'total_auction_val' || d.property === 'top_auction_lot') {
                    axis.tickFormat(logFormat);
                  } else {
                    property = d.property;
                    axis.tickFormat(function(d) {
                      return scale.tickFormat(4, store.artists.properties[property].format)(d);
                    });
                  }
                } else {
                  scale = d3.scale.linear().domain(extent).range([padding, filter_width - padding]);
                  axis = d3.svg.axis().scale(scale).ticks(6).orient("top").tickSize(15, 5).tickFormat(store.artists.properties[d.property].format);
                }
              }
              brush = d3.svg.brush();
              brush.x(scale);
              if (filters[d.property] != null) {
                brush.extent(filters[d.property]);
              }
              brush.on('brush', (function(_this) {
                return function() {
                  filter = brush.extent();
                  return d3.select(_this.parentNode).select("span.extent").html(function(d) {
                    return "" + (filter != null ? d3.format("f")(filter[0]) + " – " + d3.format("f")(filter[1]) : "");
                  });
                };
              })(this));
              brush.on('brushend', function() {
                filters = _.clone(filters);
                filters[d.property] = _.clone(brush.extent());
                model.set('filters', filters);
                return model.trigger('change');
              });
              dimension_g = svg.select('.dimension');
              if (dimension_g.empty()) {
                dimension_g = svg.append('g').attr("transform", "translate(0,35)").classed('dimension', true);
                dimension_g.append('g').classed('axis', true);
                dimension_g.append('g').attr("transform", "translate(0,-5)").classed('brush', true);
              }
              axis_g = dimension_g.select('.axis');
              if (axis != null) {
                axis_g.style('visibility', 'visible').call(axis);
                domain = axis_g.select(".domain");
                domain.attr("d", "" + (domain.attr('d')) + "Z");
              } else {
                axis_g.style('visibility', 'hidden');
              }
              isFirstBrush = dimension_g.select('.brush .background').empty();
              dimension_g.select('.brush').call(brush);
              if (isFirstBrush) {
                dimension_g.select('.brush').selectAll('.background, .extent').attr('height', 5);
                dimension_g.selectAll('.brush .resize rect').remove();
                resizes = dimension_g.selectAll(".brush .resize");
                resizes.append("image").attr({
                  "xlink:href": "assets/sliderIcons.png",
                  "y": -3,
                  "width": 15,
                  "height": 23
                });
                resizes.filter(".e").select("image").attr({
                  "x": -2,
                  "preserveAspectRatio": "xMaxYMin slice"
                });
                return resizes.filter(".w").select("image").attr({
                  "x": -11,
                  "preserveAspectRatio": "xMinYMin slice"
                });
              }
              break;
            case 'ordinal':
              if ((_ref2 = typeaheads[d.property]) != null) {
                _ref2.typeahead('val', (_ref3 = filters[d.property]) != null ? _ref3 : '');
              }
              if (typeaheads[d.property] != null) {
                return;
              }
              input = d3.select(this).select('.typeahead');
              if (input.empty()) {
                input = d3.select(this).append('input').classed('typeahead', true).attr('type', 'text');
              }
              return typeaheads[d.property] = $(input.node()).typeahead({
                minLength: 0
              }, {
                name: d.property,
                displayKey: 'key',
                source: function(query, cb) {
                  var filteredList;
                  filteredList = $.grep(store.artists.properties[d.property].dimension.group().all(), function(item, index) {
                    return item.key && item.key.toLowerCase().match("\\b" + query.toLowerCase());
                  });
                  if (query) {
                    filteredList.sort(function(a, b) {
                      return a.key.length - b.key.length;
                    });
                  }
                  return cb(filteredList);
                }
              }).on('typeahead:selected typeahead:autocompleted', (function(_this) {
                return function(event, suggestion, dataset) {
                  filters = model.get('filters');
                  filters[dataset] = suggestion.key;
                  model.set('filters', _.clone(filters));
                  return model.trigger('change');
                };
              })(this)).on('keyup', function(event) {
                switch (event.keyCode) {
                  case 27:
                    this.value = '';
                }
                if (this.value === '') {
                  filters[d.property] = null;
                  return model.set('filters', _.clone(filters));
                }
              }).on('focus', function() {
                var ev;
                $(this).typeahead('val', $(this).typeahead('val'));
                ev = $.Event("keydown");
                ev.keyCode = ev.which = 40;
                $(this).trigger(ev);
                return true;
              });
          }
        });
        this.sel.selectAll(".field").datum(function() {
          return this.className.replace(/field|applicable/g, "").trim();
        }).select(".help").attr({
          "title": function(d) {
            var title, _ref1, _ref2;
            title = "";
            switch (d) {
              case "rankBy":
                title = "Choose a property to rank the artists.";
                break;
              case "sizeBy":
                if ((_ref1 = model.get("viewType")) === "map" || _ref1 === "distribution") {
                  title = "Size the groups by a selected property.";
                } else {
                  title = "Size the artists by a selected property.";
                }
                break;
              case "sizeByRank":
                title = "Size the artists by a selected property.";
                break;
              case "scatterX":
                title = "Choose a property for the X-Axis.";
                break;
              case "scatterY":
                title = "Choose a property for the Y-Axis.";
                break;
              case "lineY":
                title = "Choose a property for the Y-Axis.";
                break;
              case "binBy":
                title = "Group the artists by a selected property.";
                break;
              case "mapTo":
                title = "Group the artists by a selected location.";
                break;
              case "zoomTo":
                title = "Zoom the map to a selected region.";
                break;
              case "genes":
                if ((_ref2 = model.get("viewType")) === "map" || _ref2 === "distribution") {
                  title = "Filter the groups by given genes.";
                } else {
                  title = "Filter the artists by a given gene.";
                }
                break;
              case "colorWithGenes":
                if (model.get("viewType") === "distribution") {
                  title = "Color the groups with given genes.";
                } else if (model.get("viewType") === "timeline") {
                  title = "Enter a gene to create or modify a line graph.";
                } else {
                  title = "Color the artists by a given gene.";
                }
            }
            return title;
          }
        });
        filter_selection.select("span.extent").html(function(d) {
          return "" + (d.filter != null ? d3.format("f")(d.filter[0]) + " – " + d3.format("f")(d.filter[1]) : "");
        });
        threshold_sel = this.sel.select(".field.threshold");
        threshold_sel.select('input').attr("value", this.model.get("geneThreshold"));
        return threshold_sel.select('span').html(this.model.get("geneThreshold"));
      };

      return ControlsView;

    })(Backbone.View);
  });

}).call(this);
