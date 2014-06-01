var d3 = knowledgeMap.d3;

knowledgeMap.registerPlugin({
  name: 'warn-no-data',
  run: function(km) {
    km.onEvent('renderGraph', function(e) {
      e.nodes.each(function(id) {
        var concept = e.graph.node(id).concept;
        var content = concept.content;
        if(!content || !content.data) {
          d3.select(this).select('g').append('text')
            .classed('danger', true)
            .attr('dy', '1em')
            .attr('x', '-20')
            .text('(!)')
            .on('click', function(id) {
            })
            .append('title')
              .text( 'No content here yet!');
        }
      });
    });
  }
});

var map = knowledgeMap.create({
  layout: {
    verticalSpace: 100,
    direction: 'BT'
  },
  plugins: ['click-events', 'warn-no-data'],
  graph: {
    concepts: [{
      id: 'setup',
      name: 'Get set up',
      content: {
        description: 'Download and run a binary distribution of Torque 3D.'
      }
    }, {
      id: 'compiling',
      name: 'Compile the engine',
      content: {
        description: 'Compile Torque from its source code.'
      }
    }, {
      id: 'basic-rift',
      name: 'Oculus Rift',
      dependencies: ['compiling', 'basic-ts'],
      content: {
        description: 'Set up integeration with the Oculus Rift.'
      }
    }, {
      id: 'basic-ts',
      name: 'Basic TorqueScript',
      dependencies: ['setup'],
      content: {
        description: 'Learn the basics of TorqueScript, the language you\'ll use throughout this series, and how the example application is structured.'
      }
    }, {
      id: 'httpobject',
      name: 'Talk to a server',
      dependencies: ['objects'],
      content: {
        description: 'Use the `HTTPObject` class to interact with a remote server.'
      }
    }, {
      id: 'networking',
      name: 'Networking',
      dependencies: ['startup'],
      content: {
        description: 'Add networking to your game!'
      }
    }, {
      id: 'basic-gui',
      name: 'Make a main menu',
      dependencies: ['startup'],
      content: {
        description: 'Start your game in a main menu, not a 3D world view.'
      }
    }, {
      id: 'rts-control',
      name: 'RTS unit control',
      dependencies: ['basic-hud', 'pathfinding'],
      content: {
        description: 'Select and control NPCs from an overhead camera.'
      }
    }, {
      id: 'aiplayer',
      name: 'Non-player characters',
      dependencies: ['datablocks'],
      content: {
        description: 'Use the `AIPlayer` class to create NPCs that wander randomly.'
      }
    }, {
      id: 'geometry',
      name: 'Build a level',
      dependencies: ['objects'],
      content: {
        description: 'Build level geometry by importing shapes from Blender, or using the built-in box primitive maker.'
      }
    }, {
      id: 'basic-hud',
      name: 'Edit the HUD',
      dependencies: ['objects'],
      content: {
        description: 'Add a simple heads-up display on top of the game display'
      }
    }, {
      id: 'datablocks',
      name: 'Datablocks',
      dependencies: ['objects'],
      content: {
        description: 'Datablocks are a fundamental concept in Torque 3D. Learn how to use them when you create all sorts of objects.'
      }
    }, {
      id: 'objects',
      name: 'Creating objects',
      dependencies: ['basic-ts'],
      content: {
        description: 'Load some simple objects into the game world.'
      }
    }, {
      id: 'callbacks',
      name: 'Callbacks',
      dependencies: ['basic-ts'],
      content: {
        description: 'Most TorqueScript functionality happens in callbacks. See some simple examples.'
      }
    }, {
      id: 'keybinds',
      name: 'Key bindings',
      dependencies: ['callbacks'],
      content: {
        description: 'Use an `ActionMap` to capture keyboard and mouse input.'
      }
    }, {
      id: 'free-camera',
      name: 'Free camera',
      dependencies: ['datablocks', 'keybinds'],
      content: {
        description: 'Fly around the level as a floating eyeball!'
      }
    }, {
      id: 'images',
      name: 'Weapon images',
      dependencies: ['fps-player'],
      content: {
        description: '`ShapeBaseImage`s allow you to mount items like weapons and equipment to your characters.'
      }
    }, {
      id: 'items',
      name: 'Items',
      dependencies: ['fps-player'],
      content: {
        description: 'The `Item` class lets you create useful objects for players to collect.'
      }
    }, {
      id: 'rts-camera',
      name: 'RTS camera',
      dependencies: ['free-camera'],
      content: {
        description: 'Make a moving overhead camera.'
      }
    }, {
      id: 'fps-player',
      name: 'First-person player',
      dependencies: ['keybinds', 'datablocks'],
      content: {
        description: 'Set up a first-person avatar to run around the level.'
      }
    }, {
      id: 'startup',
      name: 'Understanding startup',
      dependencies: ['basic-ts'],
      content: {
        description: 'Get to know how the engine startup sequence works and why `main.cs` looks the way it does.'
      }
    }, {
      id: 'lan-networking',
      name: 'Host a LAN game',
      dependencies: ['networking'],
      content: {
        description: 'Make your game visible to other clients on the same LAN.'
      }
    }, {
      id: 'navmesh',
      name: 'Navmeshes',
      dependencies: ['geometry'],
      content: {
        description: 'Learn how to create a Recast navmesh to cover your level.'
      }
    }, {
      id: 'pathfinding',
      name: 'Pathfinding',
      dependencies: ['aiplayer', 'navmesh'],
      content: {
        description: 'Make your minions navigate around obstacles intelligently with navmeshes.'
      }
    }, {
      id: 'basic-fps',
      name: 'A simple FPS',
      dependencies: ['pathfinding', 'images', 'items'],
      content: {
        description: 'Create a very simple FPS game with enemies that try to chase and attack you.'
      }
    }, {
      id: 'basic-rts',
      name: 'A simple RTS',
      dependencies: ['rts-control', 'rts-camera'],
      content: {
        description: 'Create a very simple FPS game with enemies that try to chase and attack you.'
      }
    }]
  },
});

map.onEvent('clickConcept', function(e) {
  var c = e.concept;
  $('#current-concept h2').text(c.name);
  $('#current-concept p').text(c.content.description);
});
