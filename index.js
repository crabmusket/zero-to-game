knowledgeMap.create({
  graph: {
    concepts: [{
      id: 'knowledge-map',
      name: 'What is a knowledge map?',
      content: [{
        text: "Knowledge maps are like a roadmap for pieces of knowledge. They can be used to show others how to navigate from their current set of knowledge to a particular goal. Or they can be used to find people who know something you haven't learnt yet.",
      }]
    }, {
      id: 'viewing',
      name: 'Viewing a knowledge map',
      dependencies: ['knowledge-map'],
      content: [{
        text: "You're doing it right now! Each of the labelled points on the page is called a 'concept' and the arrows joining them are called 'dependencies'. Concepts are pieces of information that can be learned if you have learned all of the concepts which point to it. That is, if you want to learn a concept learn all of its dependencies!",
      }]
    }]
  },
  plugins: [],
});
