(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var ChapterModel;
    return ChapterModel = (function(_super) {
      __extends(ChapterModel, _super);

      function ChapterModel() {
        return ChapterModel.__super__.constructor.apply(this, arguments);
      }

      ChapterModel.prototype.defaults = function() {
        return {
          chapterIndex: 0,
          subchapterIndex: 0,
          modelIndex: 0
        };
      };

      return ChapterModel;

    })(Backbone.Model);
  });

}).call(this);
