(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['models/visualization', 'views/details', 'views/controls', 'views/chapters', 'views/visualization', 'views/overlay', 'models/story', 'models/store', 'backbone', 'underscore', 'd3', 'hammer', 'models/animation', 'views/chapterControl', 'models/chapter'], function(VisualizationModel, DetailsView, ControlsView, ChaptersView, VisualizationView, OverlayView, Story, Store, Backbone, _, d3, Hammer, Animation, ChapterControlView, ChapterModel) {
    var ApplicationView;
    return ApplicationView = (function(_super) {
      __extends(ApplicationView, _super);

      function ApplicationView() {
        return ApplicationView.__super__.constructor.apply(this, arguments);
      }

      ApplicationView.prototype.el = 'body';

      ApplicationView.prototype.mode = 'narrative';

      ApplicationView.prototype.setElement = function(el) {
        ApplicationView.__super__.setElement.call(this, el);
        return this.sel = d3.select(this.el);
      };

      ApplicationView.prototype.initialize = function() {
        var promptState, setViewType, syncClassToMode, viewTypes;
        this.visualizationModel = new VisualizationModel;
        this.chapterModel = new ChapterModel;
        this.chapterModel.on("setVisualization", (function(_this) {
          return function(subchapterModel) {
            if (subchapterModel.link_type === "animation") {
              d3.select("#chapter-control").style({
                "display": "block"
              });
            } else {
              subchapterModel.link_type = null;
              d3.select("#chapter-control").style({
                "display": "none"
              });
            }
            if (_this.animation.isPlaying()) {
              _this.animation.trigger("end");
            }
            return _this.visualizationModel.set(subchapterModel);
          };
        })(this));
        this.details = new DetailsView;
        this.overlay = new OverlayView;
        window.setMode = this.model.set.bind(this.model, 'mode');
        viewTypes = ['map', 'ranking', 'timeline', 'distribution', 'scatter', 'cluster'];
        this.sel.select('.view-types').selectAll('.view-type').data(viewTypes).enter().append('span').classed('view-type', true).html(String).attr('data-view-type', String).on('click', (function(_this) {
          return function(d) {
            return _this.visualizationModel.set('viewType', d);
          };
        })(this));
        this.listenTo(this.visualizationModel, 'change:viewType', setViewType = (function(_this) {
          return function(model, viewType) {
            return _this.sel.select('.view-types').selectAll('.view-type').classed('active', false).filter("[data-view-type=" + viewType + "]").classed('active', true);
          };
        })(this));
        setViewType(this.visualizationModel, this.visualizationModel.get('viewType'));
        syncClassToMode = (function(_this) {
          return function(mode) {
            return _this.sel.classed('narrative interactive', false).classed(mode, true);
          };
        })(this);
        syncClassToMode(this.model.get('mode'));
        this.listenTo(this.model, 'change:mode', (function(_this) {
          return function(model, mode) {
            syncClassToMode(mode);
            return _this.render();
          };
        })(this));
        d3.select(window).on('resize.application', (function(_this) {
          return function() {
            window.clearTimeout(_this.render_timeout);
            return _this.render_timeout = window.setTimeout(_this.render.bind(_this, true), 150);
          };
        })(this));
        d3.select(window).on('keydown.application', (function(_this) {
          return function() {
            if (d3.event.metaKey && d3.event.keyCode === 'S'.charCodeAt()) {
              return promptState();
            }
          };
        })(this));
        this.story = new Story().on('request', (function(_this) {
          return function() {
            return _this.sel.select("#spinner").style({
              display: "block"
            });
          };
        })(this)).on('sync', (function(_this) {
          return function() {
            _this.animation = new Animation({
              model: _this.visualizationModel
            });
            _this.chapters = new ChaptersView({
              model: _this.chapterModel,
              collection: _this.story.get('chapters'),
              animation: _this.animation,
              store: _this.store
            });
            return new Store().load(function(store) {
              var loadAfterDelay, _d;
              _this.store = store;
              _this.sel.select("#spinner").style({
                display: "none"
              });
              _this.visualization = new VisualizationView({
                model: _this.visualizationModel,
                store: _this.store,
                detailsView: _this.details,
                overlayView: _this.overlay
              });
              _this.chapterControl = new ChapterControlView({
                model: _this.visualizationModel,
                store: _this.store,
                animation: _this.animation
              });
              _this.controls = new ControlsView({
                model: _this.visualizationModel,
                store: _this.store,
                animation: _this.animation
              });
              _this.render();
              _d = 600;
              return (loadAfterDelay = function(part) {
                return window.setTimeout(function() {
                  return _this.store.load(part, function() {
                    _this.render();
                    if (part < _this.store.num_parts) {
                      return loadAfterDelay(part + 1);
                    }
                  });
                }, _d);
              })(2);
            });
          };
        })(this));
        this.story.fetch();
        promptState = (function(_this) {
          return function() {
            var json, prompt_txt;
            prompt_txt = 'Serialized visualization state. Copy this, paste that.';
            json = window.prompt(prompt_txt, JSON.stringify(_this.visualization.model.attributes));
            return _this.visualization.model.set(JSON.parse(json));
          };
        })(this);
        return d3.select('#right-container .save').on('click', (function(_this) {
          return function() {
            d3.event.preventDefault();
            return promptState();
          };
        })(this));
      };

      ApplicationView.prototype.render = function(dontTransition) {
        if (this.model.get("mode") === "narrative") {
          this.chapters.update();
          d3.select("#i-mode").on("click", (function(_this) {
            return function() {
              if (_this.animation.isPlaying()) {
                _this.animation.trigger("end");
              }
              return setMode("interactive");
            };
          })(this));
          this.sel.select("#chapter-select").style({
            "display": "block"
          });
          this.sel.select("#controls").style({
            "display": "none"
          });
          this.sel.select("#chart-title").style({
            "display": "block"
          });
          this.sel.select(".view-types").style({
            "display": "none"
          });
          if (this.visualizationModel.get("link_type") === "animation") {
            d3.select("#chapter-control").style({
              "display": "block"
            });
          }
        } else {
          d3.select(".sidebar-close").on("click", function() {
            return setMode("narrative");
          });
          this.sel.select("#chapter-select").style({
            "display": "none"
          });
          this.sel.select("#controls").style({
            "display": "block"
          });
          this.sel.select("#chart-title").style({
            "display": "none"
          });
          d3.select("#chapter-control").style({
            "display": "none"
          });
          this.sel.select(".view-types").style({
            "top": "-50px",
            "display": "block"
          }).transition().duration(1000).style({
            "top": "21px"
          });
          this.visualizationModel.set("label", []);
        }
        this.controls.render();
        this.chapterControl.render();
        return this.visualization.render(dontTransition);
      };

      return ApplicationView;

    })(Backbone.View);
  });

}).call(this);
