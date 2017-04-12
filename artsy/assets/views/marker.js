(function() {
  define(['d3'], function(d3) {
    return function() {
      var marker, orientation, position;
      position = {
        left: 0,
        top: 0
      };
      orientation = 'topLeft';
      marker = function(sel) {
        var arrow, container;
        arrow = sel.selectAll('.arrow').data([null]).enter().append('div').classed('arrow', true);
        container = sel.selectAll('.container').data([null]).enter().append('div').classed('container', true).style({
          background: "green"
        });
        sel.style({
          left: position.left + 'px',
          top: position.top + 'px'
        });
        arrow.classed({
          bottom: orientation === 'bottomLeft' || orientation === "bottomRight",
          top: orientation === 'topLeft' || orientation === "topRight",
          left: orientation === 'topLeft' || orientation === "bottomLeft",
          right: orientation === 'topRight' || orientation === "bottomRight"
        });
        container.style({
          width: "50px",
          height: "50px",
          "position": "absolute"
        });
        switch (orientation) {
          case 'topLeft':
            return container.style({
              right: 0,
              left: 'auto',
              top: 'auto',
              bottom: '10px'
            });
          case 'topRight':
            return container.style({
              left: 0,
              right: 'auto',
              top: 'auto',
              bottom: '10px'
            });
          case 'bottomLeft':
            return container.style({
              left: 0,
              right: 'auto',
              top: '10px',
              bottom: 'auto'
            });
          case 'bottomRight':
            return container.style({
              left: 'auto',
              right: 0,
              top: '10px',
              bottom: 'auto'
            });
        }
      };
      marker.setPosition = function(p) {
        if (!arguments.length) {
          return position;
        }
        position.left = p.left;
        position.top = p.top;
        return marker;
      };
      marker.setOrientation = function(o) {
        if (!arguments.length) {
          return orientation;
        }
        orientation = o;
        return marker;
      };
      return marker;
    };
  });

}).call(this);
