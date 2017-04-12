(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['views/marker', 'views/histogram', 'views/barGenes', 'views/lineGenes', 'views/bar', 'views/line', 'views/cluster', 'views/scatter', 'views/map', 'backbone', 'd3'], function(Marker, histogram, barGenes, lineGenes, bar, line, cluster, scatter, map, Backbone, d3) {
    var VisualizationView;
    return VisualizationView = (function(_super) {
      var numNodes;

      __extends(VisualizationView, _super);

      function VisualizationView() {
        return VisualizationView.__super__.constructor.apply(this, arguments);
      }

      VisualizationView.prototype.el = '#visualization';

      VisualizationView.prototype.scatter = scatter();

      VisualizationView.prototype.map = map();

      VisualizationView.prototype.cluster = cluster();

      VisualizationView.prototype.bar = bar();

      VisualizationView.prototype.lineGenes = lineGenes();

      VisualizationView.prototype.barGenes = barGenes();

      VisualizationView.prototype.histogram = histogram();

      numNodes = 200;

      VisualizationView.prototype.initialize = function(options) {
        this.store = options.store;
        this.details = options.detailsView;
        this.overlay = options.overlayView;
        this.margin = options.margin;
        return this.listenTo(this.model, 'change', (function(_this) {
          return function() {
            window.clearTimeout(_this.render_timeout);
            return _this.render_timeout = window.setTimeout(_this.render.bind(_this), 0);
          };
        })(this));
      };

      VisualizationView.prototype.setElement = function(el) {
        VisualizationView.__super__.setElement.call(this, el);
        return this.sel = d3.select(this.el);
      };

      VisualizationView.prototype.setCurrent = function(m) {
        return this.model.set(m.attributes);
      };

      VisualizationView.prototype.render = function(dontTransition) {
        var artist_count, binByGender, calc_num_artists, colorWithGenes, cumulative, deriveTitle, field_by_mapTo_value, filtered_artists, filtered_groups, geneRefs, geneTypes, genes, groups, isAvg, l, mapTo, num_bars, pickArtists, rProp, rankBy, ratios, sizeByCumulative, sizeByProp, specificArtist, threshold, title, total_artists, vArtists, view, viewType, visible_artists, xProp, yProp, zoomTo, _i, _len, _ref;
        dontTransition = dontTransition || false;
        this.width = this.el.offsetWidth;
        this.height = this.el.offsetHeight;
        filtered_artists = this.store.artists.properties.slug.dimension.top(Infinity);
        total_artists = 0;
        visible_artists = 0;
        viewType = this.model.get('viewType');
        this.overlay.removeChartRunners();
        if (viewType === 'scatter' || viewType === 'map' || viewType === 'cluster') {
          if ((sizeByProp = this.model.get('sizeBy')) != null) {
            filtered_artists = filtered_artists.filter(function(artist) {
              return artist[sizeByProp] != null;
            });
          }
        }
        filtered_artists = (function() {
          switch (this.model.get("filter_by_living_status")) {
            case 'all':
              return filtered_artists;
            case 'living':
              return filtered_artists.filter(function(artist) {
                return (artist['death_date'] == null) && (artist['birth_date'] != null);
              });
            case 'deceased':
              return filtered_artists.filter(function(artist) {
                return (artist['death_date'] != null) && (artist['birth_date'] != null);
              });
          }
        }).call(this);
        genes = this.model.get('genes');
        threshold = this.model.get('geneThreshold');
        if ((genes != null) && genes.length) {
          if (viewType === 'cluster') {
            filtered_artists = filtered_artists.filter(function(d) {
              return d.genes.some(function(gene) {
                var _ref;
                return (_ref = gene.ref.name, __indexOf.call(genes, _ref) >= 0) && gene.value >= threshold;
              });
            });
          } else {
            geneRefs = genes.map(function(name) {
              return this.store.geneByName[name];
            });
            geneTypes = d3.nest().key(function(gene) {
              return gene.type;
            }).entries(geneRefs);
            filtered_artists = filtered_artists.filter(function(artist) {
              var aGenes;
              aGenes = artist.genes.filter(function(gene) {
                return gene.value >= threshold;
              }).map(function(gene) {
                return gene.ref.name;
              });
              return geneTypes.every(function(d) {
                return d.values.some(function(g) {
                  var _ref;
                  return _ref = g.name, __indexOf.call(aGenes, _ref) >= 0;
                });
              });
            });
          }
        }
        calc_num_artists = (function(_this) {
          return function(artists) {
            var a, g, _i, _j, _len, _len1, _ref, _results;
            _ref = _this.store.genes;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              g = _ref[_i];
              g.num_artists = 0;
            }
            _results = [];
            for (_j = 0, _len1 = artists.length; _j < _len1; _j++) {
              a = artists[_j];
              _results.push(a.genes.forEach(function(gene) {
                return gene.ref.num_artists += 1;
              }));
            }
            return _results;
          };
        })(this);
        calc_num_artists(filtered_artists);
        this.map.isActive(this.model.get('viewType') === "map");
        view = (function() {
          var _ref, _ref1, _ref2;
          switch (this.model.get('viewType')) {
            case 'scatter':
              xProp = this.model.get('scatterX');
              yProp = this.model.get('scatterY');
              rProp = function(artist) {
                if (sizeByProp != null) {
                  return artist[sizeByProp];
                } else {
                  return 1;
                }
              };
              filtered_artists = filtered_artists.filter(function(artist) {
                return (artist[xProp] != null) && (artist[yProp] != null);
              });
              total_artists = filtered_artists.length;
              if (total_artists <= numNodes) {
                visible_artists = total_artists;
              } else {
                visible_artists = numNodes;
                filtered_artists.sort(function(a, b) {
                  return d3.descending(rProp(a), rProp(b));
                });
              }
              filtered_artists = filtered_artists.slice(0, +numNodes + 1 || 9e9);
              colorWithGenes = this.model.get('colorWithGenes');
              return this.scatter.xNumFormat(this.store.artists.properties[xProp].format).yNumFormat(this.store.artists.properties[yProp].format).xProp(function(artist) {
                return artist[xProp];
              }).yProp(function(artist) {
                return artist[yProp];
              }).yAxisLabel(this.model.dressString(yProp)).xAxisLabel(this.model.dressString(xProp)).rProp(rProp).image(function(artist) {
                return artist['image'];
              }).maxRadius(sizeByProp != null ? this.width / 50 : 5).colorWithGenes(colorWithGenes).yType(this.store.artists.properties[yProp].type);
            case 'map':
              mapTo = this.model.get('mapTo');
              zoomTo = this.model.get('zoomTo');
              filtered_artists = filtered_artists.filter(function(d) {
                return d[mapTo] != null;
              });
              total_artists = filtered_artists.length;
              isAvg = false;
              if (sizeByProp != null) {
                if (sizeByProp === 'auction_avg') {
                  isAvg = true;
                  sizeByProp = 'total_auction_val';
                }
                this.map.rProp(function(group) {
                  var num_auctions, total;
                  num_auctions = 0;
                  total = group.values.reduce(function(sum, d) {
                    if (isAvg) {
                      num_auctions += d['num_auctions'];
                    }
                    return sum += d[sizeByProp];
                  }, 0);
                  if (isAvg) {
                    return total / num_auctions;
                  } else {
                    return total;
                  }
                });
              } else {
                this.map.rProp(function(group) {
                  return group.values.length;
                });
              }
              this.map.maxRadius(this.width / 30);
              this.map.mapTo(mapTo);
              this.map.zoomTo(zoomTo);
              this.map.label(this.model.get('label'));
              this.map.animActive(this.model.get('animActive'));
              if (sizeByProp != null) {
                this.map.sizeNumFormat(this.store.artists.properties[sizeByProp].format);
              }
              return this.map.filterlessMax(function() {
                var filters, nest, temp, totalArtistsSet;
                filters = _.clone(this.model.get('filters'));
                temp = filters.birth_date;
                filters.birth_date = [1850, 2014];
                this.model.set('filters', filters);
                totalArtistsSet = this.store.artists.properties.slug.dimension.top(Infinity);
                totalArtistsSet = totalArtistsSet.filter(function(d) {
                  return d[mapTo] != null;
                });
                nest = d3.nest().key(function(d) {
                  return d[mapTo].toString();
                }).entries(totalArtistsSet);
                return d3.max(nest, function(d) {
                  return d.values.length;
                });
              });
            case 'cluster':
              rProp = function(artist) {
                if (sizeByProp != null) {
                  return artist[sizeByProp];
                } else {
                  return 1;
                }
              };
              colorWithGenes = this.model.get('colorWithGenes');
              total_artists = filtered_artists.length;
              if (total_artists <= numNodes) {
                visible_artists = total_artists;
              } else {
                visible_artists = numNodes;
                filtered_artists.sort(function(a, b) {
                  return d3.descending(rProp(a), rProp(b));
                });
              }
              filtered_artists = filtered_artists.slice(0, +numNodes + 1 || 9e9);
              if (sizeByProp != null) {
                return this.cluster.rProp((function(_this) {
                  return function(artist) {
                    return artist[_this.model.get('sizeBy')];
                  };
                })(this)).image(function(artist) {
                  return artist['image'];
                }).genes(genes).rProp(rProp).colorWithGenes(colorWithGenes).sizeNumFormat(this.store.artists.properties[sizeByProp].format);
              }
              break;
            case 'timeline':
              yProp = this.model.get('lineY');
              genes = this.model.get('colorWithGenes');
              xProp = 'birth_date';
              ratios = this.model.get("ratios");
              cumulative = this.model.get("cumulative");
              filtered_artists = filtered_artists.filter(function(d) {
                return d.genes.some(function(gene) {
                  var _ref;
                  return (_ref = gene.ref.name, __indexOf.call(genes, _ref) >= 0) && gene.value >= threshold;
                });
              });
              isAvg = false;
              if (ratios) {
                this.lineGenes.yAxisLabel("% of " + (this.model.dressString(yProp))).yNumFormat(d3.format("%"));
                this.overlay.makeChartRunners(this.lineGenes);
              } else {
                this.lineGenes.yAxisLabel(this.model.dressString(yProp)).yNumFormat(this.store.artists.properties[yProp].format);
                this.overlay.makeChartRunners(this.lineGenes);
              }
              this.lineGenes.xAxisLabel(this.model.dressString(xProp)).xNumFormat(this.store.artists.properties[xProp].format);
              if (yProp === 'auction_avg') {
                isAvg = true;
                yProp = 'total_auction_val';
              }
              filtered_artists = filtered_artists.filter(function(artist) {
                return (artist[xProp] != null) && artist[yProp];
              });
              visible_artists = total_artists = filtered_artists.length;
              return this.lineGenes.xProp(function(artist) {
                return artist[xProp];
              }).yProp(function(artist) {
                return artist[yProp];
              }).nodes(filtered_artists).genes(genes).normalize(this.model.get('normalize')).isAvg(isAvg).ratioGene(this.model.get("ratioGene")).yType(this.store.artists.properties[yProp].type).ratios(ratios).cumulative(cumulative);
            case 'ranking':
              yProp = 'name';
              xProp = this.model.get('sizeByRank');
              rankBy = this.model.get('rankBy');
              this.bar.yAxisLabel("").xAxisLabel(this.model.dressString(xProp)).xNumFormat(this.store.artists.properties[xProp].format).yNumFormat(this.store.artists.properties[yProp].format);
              binByGender = (_ref = this.model.get('binByGender')) != null ? _ref : false;
              num_bars = (_ref1 = this.model.get('num_bars')) != null ? _ref1 : 20;
              pickArtists = function(num_bars) {
                return function(artists) {
                  total_artists = artists.length;
                  if (total_artists <= num_bars) {
                    visible_artists = total_artists;
                  } else {
                    visible_artists = num_bars;
                  }
                  artists.sort(function(a, b) {
                    if (a[rankBy] == null) {
                      return 1;
                    } else if (b[rankBy] == null) {
                      return -1;
                    } else {
                      return b[rankBy] - a[rankBy];
                    }
                  });
                  return artists.slice(0, num_bars);
                };
              };
              if (binByGender) {
                filtered_artists = filtered_artists.filter(function(artist) {
                  return !!artist['gender'];
                });
                filtered_artists = d3.nest().key(function(d) {
                  return d['gender'];
                }).rollup(pickArtists(num_bars / 2)).entries(filtered_artists);
              } else {
                filtered_artists = pickArtists(num_bars)(filtered_artists);
              }
              return this.bar.yProp(function(artist) {
                return artist[yProp];
              }).xProp(function(artist) {
                if (artist[xProp] != null) {
                  return artist[xProp];
                } else {
                  return 0;
                }
              }).yType(this.store.artists.properties[yProp].type).nodes(filtered_artists);
            case 'distribution':
              xProp = this.model.get('binBy');
              sizeByProp = this.model.get('sizeBy');
              filtered_artists = filtered_artists.filter(function(artist) {
                return artist[xProp] != null;
              });
              visible_artists = total_artists = filtered_artists.length;
              colorWithGenes = this.model.get('colorWithGenes');
              if (sizeByProp != null) {
                this.histogram.yNumFormat(this.store.artists.properties[sizeByProp].format);
              }
              return this.histogram.bounds((_ref2 = this.model.get('filters')[xProp]) != null ? _ref2 : null).xNumFormat(this.store.artists.properties[xProp].format).xProp(function(artist) {
                return artist[xProp];
              }).sizeByProp(sizeByProp != null ? function(artist) {
                return artist[sizeByProp];
              } : null).yAxisLabel(this.model.dressString(sizeByProp)).xAxisLabel(this.model.dressString(xProp)).xType(this.store.artists.properties[xProp].type).colorWithGenes(colorWithGenes).nodes(filtered_artists);
            case 'barGenes':
              yProp = this.model.get('scatterY');
              xProp = 'slug';
              genes = this.model.get('genes');
              this.barGenes.yAxisLabel(this.model.dressString(yProp)).xAxisLabel("Genes").yNumFormat(this.store.artists.properties[yProp].format);
              isAvg = false;
              if (yProp === 'auction_avg') {
                isAvg = true;
                yProp = 'total_auction_val';
              }
              filtered_artists = filtered_artists.filter(function(artist) {
                return !!artist[xProp] && (artist[yProp] != null);
              });
              filtered_artists = filtered_artists.filter(function(d) {
                return d.genes.some(function(gene) {
                  var _ref3;
                  return (_ref3 = gene.ref.name, __indexOf.call(genes, _ref3) >= 0) && (gene.value >= threshold);
                });
              });
              return this.barGenes.yProp(function(artist) {
                return artist[yProp];
              }).xProp(function(artist) {
                return artist[xProp];
              }).isAvg(isAvg).genes(genes).nodes(filtered_artists);
          }
        }).call(this);
        window.get_filtered_artist_slugs = (function(_this) {
          return function() {
            return filtered_artists.map(function(d) {
              return d.slug;
            });
          };
        })(this);
        viewType = this.model.get("viewType");
        sizeByProp = "total_auction_val";
        if (viewType === "ranking") {
          sizeByProp = this.model.get('sizeByRank');
        } else {
          sizeByProp = this.model.get('sizeBy');
        }
        field_by_mapTo_value = {
          'hometown_lon_lat': 'hometown',
          'gene_lon_lat': 'gene_country_name',
          'hometown_country_lon_lat': 'hometown_country_name'
        };
        deriveTitle = (function(_this) {
          return function(artists) {
            var artistLoc;
            if (viewType === 'map') {
              if (_this.model.get('mapTo') === 'hometown_lon_lat') {
                return _this.store.hometownByCoords[artists[0].hometown_lon_lat];
              } else {
                artistLoc = artists.map(function(artist) {
                  return artist[field_by_mapTo_value[this.model.get('mapTo')]];
                });
                return artistLoc = _.chain(artistLoc).countBy().pairs().max(_.last).head().value();
              }
            } else if (viewType === 'distribution') {
              return "" + ((genes != null) && genes.length > 0 ? genes + "," : "") + " " + (_this.model.dressString(_this.model.get('binBy'))) + " between " + artists.x + " and " + (artists.x + artists.dx);
            } else {
              return '';
            }
          };
        })(this);
        sizeByCumulative = function(artists) {
          if (sizeByProp === "num_artists" || (sizeByProp == null)) {
            return artists.length;
          } else {
            return d3.sum(artists, function(artist) {
              return artist[sizeByProp];
            });
          }
        };
        view.width(this.width).height(this.height).nodes(filtered_artists).on('inspect', (function(_this) {
          return function(artists) {
            if (viewType === 'map') {
              return _this.overlay.setHoverMarker(artists, deriveTitle(artists.values), sizeByCumulative(artists.values), 'map', "geneColor0");
            } else {
              return _this.overlay.setHoverMarker(artists[0], null, null, null, "geneColor0");
            }
          };
        })(this)).on('uninspect', (function(_this) {
          return function() {
            return _this.overlay.fadeOutHoverMarker();
          };
        })(this)).on('select', (function(_this) {
          return function(artists) {
            var sizeProp, temp;
            sizeProp = null;
            if (sizeByProp === "num_artists" || (sizeByProp == null)) {
              sizeProp = "total_auction_val";
            } else {
              sizeProp = sizeByProp;
            }
            _this.details.setCurrent({
              'heading': deriveTitle((viewType === 'map' ? artists.values : artists)),
              'artists': viewType === 'map' ? artists.values : viewType === 'ranking' ? (temp = [], temp.push(artists), temp) : artists,
              'sizeByProp': sizeProp,
              'propFormat': _this.store.artists.properties[sizeProp].format,
              'dressString': _this.model.dressString
            });
            if (viewType === 'timeline') {
              return _this.overlay.makePermanent();
            }
          };
        })(this));
        this.sel.call(view, dontTransition);
        if (viewType === "map") {
          vArtists = 0;
          this.map.group().forEach(function(g) {
            return vArtists += g.values.length;
          });
          visible_artists = vArtists;
        }
        artist_count = d3.select("#artist-count");
        artist_count.html("Viewing <strong>" + visible_artists + "</strong> out of <strong>" + total_artists + "</strong> artist" + (total_artists === 0 || total_artists > 1 ? "s" : ""));
        if (this.model.get("label") != null) {
          this.overlay.clearWithFlag("perm");
          _ref = this.model.get("label");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            l = _ref[_i];
            if (viewType !== "map") {
              specificArtist = filtered_artists.filter(function(a) {
                return a.slug === l;
              });
              if (specificArtist.length > 0) {
                this.overlay.setHoverMarker(specificArtist[0], null, null, "perm", "geneColor0");
              }
            } else {
              groups = this.map.group();
              filtered_groups = groups.filter((function(_this) {
                return function(g) {
                  return g["key"] === l;
                };
              })(this));
              if (filtered_groups.length > 0) {
                this.overlay.setHoverMarker(filtered_groups[0], deriveTitle(filtered_groups[0].values), sizeByCumulative(filtered_groups[0].values), 'perm', "geneColor0");
              }
            }
            this.overlay.makePermanent();
          }
        } else {
          this.overlay.clearWithFlag("perm");
        }
        this.overlay.setCurrentLabel('name');
        this.overlay.setCurrentValue(sizeByProp);
        title = this.sel.select("#chart-title");
        if (this.model.get("vistitle") != null) {
          title.html(this.model.get("vistitle"));
        } else {
          title.html("");
        }
        window.setTimeout((function(_this) {
          return function() {
            _this.overlay.clearWithFlag('map');
            if (viewType !== "timeline") {
              _this.overlay.removeChartRunners();
            }
            return _this.overlay.render();
          };
        })(this), 1);
        view.on("transitionstep", (function(_this) {
          return function() {
            return _this.overlay.render();
          };
        })(this));
        view.on("transitionend", (function(_this) {
          return function() {
            return _this.overlay.render();
          };
        })(this));
        return this;
      };

      return VisualizationView;

    })(Backbone.View);
  });

}).call(this);
