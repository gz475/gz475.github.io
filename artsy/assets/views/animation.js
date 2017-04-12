(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['underscore', 'backbone', 'd3'], function(_, Backbone, d3) {
    var AnimationControlsView;
    return AnimationControlsView = (function(_super) {
      __extends(AnimationControlsView, _super);

      function AnimationControlsView() {
        return AnimationControlsView.__super__.constructor.apply(this, arguments);
      }

      AnimationControlsView.prototype.el = "#animControls";

      AnimationControlsView.prototype.initialize = function(options) {
        this.animation = options.animation;
        return this.animation.on("change", this.render.bind(this));
      };

      AnimationControlsView.prototype.render = function() {
        var filters;
        filters = this.model.get('filters');
        d3.select('.animDescription').text(!model.get('animActive') ? 'Start animation' : 'Artists in the global market').classed('clickable', !model.get('animActive')).on('mousedown', (function(_this) {
          return function() {
            return _this.animation.trigger("start");
          };
        })(this));
        d3.select('.animYears').classed('disabled', !model.get('animActive')).text("" + (filters.birth_date != null ? filters.birth_date[0] : void 0) + " - " + (filters.birth_date != null ? filters.birth_date[1] : void 0));
        return d3.select('.animControl').text(this.animation._animPlaying ? 'pause' : 'resume').classed('disabled', !model.get('animActive')).on('mousedown', (function(_this) {
          return function() {
            return _this.animation.trigger("toggle");
          };
        })(this));
      };

      return AnimationControlsView;

    })(Backbone.View);
  });

}).call(this);
