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
    //original
    let full_graph = new Graph(files[0],'graph-orig','orig');
    //rectangle
    let rect_graph = new Graph(files[1],'graph-processed','clust');
    //small net
    let small_graph = new Graph(files[2],'graph-processed','spars');


    // Code below dictates what dataset loads at the beginning

    // Draws graph and passes in references to other objects
    full_graph.drawGraph(rect_graph);
    rect_graph.drawGraph(full_graph);
    
    // Data dropdown
    $('#datasetDrop').on('hide.bs.dropdown', function (e) {
        // do something...
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id
            // console.log(target)
            // changes active highlighting
            let kids = $('#datasetDrop').find('a')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            if (target == 'rectangle'){
                // Draws graph and passes in references to other objects
                // full_graph.drawGraph(rect_graph);
                console.log(rect_graph)
                rect_graph.drawGraph(full_graph);

                // Think I can do better...
                
            }
            else if(target =='lesmis'){
                console.log('coming soon')

            }
            else if(target =='small'){

                // Draws graph and passes in references to other objects
                // full_graph.drawGraph(small_graph);
                small_graph.drawGraph(full_graph);
            }
        }

      })
    

    

});