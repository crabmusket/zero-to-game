var map = knowledgeMap.create({
  graph: {
    concepts: [{
      id: 'setup',
      name: 'Get set up',
      content: {
        description: 'Download and run a binary distribution of Torque 3D.'
      }
    }, {
      id: 'basic-ts',
      name: 'Basic TorqueScript',
      dependencies: ['setup'],
      content: {
        description: 'Learn the basics of TorqueScript, the language you\'ll use throughout this series, and how the example application is structured.'
      }
    }, {
      id: 'objects',
      name: 'Creating objects',
      dependencies: ['basic-ts'],
      content: {
        description: 'Load some simple objects into the game world.'
      }
    }, {
      id: 'httpobject',
      name: 'Talk to a server',
      dependencies: ['objects'],
      content: {
        description: 'Use the `HTTPObject` class to interact with a remote server.'
      }
    }, {
      id: 'keybinds',
      name: 'Key bindings',
      dependencies: ['basic-ts'],
      content: {
        description: 'Use an `ActionMap` to capture keyboard and mouse input.'
      }
    }, {
      id: 'free-camera',
      name: 'Free camera',
      dependencies: ['objects', 'keybinds'],
      content: {
        description: 'Fly around the level as a floating eyeball!'
      }
    }, {
      id: 'basic-hud',
      name: 'Edit the HUD',
      dependencies: ['objects'],
      content: {
        description: 'Add a simple heads-up display on top of the game display'
      }
    }, {
      id: 'basic-gui',
      name: 'Make a main menu',
      dependencies: ['basic-hud'],
      content: {
        description: 'Start your game in a main menu, not a 3D world view.'
      }
    }, {
      id: 'basic-rift',
      name: 'Oculus Rift basics',
      dependencies: ['compiling', 'basic-ts'],
      content: {
        description: 'Set up integeration with the Oculus Rift.'
      }
    }, {
      id: 'compiling',
      name: 'Compile the engine',
      content: {
        description: 'Get set up to compile Torque from its source code.'
      }
    }, {
      id: 'lan-networking',
      name: 'Host a LAN game',
      dependencies: ['networking'],
      content: {
        description: 'Make your game visible to other clients on the same LAN.'
      }
    }, {
      id: 'networking',
      name: 'Networking',
      dependencies: [],
      content: {
        description: 'Add networking to your game!'
      }
    }, {
      id: 'startup',
      name: 'Understanding startup',
      dependencies: ['basic-ts'],
      content: {
        description: 'Get to know how the engine startup sequence works and why `main.cs` looks the way it does.'
      }
    }]
  },
  layout: {
    direction: 'BT'
  },
  plugins: ['click-events'],
});

map.onEvent('clickConcept', function(e) {
  var c = e.concept;
  $('#current-concept h2').text(c.name);
  $('#current-concept p').text(c.content.description);
});
