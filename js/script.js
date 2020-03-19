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

    d3.json('data/ori_rec_100_cluster.json'), //the original dataset with cluster assignment information (100 nodes, 1300 edges)
    d3.json('data/rec_100_clustered_uncertainty.json'), //the clustered graph dataset with uncertainty mean and uncertainty standard deviation information (20 nodes)
    d3.json('data/small_net.json')
    
]).then(function(files){

    //Instantiates graph object with data
    let full_graph = new Graph(files[0],'graph-orig','orig');
    full_graph.drawGraph();
    
    let processed_graph = new Graph(files[1],'graph-processed','clust');
    processed_graph.drawGraph();

    // let processed_graph = new Graph(files[2],'graph-processed','spars');
    // processed_graph.drawGraph();

    

});