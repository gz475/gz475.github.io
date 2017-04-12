(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'd3', "hammer"], function(Backbone, d3, Hammer) {
    var ChaptersView;
    return ChaptersView = (function(_super) {
      __extends(ChaptersView, _super);

      function ChaptersView() {
        return ChaptersView.__super__.constructor.apply(this, arguments);
      }

      ChaptersView.prototype.el = '#chapters';

      ChaptersView.prototype._chapterPositions = null;

      ChaptersView.prototype.setElement = function(el) {
        ChaptersView.__super__.setElement.call(this, el);
        return this.sel = d3.select(this.el);
      };

      ChaptersView.prototype.initialize = function(options) {
        var animation, chapterModel;
        chapterModel = this.model;
        this.animation = animation = options.animation;
        this.sel.selectAll('.chapter').data(this.collection.models).enter().append("article").attr("class", "chapter").each(function(chapter, chapterIndex) {
          return d3.select(this).call(function() {
            this.append('h1').classed('title', true).html(chapter.get('title'));
            this.append("h2").classed("subtitle", true).html(chapter.get("subtitle"));
            return chapter.get("subchapters").forEach((function(_this) {
              return function(subchapter, subchapterIndex) {
                var animButton, body, container, groupContainer;
                if (subchapterIndex > 0) {
                  _this.append('br');
                }
                body = _this.append('div').classed('body', true).html(subchapter.body);
                if (subchapter.models.length > 1) {
                  container = body.append("div").classed("container", true);
                  container.append("div").classed("caption", true).html(subchapter.caption);
                  groupContainer = container.append("div").classed("group-container", true);
                  return subchapter.models.forEach(function(model, modelIndex) {
                    var group;
                    group = groupContainer.append("div").classed("group", true).on("click", function() {
                      return chapterModel.set({
                        chapterIndex: chapterIndex,
                        subchapterIndex: subchapterIndex,
                        modelIndex: modelIndex
                      });
                    });
                    group.append("div").classed("radio", true);
                    return group.append("div").classed("button radio", true).html(model.filter_by_living_status);
                  });
                } else if (subchapter.models[0].link_type === "animation") {
                  animButton = body.append("div").classed("button anim", true).html("Play animation").on('click', function() {
                    if (animation.active()) {
                      return animation.trigger("toggle");
                    } else {
                      chapterModel.set({
                        chapterIndex: chapterIndex,
                        subchapterIndex: subchapterIndex,
                        modelIndex: 0
                      });
                      return animation.trigger("start");
                    }
                  });
                  return animation.on("change", function() {
                    return animButton.text(animation.isPlaying() ? "Pause animation" : "Play animation");
                  });
                } else {
                  return body.append("div").classed("button", true).html("Show me").on('click', function() {
                    return chapterModel.set({
                      chapterIndex: chapterIndex,
                      subchapterIndex: subchapterIndex,
                      modelIndex: 0
                    });
                  });
                }
              };
            })(this));
          });
        });
        this.sel.select(".chapter:last-child").style({
          "min-height": "" + (document.body.offsetHeight - 110) + "px"
        });
        this.sel.style("height", "auto");
        this.updateChapter();
        this.update();
        this.listenTo(this.model, "change", this.update.bind(this));
        d3.select(window).on('resize.chapters', this.render.bind(this, true));
        return d3.select(window).on('scroll.chapters', (function(_this) {
          return function() {
            if (!_this.dontTriggerScroll) {
              return _this.updateChapter();
            }
          };
        })(this));
      };

      ChaptersView.prototype.update = function() {
        this.render();
        return this.model.trigger("setVisualization", this.collection.at(this.model.get("chapterIndex")).get("subchapters")[this.model.get("subchapterIndex")].models[this.model.get("modelIndex")]);
      };

      ChaptersView.prototype.render = function(enforceScrollTopRule) {
        var body, chapterIndex, chapterModel, circleHeight, circles, csel, modelIndex, nextContainer, prevContainer, space, subchapterIndex, _ref;
        chapterModel = this.model;
        _ref = chapterModel.attributes, chapterIndex = _ref.chapterIndex, subchapterIndex = _ref.subchapterIndex, modelIndex = _ref.modelIndex;
        this.sel.selectAll('.chapter').classed('active', false).filter(function(d, i) {
          return i === chapterIndex;
        }).classed('active', true);
        space = 5;
        circleHeight = 10;
        csel = d3.select("#chapter-select").style({
          "margin-top": "" + (-this.collection.length * (circleHeight + space) + 55) + "px"
        });
        prevContainer = csel.select("#prev-container .prev");
        if (prevContainer.empty()) {
          prevContainer = csel.select("#prev-container").append("div").classed("prev arrow", true).html("&#x25B2;").each(function() {
            return Hammer(this).on("tap", function() {
              return chapterModel.set({
                chapterIndex: chapterModel.get("chapterIndex") - 1,
                subchapterIndex: 0,
                modelIndex: 0
              });
            });
          });
        }
        prevContainer.style("display", chapterIndex > 0 ? "block" : "none");
        circles = d3.select("#circle-container").selectAll(".chapter-circle").data(this.collection);
        circles.enter().append("div").classed("chapter-circle", true).attr("data-index", function(d, i) {
          return "" + i;
        }).each(function(d, i) {
          return Hammer(this).on("tap", function() {
            return chapterModel.set({
              chapterIndex: i,
              subchapterIndex: 0,
              modelIndex: 0
            });
          });
        });
        circles.classed("current", function(d, i) {
          return i === chapterIndex;
        });
        nextContainer = csel.select("#next-container .next");
        if (nextContainer.empty()) {
          nextContainer = csel.select("#next-container").append("div").classed("next arrow", true).style({
            "top": "43px"
          }).html("&#x25BC;").each(function() {
            return Hammer(this).on("tap", function() {
              return chapterModel.set({
                chapterIndex: chapterModel.get("chapterIndex") + 1,
                subchapterIndex: 0,
                modelIndex: 0
              });
            });
          });
        }
        nextContainer.style("display", chapterIndex < this.collection.length - 1 ? "block" : "none");
        this.sel.selectAll(".button").classed("active", false);
        this.sel.selectAll(".button:not(.radio):not(.anim)").html("Show me");
        this.sel.selectAll(".radio:not(.button)").classed("filled", false);
        body = this.sel.selectAll(".chapter").filter(function(d, i) {
          return i === chapterIndex;
        }).selectAll(".body").filter(function(d, i) {
          return i === subchapterIndex;
        });
        body.selectAll(".button:not(.radio):not(.anim)").filter(function(d, i) {
          return i === modelIndex;
        }).classed("active", true).html("As shown");
        body.selectAll(".radio:not(.button)").filter(function(d, i) {
          return i === modelIndex;
        }).classed("filled", true);
        this.sel.select(".chapter:last-child").style({
          "min-height": "" + (document.body.offsetHeight - 110) + "px"
        });
        this._collectChapterPositions();
        if (chapterIndex !== this.detectCurrentChapter() || (enforceScrollTopRule && this._chapterPositions[chapterIndex].top + 1 < document.body.scrollTop)) {
          return d3.select(window).transition().tween("scrollTop", (function(_this) {
            return function() {
              var i;
              i = d3.interpolate(document.body.scrollTop, _this._chapterPositions[chapterIndex].top + 1);
              _this.dontTriggerScroll = true;
              return function(t) {
                return document.body.scrollTop = i(t);
              };
            };
          })(this)).each("end", (function(_this) {
            return function() {
              return _this.dontTriggerScroll = false;
            };
          })(this));
        }
      };

      ChaptersView.prototype.detectCurrentChapter = function() {
        var currIndex, offset, position, _i, _len, _ref;
        if (!this._chapterPositions) {
          this._collectChapterPositions();
        }
        currIndex = -1;
        offset = document.body.scrollTop <= 0 ? 0 : -window.innerHeight / 4;
        _ref = this._chapterPositions;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          position = _ref[_i];
          if (position.top + offset >= document.body.scrollTop) {
            break;
          }
          currIndex += 1;
        }
        return Math.max(0, Math.min(this._chapterPositions.length - 1, currIndex));
      };

      ChaptersView.prototype.updateChapter = function() {
        var currIndex;
        currIndex = this.detectCurrentChapter();
        if (this.model.get("chapterIndex") !== currIndex) {
          return this.model.set({
            chapterIndex: currIndex,
            subchapterIndex: 0,
            modelIndex: 0
          });
        }
      };

      ChaptersView.prototype._collectChapterPositions = function() {
        var cp, offsetPadding, parentTop;
        this._chapterPositions = cp = [];
        parentTop = this.sel.property("offsetTop");
        offsetPadding = -110;
        return this.sel.selectAll('.chapter').each(function(chapter, i) {
          return cp.push({
            index: i,
            top: this.offsetTop + parentTop + offsetPadding,
            chapter: chapter
          });
        });
      };

      return ChaptersView;

    })(Backbone.View);
  });

}).call(this);
