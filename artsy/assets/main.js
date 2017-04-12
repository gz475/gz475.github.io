(function() {
  window.clog = console.log.bind(console);

  require.config({
    paths: {
      'backbone': '../vendor/backbone/backbone',
      'underscore': '../vendor/underscore/underscore',
      'jquery': '../vendor/jquery/dist/jquery.min',
      'jquerymodal': '../vendor/jquery-modal/jquery.modal.min',
      'd3': '../vendor/d3/d3.min',
      // 'topojson': '../vendor/topojson/topojson',
      'crossfilter': '../vendor/crossfilter/crossfilter.min',
      'typeahead': '../vendor/typeahead.js/dist/typeahead.jquery',
      'hammer': '../vendor/hammerjs/hammer.min'
    },
    shim: {
      'jquerymodal': {
        deps: ['jquery']
      },
      'crossfilter': {
        exports: 'crossfilter'
      },
      'typeahead': {
        deps: ['jquery']
      }
    }
  });

  define(['router', 'backbone'], function(Router, Backbone) {
    new Router;
    return Backbone.history.start();
  });

}).call(this);
