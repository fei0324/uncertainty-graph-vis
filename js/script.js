d3.json('data/rec_100_10.json').then(data => {
	console.log(data)

	const Graph = ForceGraph();

    Graph(document.getElementById('graph'))
        .graphData(data)
        .nodeRelSize(2)
        .nodeColor(() => "black")
        .nodeLabel(node => node.id)
        .linkWidth(1)
        .linkColor(() => "#4E4E54")
        .linkWidth(link => link.average)
        .zoom(1.5);
});