(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  define(['underscore', 'backbone', 'd3'], function(_, Backbone, d3) {
    var GeneSelectorView, adjustSize, adjustmentTimeout, commit;
    commit = function(genes, model) {
      if (model.get('unique')) {
        genes = _.uniq(genes);
      }
      model.trigger('change:genes', model, genes);
      return model.set('genes', genes);
    };
    adjustmentTimeout = null;
    adjustSize = function(str) {
      window.clearTimeout(adjustmentTimeout);
      return adjustmentTimeout = window.setTimeout((function(_this) {
        return function() {
          var $geneSelector, genesWidth, margin, newWidth, tempElement, totalWidth, width, widthLeft;
          tempElement = d3.select('body').append('div').style({
            'display': 'inline-block',
            'position': 'fixed',
            'right': 0
          }).html(str != null ? str : _this.value);
          width = tempElement.property('offsetWidth') + 1;
          tempElement.remove();
          $geneSelector = $(_this).closest('.gene-selector');
          margin = 50;
          totalWidth = $geneSelector.prop('offsetWidth') - margin;
          genesWidth = $geneSelector.find('.genes').prop('offsetWidth');
          widthLeft = totalWidth - genesWidth;
          newWidth = width < widthLeft ? widthLeft : totalWidth;
          return $(_this).css('width', "" + newWidth + "px");
        };
      })(this), 0);
    };
    return GeneSelectorView = (function(_super) {
      __extends(GeneSelectorView, _super);

      function GeneSelectorView() {
        return GeneSelectorView.__super__.constructor.apply(this, arguments);
      }

      GeneSelectorView.prototype.initialize = function(options) {
        var _ref, _ref1;
        this.model = new Backbone.Model({
          genes: options.genes,
          setColors: options.setColors,
          unique: (_ref = options.unique) != null ? _ref : true,
          onlyGenesAllowed: (_ref1 = options.onlyGenesAllowed) != null ? _ref1 : true
        });
        this.all_genes = options.all_genes;
        this.filtered_artists = options.filtered_artists;
        this.sel = d3.select(this.el);
        this.sel.on('mousedown', function() {
          return d3.event.preventDefault();
        }).on('click', function() {
          return $(this).find('input').trigger('focus');
        }).append('span').classed('genes', true);
        return this.render();
      };

      GeneSelectorView.prototype.render = function() {
        var all_genes, datasets, gene_selector_input, key, model, nest, selection, source_from_genes, values, _ref;
        selection = this.sel.select('.genes').selectAll('.gene').data(this.model.get('genes'), String);
        selection.enter().append('div').html(String).call((function(_this) {
          return function(sel) {
            return sel.append('div').classed('remove-btn', true).html('✕').on('mousedown', function(d) {
              var genes;
              genes = _.clone(_this.model.get('genes'));
              genes.splice(genes.indexOf(d), 1);
              commit(genes, _this.model);
              return d3.event.stopPropagation();
            });
          };
        })(this));
        selection.attr('class', (function(_this) {
          return function(d, i) {
            if (_this.model.get('setColors')) {
              return "gene geneColor" + i;
            } else {
              return "gene";
            }
          };
        })(this));
        selection.exit().remove();
        gene_selector_input = this.sel.select('input');
        if (gene_selector_input.empty()) {
          source_from_genes = function(genes) {
            return function(query, cb) {
              var filteredList, mapped, matchSubstring;
              filteredList = genes;
              matchSubstring = function(whole, substring) {
                var escapeRegExp;
                escapeRegExp = function(str) {
                  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                };
                return whole && whole.match(new RegExp("\\b" + escapeRegExp(substring), 'i'));
              };
              if (query) {
                filteredList = filteredList.filter(function(item) {
                  return matchSubstring(item.name, query);
                });
              }
              mapped = filteredList.map(function(item) {
                return {
                  value: item.name,
                  num_artists: item.num_artists
                };
              });
              return cb(mapped);
            };
          };
          nest = d3.nest().key(function(d) {
            return d.type;
          });
          datasets = (function() {
            var _i, _len, _ref, _ref1, _results;
            _ref = nest.entries(this.all_genes);
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              _ref1 = _ref[_i], key = _ref1.key, values = _ref1.values;
              _results.push({
                displayKey: function(o) {
                  return o.value;
                },
                source: source_from_genes(values),
                templates: {
                  header: "<h3>" + (key.match(/^(?:\w\d? - )?([^(-]+)/)[1]) + "</h3>",
                  suggestion: function(o) {
                    return "<p>" + o.value + ", <span class='artists-selected'>" + o.num_artists + " artist" + (o.num_artists === 0 || o.num_artists > 1 ? 's' : '') + " selected</span><p>";
                  }
                }
              });
            }
            return _results;
          }).call(this);
          model = this.model;
          all_genes = this.all_genes;
          gene_selector_input = this.sel.append('input');
          return (_ref = $(gene_selector_input.node())).typeahead.apply(_ref, [{
            minLength: 0,
            hint: false
          }].concat(__slice.call(datasets))).on('typeahead:selected typeahead:autocompleted', function(event, suggestion, dataset) {
            var genes;
            genes = _.clone(model.get('genes'));
            genes.push(suggestion.value);
            $(this).typeahead('val', '');
            adjustSize.call(this, '');
            commit(genes, model);
            event.stopPropagation();
            return event.preventDefault();
          }).on('typeahead:cursorchanged', function() {
            return adjustSize.call(this);
          }).on('keydown', function(event) {
            var gene, genes, val, _i, _len;
            genes = _.clone(model.get('genes'));
            switch (event.keyCode) {
              case 27:
                $(this).typeahead('val', '');
                return adjustSize.call(this, '');
              case 9:
              case 13:
                if (model.get('onlyGenesAllowed')) {
                  for (_i = 0, _len = all_genes.length; _i < _len; _i++) {
                    gene = all_genes[_i];
                    if (gene.name.match(new RegExp("^" + ($(this).typeahead('val')) + "$", 'i'))) {
                      genes.push(gene.name);
                      $(this).typeahead('val', '');
                      adjustSize.call(this, '');
                      commit(genes, model);
                      break;
                    }
                  }
                } else {
                  val = $(this).typeahead('val');
                  if (val) {
                    genes.push(val);
                  }
                  $(this).typeahead('val', '');
                  adjustSize.call(this, '');
                  commit(genes, model);
                }
                return event.preventDefault();
              case 8:
                adjustSize.call(this);
                if ($(this).typeahead('val') === '') {
                  $(this).typeahead('val', genes.splice(genes.length - 1, 1)[0]);
                  commit(genes, model);
                  return event.preventDefault();
                }
                break;
              default:
                return adjustSize.call(this);
            }
          }).on('blur', function() {
            $(this).typeahead('val', '');
            return adjustSize.call(this);
          }).on('focus', function() {
            var $this, ev, val;
            $this = $(this);
            val = this.value;
            ev = $.Event("keydown");
            ev.keyCode = ev.which = 38;
            $this.trigger(ev);
            ev = $.Event("keydown");
            ev.keyCode = ev.which = 40;
            $this.trigger(ev);
            $this.typeahead('val', val);
            $this.siblings('.tt-dropdown-menu').scrollTop(0);
            return true;
          });
        }
      };

      return GeneSelectorView;

    })(Backbone.View);
  });

}).call(this);
