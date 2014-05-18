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
      dependencies: ['basic-ts'],
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
