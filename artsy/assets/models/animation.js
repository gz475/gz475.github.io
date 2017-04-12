(function() {
  define(['underscore', 'backbone', 'd3'], function(_, Backbone, d3) {
    var Animation;
    return Animation = (function() {
      var currentYear;

      Animation.prototype._animPlaying = false;

      Animation.prototype._animation = null;

      currentYear = null;

      function Animation(options) {
        _.extend(this, Backbone.Events);
        this.model = options.model;
        this.on("start", (function(_this) {
          return function() {
            _this.animateTimeline();
            return _this.trigger("change");
          };
        })(this));
        this.on("toggle", (function(_this) {
          return function() {
            _this._animPlaying = !_this._animPlaying;
            if (_this._animPlaying) {
              currentYear = (_.clone(_this.model.get('filters'))).birth_date[1];
            }
            if (!_this._animPlaying) {
              _this.trigger("stopped");
            }
            return _this.trigger("change");
          };
        })(this));
        this.on("end", (function(_this) {
          return function() {
            _this.cleanUpAnimation();
            _this.trigger("stopped");
            _this.trigger("terminated");
            return _this.trigger("change");
          };
        })(this));
      }

      Animation.prototype.isPlaying = function() {
        return this._animPlaying;
      };

      Animation.prototype.active = function() {
        return this.model.get("animActive");
      };

      Animation.prototype.cleanUpAnimation = function() {
        var filters;
        clearInterval(this._animation);
        this._animPlaying = false;
        this.model.set('animActive', false);
        filters = _.clone(this.model.get('filters'));
        filters.birth_date = this.originalBirthDateFilter;
        this.model.set('filters', filters);
        return this.model.trigger('change');
      };

      Animation.prototype.animateTimeline = function() {
        var startYear;
        this.originalBirthDateFilter = this.model.get('filters').birth_date;
        startYear = 1850;
        currentYear = startYear;
        this.model.set('animActive', true);
        this.model.trigger('change');
        this._animPlaying = true;
        clearInterval(this._animation);
        return this._animation = setInterval((function(_this) {
          return function() {
            var filters;
            if (!_this._animPlaying) {
              return;
            }
            currentYear++;
            if (currentYear >= 2014) {
              _this.trigger("end");
              return;
            }
            filters = _.clone(_this.model.get('filters'));
            filters.birth_date = [startYear - 0.5, currentYear];
            _this.model.set('filters', filters);
            return _this.model.trigger('change');
          };
        })(this), 50);
      };

      return Animation;

    })();
  });

}).call(this);
