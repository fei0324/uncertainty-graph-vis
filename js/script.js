d3.json('data/small_net.json').then(data => {
    
    //Instantiates graph object with data
    let graph = new Graph(data);
    graph.drawGraph()

    //console.log(data)
	//const Graph = ForceGraph();
    // Graph(document.getElementById('graph'))
    //     .graphData(data)
    //     .nodeRelSize(2)
    //     .nodeColor(() => "black")
    //     .nodeLabel(node => node.id)
    //     .linkWidth(1)
    //     .linkColor(() => "#4E4E54")
    //     .linkWidth(link => link.average)
    //     .zoom(1.5);

    
});