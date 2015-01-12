(function() {
  // Make a simple knowledge map.
  knowledgeMap.create({
    resources: [{
      id: 'what-is-torquescript',
      label: 'What is TorqueScript?',
      teaches: ['what TorqueScript is']
    }, {
      id: 'what-is-torque',
      label: 'What is Torque?',
      teaches: ['what a game engine is']
    }, {
      id: 't3d-bones-main-file',
      label: 't3d-bones: the main file',
      requires: ['basic TorqueScript', 'what TorqueScript is', 'what a game engine is'],
      teaches: ['engine startup']
    }, {
      id: 'what-is-a-game-engine',
      label: 'What is a game engine?',
      teaches: ['what a game engine is']
    }, {
      id: 'creating-a-main-menu',
      label: 't3d-bones: creating a main menu',
      requires: ['basic TorqueScript', 'engine startup'],
      teaches: ['GUIs in TorqueScript']
    }, {
      id: 't3d-bones-convex-shapes',
      label: 't3d-bones: creating convex shapes',
      requires: ['basic TorqueScript'],
      teaches: ['the ConvexShape class']
    }],

    plugins: [
      tredPlugin,
      highlightPlugin,
      mouseHighlightPlugin,
      panToPlugin,
      panOnClickPlugin,
      updateSidebarOnClickPlugin,
      resourceAppearancePlugin,
      conceptAppearancePlugin,

      // Finally, set some layout options that we don't really want to define a
      // plugin for.
      function(km) {
        km.onPreLayout(function(config) {
          config.rankSep(40);
          config.nodeSep(30);
          config.rankDir('BT');
        });
        km.onPostRender(function() {
          km.panTo('what-is-torque');
        });
      }
    ]
  });

  // Pan to a node when it is clicked.
  function panOnClickPlugin(km) {
    km.renderNodes.onNew(function(nodes) {
      nodes.on('click.pan', function(n) {
        km.panTo(n.id, 500);
      });
    });
  };

  // Update the sidebar when a node is clicked.
  function updateSidebarOnClickPlugin(km) {
    km.renderNodes.onNew(function(nodes) {
      nodes.on('click.sidebar', function(n) {
        if (n.label && n.label.length) {
          $('#resource-title').html(n.label);
        }
        if (n.description && n.description.length) {
          $('#resource-description').html(n.description);
        }
      });
    });
  };

  // Perform a poor man's version of 'transitive reduction' to remove edges that
  // don't affect the graph's connectivity.
  function tredPlugin(km) {
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
  function highlightPlugin(km) {
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
  function mouseHighlightPlugin(km) {
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
  function panToPlugin(km) {
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

    km.panOut = function(duration, zoom) {
      this.panTo({
        x: bb.width/2,
        y: bb.height/2,
        scale: zoom ? zoom : minZoom
      }, duration);
      return this;
    };
  };

  function resourceAppearancePlugin(km) {
    var d3 = knowledgeMap.d3;
    var inner = 30, outer = 40;
    var arcOffset = 0.4;
    var topArc = d3.svg.arc()
      .innerRadius(inner)
      .outerRadius(outer)
      .startAngle(-Math.PI/2 + arcOffset)
      .endAngle(Math.PI/2 - arcOffset);
    var bottomArc = d3.svg.arc()
      .innerRadius(inner)
      .outerRadius(outer)
      .startAngle(Math.PI/2 + arcOffset)
      .endAngle(3*Math.PI/2 - arcOffset);

    km.renderNodes.onNew(function(nodes) {
      var ns = nodes.filter('.resource');

      // Insert a circle and two arcs to make the broken ring.
      var g = ns.insert('g', 'text').classed('ring', true);
      g.append('circle').attr('r', outer);
      g.append('path').attr("d", topArc);
      g.append('path').attr("d", bottomArc);

      // Insert an icon!
      // Still no idea how to make the icons show in the SVG :(.
      /*var i = ns.insert('text', 'text.label')
        .attr('font-family', 'FontAwesome')
        .attr('font-size', '40px')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .classed('icon', true)
        .text(function(d) { return '\uf007' }); */

      // Mouse events to spin the ring.
      var duration = 500;
      ns.on('mouseover.resource', function() {
        d3.select(this).select('g.ring').transition()
          .duration(duration)
          .attr('transform', 'rotate(180)');
      });
      ns.on('mouseout.resource', function() {
        d3.select(this).select('g.ring').transition()
          .duration(duration)
          .attr('transform', 'rotate(0)');
      });
    });
  }

  function conceptAppearancePlugin(km) {
    km.renderNodes.onNew(function(nodes) {
      nodes.filter('.concept')
        .insert('rect', 'text');
    });

    var padding = {width: 10, height: 10};
    km.renderNodes.onUpdate(function(nodes) {
      nodes.filter('.concept').select('rect')
        // Offset rects so they're centred.
        .attr('x', function(d) { return -d.baseWidth/2 - 5; })
        .attr('y', function(d) { return -d.baseHeight/2 - 3; })
        // Add a bit of padding.
        .attr('width', function(d) { return d.baseWidth + padding.width; })
        .attr('height', function(d) { return d.baseHeight + padding.height; })
    })
    .onUpdate(km.calculateNodeSizes);
  }
}());
