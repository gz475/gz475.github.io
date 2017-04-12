(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone', 'd3', 'jquerymodal', 'hammer'], function(Backbone, d3, jquerymodal, Hammer) {
    var DetailsView, cardWidth, displaySize, pos;
    pos = 0;
    displaySize = 0;
    cardWidth = 275;
    return DetailsView = (function(_super) {
      __extends(DetailsView, _super);

      function DetailsView() {
        return DetailsView.__super__.constructor.apply(this, arguments);
      }

      DetailsView.prototype.el = '#details';

      DetailsView.prototype.setElement = function(el) {
        DetailsView.__super__.setElement.call(this, el);
        return this.sel = d3.select(this.el);
      };

      DetailsView.prototype.setCurrent = function(m) {
        displaySize = 0;
        this.model = m;
        this.artists = this.model.artists;
        this.sizeByProp = this.model.sizeByProp;
        this.artists.sort((function(_this) {
          return function(a, b) {
            return b[_this.sizeByProp] - a[_this.sizeByProp];
          };
        })(this));
        pos = 0;
        return this.render();
      };

      DetailsView.prototype.initialize = function() {
        var model;
        model = {};
        pos = 0;
        this.$el.on($.modal.CLOSE, (function(_this) {
          return function() {
            return d3.select(window).on('resize.details', null);
          };
        })(this));
        this.$el.on($.modal.OPEN, (function(_this) {
          return function() {
            var render;
            Hammer(_this.sel.select(".close").node()).on("tap", function() {
              return $.modal.close();
            });
            render = _this.render.bind(_this);
            $(".circle").each(function() {
              return Hammer(this).on("tap", function() {
                var p;
                p = +d3.select(this).attr('data-index');
                pos = p * displaySize;
                return render();
              });
            });
            return d3.select(window).on('resize.details', function() {
              return _this.scheduleRender();
            });
          };
        })(this));
        return Hammer(this.el, {
          preventDefault: true
        }).on("swipeleft", (function(_this) {
          return function() {
            return _this.next();
          };
        })(this)).on("swiperight", (function(_this) {
          return function() {
            return _this.prev();
          };
        })(this)).on("drag", (function(_this) {
          return function(e) {
            return _this.drag(e);
          };
        })(this)).on("dragend", (function(_this) {
          return function(e) {
            var gestPos;
            gestPos = e.gesture.deltaX;
            if (gestPos >= 0) {
              return _this.prev();
            } else if (gestPos < 0) {
              return _this.next();
            }
          };
        })(this));
      };

      DetailsView.prototype.next = function() {
        window.clearTimeout(this.nextTimeout);
        return this.nextTimeout = window.setTimeout((function(_this) {
          return function() {
            pos += displaySize;
            return _this.scheduleRender();
          };
        })(this), 16);
      };

      DetailsView.prototype.prev = function() {
        window.clearTimeout(this.prevTimeout);
        return this.prevTimeout = window.setTimeout((function(_this) {
          return function() {
            pos -= displaySize;
            return _this.scheduleRender();
          };
        })(this), 16);
      };

      DetailsView.prototype.drag = function(e) {
        var currPos;
        currPos = -1 * e.gesture.deltaX + cardWidth * pos;
        return this.sel.select("#card-container").style({
          "margin-left": "-" + currPos + "px"
        });
      };

      DetailsView.prototype.scheduleRender = function() {
        window.clearTimeout(this.scheduledRender);
        return this.scheduledRender = window.setTimeout((function(_this) {
          return function() {
            return _this.render();
          };
        })(this), 50);
      };

      DetailsView.prototype.render = function() {
        var artistSel, artists, circleString, circles, container, cycleButtons, i, loaded_artists, offsetSize, page, width, _i, _ref, _ref1;
        displaySize = Math.floor((window.innerWidth - 2 * 15) / cardWidth);
        width = displaySize * cardWidth + 2 * 15;
        container = this.sel.select("#card-container");
        if (this.artists.length >= displaySize) {
          this.sel.style({
            "width": "" + width + "px"
          });
          container.classed("small", false);
        } else {
          this.sel.style({
            "width": "auto"
          });
          container.classed("small", true);
        }
        if (pos < 0) {
          pos = 0;
        }
        if (pos >= this.artists.length) {
          pos = pos - displaySize;
        }
        loaded_artists = this.artists.slice(0, pos + (displaySize * 3));
        this.sel.select(".heading").html("" + this.artists.length + " Artist" + (this.artists.length > 1 ? "s" : "") + " <div class=\"descriptor\">" + this.model.heading + "</div><div class=\"close-container\"><span class=\"close\">✕</span></div>");
        cycleButtons = this.sel.select("#cycle-buttons");
        circles = Math.floor((this.artists.length - 1) / displaySize);
        circleString = "";
        page = Math.ceil(pos / displaySize);
        offsetSize = 5;
        for (i = _i = _ref = Math.max(page - offsetSize, 0), _ref1 = Math.min(page + offsetSize, circles); _ref <= _ref1 ? _i <= _ref1 : _i >= _ref1; i = _ref <= _ref1 ? ++_i : --_i) {
          if (i === page) {
            circleString += "<div class='circle current' data-index=" + i + "></div> ";
          } else {
            circleString += "<div class='circle' data-index=" + i + "></div> ";
          }
        }
        cycleButtons.html("<div class=\"prev-container\"><span class='prev' style='display:" + (pos > displaySize - 1 ? "inline-block" : "none") + "'>&#9664;</span></div>\n" + circleString + "\n<div class=\"next-container\"><span class='next' style='display:" + ((pos + displaySize) < this.artists.length ? "inline-block" : "none") + "'>&#9654;</span></div>");
        artists = this.artists;
        artistSel = container.selectAll(".artist-card").data(loaded_artists, function(d) {
          return d.slug;
        });
        artistSel.enter().append("div").classed("artist-card", true).html((function(_this) {
          return function(d, i) {
            return "<span class=\"name\">" + d.name + "</span></br>\n" + ((d.nationality != null) && d.nationality !== "" ? d.nationality + "," : "") + " " + (d.birth_date != null ? d.birth_date : "") + " - " + (d.death_date != null ? d.death_date : "") + "</br>\n" + (_this.sizeByProp != null ? _this.model.dressString(_this.sizeByProp) : void 0) + ": " + (d[_this.sizeByProp] != null ? _this.model.propFormat(d[_this.sizeByProp]) : void 0) + "</br>\n<div class=\"to-artsy\">see on artsy</div>\n" + (d.image !== "" ? "</br><img src=" + d.image + ">" : "");
          };
        })(this)).select(".to-artsy").each(function(d) {
          return Hammer(this).on("tap", function() {
            return window.open("http://www.artsy.net/artist/" + d.slug);
          });
        });
        artistSel.classed("last", false).attr({
          "class": function(d, i) {
            var cardClass;
            cardClass = d3.select(this).attr("class");
            return ((i % displaySize === displaySize - 1) || (i === artists.length - 1) ? "last " : "") + ("" + cardClass);
          }
        });
        artistSel.exit().remove();
        container.transition().ease("cubic-out").style({
          "margin-left": "-" + (cardWidth * pos) + "px"
        });
        this.$el.modal({
          zIndex: 10,
          showClose: false
        });
        if (this.sel.select(".prev").node() != null) {
          Hammer(this.sel.select(".prev").node()).on("tap", (function(_this) {
            return function() {
              return _this.prev();
            };
          })(this));
        }
        if (this.sel.select(".next").node() != null) {
          return Hammer(this.sel.select(".next").node()).on("tap", (function(_this) {
            return function() {
              return _this.next();
            };
          })(this));
        }
      };

      return DetailsView;

    })(Backbone.View);
  });

}).call(this);
