// d3.json('data/small_net.json').then(data => {
    
//     //Instantiates graph object with data
//     let graph = new Graph(data);
//     graph.drawGraph()

//     //console.log(data)
// 	//const Graph = ForceGraph();
//     // Graph(document.getElementById('graph'))
//     //     .graphData(data)
//     //     .nodeRelSize(2)
//     //     .nodeColor(() => "black")
//     //     .nodeLabel(node => node.id)
//     //     .linkWidth(1)
//     //     .linkColor(() => "#4E4E54")
//     //     .linkWidth(link => link.average)
//     //     .zoom(1.5);

    
// });

// Loading a bunch of data at once
Promise.all([

    d3.json('data/rec_100_10.json'),
    d3.json('data/small_net.json')
    
]).then(function(files){

    //Instantiates graph object with data
    let processed_graph = new Graph(files[1],'graph-processed');
    processed_graph.drawGraph();

    let full_graph = new Graph(files[0],'graph-orig');
    full_graph.drawGraph();
    

});