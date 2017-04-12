(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var StoryModel;
    return StoryModel = (function(_super) {
      __extends(StoryModel, _super);

      function StoryModel() {
        return StoryModel.__super__.constructor.apply(this, arguments);
      }

      StoryModel.prototype.url = 'data/story.json';

      StoryModel.prototype.parse = function(json) {
        json.chapters = new Backbone.Collection(json.chapters);
        return json;
      };

      return StoryModel;

    })(Backbone.Model);
  });

}).call(this);
