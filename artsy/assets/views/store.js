(function() {
  define(['d3', 'crossfilter'], function(d3, crossfilter) {
    var Store;
    return Store = (function() {
      Store.prototype.format_by_type = {
        identity: d3.format(','),
        ordinal: String,
        time: function(d) {
          if (d <= 0) {
            return -1 * d + 1 + " B.C.E.";
          } else {
            return d;
          }
        },
        quantitative: function(d) {
          if (d < 10) {
            return d.toFixed(0);
          } else {
            return d3.format(".2s")(d).replace('G', 'B');
          }
        }
      };

      Store.prototype.property_types = {
        'slug': 'ordinal',
        'name': 'ordinal',
        'nationality': 'ordinal',
        'hometown': 'ordinal',
        'gender': 'ordinal',
        'num_followers': 'quantitative',
        'num_auctions': 'quantitative',
        'auction_avg': 'quantitative',
        'total_auction_val': 'quantitative',
        'top_auction_lot': 'quantitative',
        'num_published': 'quantitative',
        'num_for_sale': 'quantitative',
        'num_inquiries': 'quantitative',
        'num_saves': 'quantitative',
        'num_pageviews': 'quantitative',
        'num_artists': 'identity',
        'lifespan': 'time',
        'birth_date': 'time',
        'death_date': 'time'
      };

      function Store() {
        var property, type, _fn, _ref;
        this.geneByName = {};
        this.artists = {
          crossfilter: crossfilter(),
          properties: {}
        };
        _ref = this.property_types;
        _fn = (function(_this) {
          return function(property) {
            return _this.artists.properties[property] = {
              type: type,
              dimension: _this.artists.crossfilter.dimension(function(d) {
                var _ref1;
                return (_ref1 = d[property]) != null ? _ref1 : 0;
              }),
              format: _this.format_by_type[type]
            };
          };
        })(this);
        for (property in _ref) {
          type = _ref[property];
          _fn(property);
        }
        this.artists.properties['birth_date'].bounds = [1740, 2014];
      }

      Store.prototype.load = function(part, done) {
        var url, _ref;
        if (typeof part === "function") {
          _ref = [1, part], part = _ref[0], done = _ref[1];
        }
        url = part > 1 ? "data/dataset_part" + part + ".json" : "data/dataset.json";
        d3.json(url, (function(_this) {
          return function(dataset) {
            var gene, _i, _len, _ref1;
            if (part === 1) {
              _this.genes = dataset.genes;
              _ref1 = _this.genes;
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                gene = _ref1[_i];
                _this.geneByName[gene.name] = gene;
              }
              _this.hometownByCode = dataset.hometownByCode;
              _this.num_parts = dataset.num_parts;
            }
            dataset.artists.forEach(function(artist) {
              var hometown, lifespan, _ref2;
              artist.genes = artist.genes.map(function(raw_gene) {
                return {
                  value: raw_gene[0],
                  ref: _this.genes[raw_gene[1]]
                };
              });
              artist.auction_avg = null;
              artist.num_artists = 1;
              if (artist.lifespan == null) {
                artist.lifespan = artist.birth_date != null ? (lifespan = ((_ref2 = artist.death_date) != null ? _ref2 : new Date().getUTCFullYear()) - artist.birth_date, (0 < lifespan && lifespan < 120) ? lifespan : null) : null;
              }
              if (artist.num_auctions !== 0) {
                artist.auction_avg = artist.total_auction_val / artist.num_auctions;
              }
              hometown = _this.hometownByCode[artist.hometown_country];
              if (hometown != null) {
                artist.hometown_country_name = hometown.hometown_country_name;
                return artist.hometown_country_lon_lat = hometown.hometown_country_lon_lat;
              }
            });
            _this.artists.crossfilter.add(dataset.artists);
            _this.hometownByCoords = d3.nest().key(function(d) {
              return d.hometown_lon_lat;
            }).rollup(function(values) {
              return _.chain(values).countBy(function(d) {
                return d.hometown;
              }).pairs().max(_.last).head().value();
            }).map(_this.artists.properties.slug.dimension.top(Infinity));
            return done(_this);
          };
        })(this));
        window.store = this;
        return this;
      };

      return Store;

    })();
  });

}).call(this);
