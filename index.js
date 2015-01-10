// Perform a poor man's version of 'transitive reduction' to remove edges that
// don't affect the graph's connectivity.
var tredPlugin = function(km) {
  km.onPreLayout(function(c, g) {
    var remove = [];
    g.eachEdge(function(e, u, v) {
      // Save edge data.
      var s = g.source(e);
      var t = g.target(e);
      var d = g.edge(e);
      // Remove edge temporarily.
      g.delEdge(e);
      // Check reachability without edge.
      var dists = knowledgeMap.graphlib.alg.dijkstra(g, u);
      if(dists[v].distance === Number.POSITIVE_INFINITY) {
        // Re-add edge.
        g.addEdge(e, s, t, d);
      }
    });
  });
};

// Add functions to highlight graph nodes and edges.
var highlightPlugin = function(km) {
  var d3 = knowledgeMap.d3;
  km.removeHighlight = function(css) {
    this.element.selectAll('.'+css).classed(css, false);
    return this;
  };

  km.highlightNode = function(id, css) {
    if(this.graph.hasNode(id)) {
      d3.select('#'+id).classed(css, true);
    }
    return this;
  };

  km.highlightEdges = function(id, css) {
    if(this.graph.hasNode(id)) {
      this.graph.incidentEdges(id).forEach(function(edge) {
        d3.select('#'+edge).classed(css, true);
      });
    }
    return this;
  };
};

// Highlight nodes when moused over, and the edges connected to them.
var mouseHighlightPlugin = function(km) {
  km.renderNodes.onNew(function(nodes) {
    var css = 'active';
    nodes
      .on('mouseover', function(d) {
        km.highlightNode(d.id, css)
          .highlightEdges(d.id, css);
      })
      .on('mouseout', function(d) {
        km.removeHighlight(css);
      });
  });
};

// Add functions to pan around the graph.
var panToPlugin = function(km) {
  var d3 = knowledgeMap.d3;

  km.panTo = function(id, duration) {
    var x, y, scale;
    if(typeof(id) == 'object') {
      x = id.x;
      y = id.y;
      scale = id.scale;
    } else if(this.graph.hasNode(id)) {
      var n = this.graph.node(id);
      x = n.layout.x;
      y = n.layout.y;
      scale = 1;
    } else {
      return;
    }

    var box = this.element.node().parentNode.getBBox();
    x = x * scale - box.width/2;
    y = y * scale - box.height/2;

    if(!duration) {
      this.zoom
        .translate([-x, -y])
        .scale(scale)
        .event(this.element);
    } else {
      this.element.transition()
        .duration(duration)
        .call(this.zoom.scale(scale).event)
        .call(this.zoom.translate([-x, -y]).event);
    }
    return this;
  };

  var bb, minZoom;
  km.onPostRender(function() {
    // Calculate the maximum zoom factor based on the width of
    // the element and the graph.
    var svgWidth = km.container.node().getBoundingClientRect().width;
    bb = km.element.node().getBBox()
    minZoom = Math.max(0.1, Math.min(0.5, svgWidth / (bb.width + 100)));
    km.zoom.scaleExtent([minZoom, 1]);
  });

  km.panOut = function(duration) {
    this.panTo({
      x: bb.width/2,
      y: bb.height/2,
      scale: minZoom
    }, duration);
    return this;
  };
};

// Pan to a node when it is clicked.
var panOnClickPlugin = function(km) {
  km.renderNodes.onNew(function(nodes) {
    nodes.on('click', function(n) {
      km.panTo(n.id, 500);
    });
  });
};

// Make a simple knowledge map.
knowledgeMap.create({
  resources: [{
    id: 'what-is-torquescript',
    label: 'What is TorqueScript?',
    teaches: ['What TorqueScript is']
  }, {
    id: 't3d-bones-main-file',
    label: 't3d-bones: the main file',
    requires: ['Basic TorqueScript', 'What TorqueScript is', 'What a game engine is'],
    teaches: ['Engine startup']
  }, {
    id: 'what-is-a-game-engine',
    label: 'What is a game engine?',
    teaches: ['What a game engine is']
  }, {
    id: 'creating-a-main-menu',
    label: 't3d-bones: creating a main menu',
    requires: ['Basic TorqueScript', 'Engine startup'],
    teaches: ['GUIs in TorqueScript']
  }, {
    id: 't3d-bones-convex-shapes',
    label: 't3d-bones: creating convex shapes',
    requires: ['Basic TorqueScript'],
    teaches: ['The ConvexShape class']
  }, {
    id: 'what-is-torque',
    label: 'What is Torque?',
    teaches: ['What a game engine is']
  }],

  plugins: [
    tredPlugin,
    highlightPlugin,
    mouseHighlightPlugin,
    panToPlugin,
    panOnClickPlugin,

    // Finally, set some layout options that we don't really want to define a
    // plugin for.
    function(km) {
      km.onPreLayout(function(config) {
        config.rankSep(50);
        config.nodeSep(20);
        config.rankDir('BT');
      });
    }
  ]
});
