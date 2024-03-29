(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var ApplicationModel;
    return ApplicationModel = (function(_super) {
      __extends(ApplicationModel, _super);

      function ApplicationModel() {
        return ApplicationModel.__super__.constructor.apply(this, arguments);
      }

      ApplicationModel.prototype.defaults = function() {
        return {
          mode: 'narrative'
        };
      };

      return ApplicationModel;

    })(Backbone.Model);
  });

}).call(this);
