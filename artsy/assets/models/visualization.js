(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(['backbone'], function(Backbone) {
    var VisualizationModel;
    return VisualizationModel = (function(_super) {
      __extends(VisualizationModel, _super);

      function VisualizationModel() {
        return VisualizationModel.__super__.constructor.apply(this, arguments);
      }

      VisualizationModel.prototype.defaults = function() {
        return {
          'viewType': 'map',
          'genes': ["Pop Art"],
          'colorWithGenes': [],
          'binBy': 'lifespan',
          'filters': {
            birth_date: [1850, 2014],
            lifespan: null,
            num_followers: null,
            total_auction_val: null,
            top_auction_lot: null
          },
          'sizeBy': 'num_followers',
          'sizeByRank': 'total_auction_val',
          'rankBy': 'total_auction_val',
          'lineY': 'total_auction_val',
          'scatterX': 'birth_date',
          'scatterY': 'total_auction_val',
          'filter_by_living_status': 'all',
          'ratioGene': null,
          'ratios': false,
          'mapTo': 'hometown_country_lon_lat',
          'zoomTo': 'none',
          'cumulative': true,
          'normalize': false,
          'animActive': false,
          'geneThreshold': 60,
          'label': null,
          "vistitle": null
        };
      };

      VisualizationModel.prototype.initialize = function() {
        return window.model = this;
      };

      VisualizationModel.prototype.dressString = function(d) {
        var str;
        if (d == null) {
          return 'None';
        } else {
          if (d === 'auction_avg' || d === 'total_auction_val' || d === 'top_auction_lot') {
            d += ' (USD)';
          }
          str = d.replace(/hometown_country_lon_lat/, 'home_country').replace(/hometown_lon_lat/, 'hometown').replace(/gene_lon_lat/, 'associated_region').replace(/lon_lat/, 'lon/lat').replace(/num/, d[d.length - 1] === 's' ? 'Number of' : 'Number of works').replace(/avg/, 'average').replace(/_/g, ' ').replace(/val/, 'value');
          return str[0].toUpperCase() + str.slice(1);
        }
      };

      return VisualizationModel;

    })(Backbone.Model);
  });

}).call(this);
