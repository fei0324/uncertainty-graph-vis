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
    d3.json('data/small_net.json'),
    d3.json('data/rec_100/original_2.json'),
    d3.json('data/rec_100/original_4.json'),
    d3.json('data/rec_100/original_6.json'),
    d3.json('data/rec_100/original_8.json'),
    d3.json('data/rec_100/clu_2.json'),
    d3.json('data/rec_100/clu_4.json'),
    d3.json('data/rec_100/clu_6.json'),
    d3.json('data/rec_100/clu_8.json')

    
]).then(function(files){

    //Instantiates graph objects with data

    // TODO: Going to try a different tactic - create only one graph object then pass in
        // the relevant data - need to reorganize graph class to do this
        // Think this will solve some of my problems....

    // Current workflow: I make a single graph object for original, then processed graphs
    // When I choose a new value of k, I feed in the new graph data to the graph object
    // I then run 'prep' graph to create the scales, and draw graph to draw the graph
    // This is computationally overwhelming.. need to figure out a better way
    // Think the most expensive thing is to rerun the graph everytime... Figure out how to work around this.

    //originals - rectangles
    // let full_rect_2 = new Graph(files[3],'graph-orig','orig');
    // let full_rect_4 = new Graph(files[4],'graph-orig','orig');
    // let full_rect_6 = new Graph(files[5],'graph-orig','orig');
    // let full_rect_8 = new Graph(files[6],'graph-orig','orig');
    let full_rect_2 = files[3];
    let full_rect_4 = files[4];
    let full_rect_6 = files[5];
    let full_rect_8 = files[6];
    
    //rectangles
    // let proc_rect_2 = new Graph(files[7],'graph-processed','clust');
    // let proc_rect_4 = new Graph(files[8],'graph-processed','clust');
    // let proc_rect_6 = new Graph(files[9],'graph-processed','clust');
    // let proc_rect_8 = new Graph(files[10],'graph-processed','clust');
    let proc_rect_2 = files[7];
    let proc_rect_4 = files[8];
    let proc_rect_6 = files[9];
    let proc_rect_8 = files[10];

    //small net
    // let small_graph = new Graph(files[2],'graph-processed','spars');

    let full_rect = new Graph(files[3],'graph-orig','orig');
    let proc_rect = new Graph(files[7],'graph-processed','clust');


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
            let start_active = $('#datasetDrop').find('active');
            console.log("active start",start_active)
            let kids = $('#datasetDrop').find('a')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            if (target == 'rectangle'){

                //Sets default k
                this.k = 2
                let that = this;

                //Creates k bar
                let k_Bar = new kBar(this.k);

                // Initial k is 2, so draws this
                // let full_rect = new Graph(files[3],'graph-orig','orig');
                // let proc_rect = new Graph(files[7],'graph-processed','clust');

                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(full_rect);

                // detects change on bar and updates data shown accordingly
                d3.select('#activeK-bar').on('input', function(d){
                    that.k = k_Bar.activeK;
                    console.log('in script',that.k)
                    
                    
                    if(k_Bar.activeK == 2){
                        // Draws graph and passes in references to other objects
                        // full_rect_2.data = files[3]
                        // proc_rect_2.data = files[7]
                        // let full_rect = new Graph(files[3],'graph-orig','orig');
                        // let proc_rect = new Graph(files[7],'graph-processed','clust');


                        // full_rect.drawGraph(proc_rect);
                        // proc_rect.drawGraph(full_rect);

                        full_rect.data = full_rect_2;
                        proc_rect.data = proc_rect_2;
                        
                        // full_rect.prepGraph(proc_rect);
                        // proc_rect.prepGraph(full_rect);
                        // full_rect.drawGraph(proc_rect);
                        // proc_rect.drawGraph(full_rect);
                        
                
                    }
                    else if(k_Bar.activeK == 4){
                        // Draws graph and passes in references to other objects
                        // let full_rect = new Graph(files[4],'graph-orig','orig');
                        // let proc_rect = new Graph(files[8],'graph-processed','clust');

                        full_rect.data = full_rect_4;
                        proc_rect.data = proc_rect_4;
                        // full_rect.prepGraph(proc_rect);
                        // proc_rect.prepGraph(full_rect);
                        // full_rect.drawGraph(proc_rect);
                        // proc_rect.drawGraph(full_rect);

                        // // Passes in new data
                        // full_rect_2.data = files[4]
                        // proc_rect_2.data = files[8]
                        // // Then redraws the graph
                        // full_rect_2.drawGraph(proc_rect_2);
                        // proc_rect_2.drawGraph(full_rect_2);
                    }
                    else if(k_Bar.activeK == 6){
                        // Draws graph and passes in references to other objects
                        // full_rect_6.drawGraph(proc_rect_6);
                        // proc_rect_6.drawGraph(full_rect_6);
                        full_rect.data = full_rect_6;
                        proc_rect.data = proc_rect_6;

                    }
                    else if(k_Bar.activeK == 8){
                        // Draws graph and passes in references to other objects
                        // full_rect_8.drawGraph(proc_rect_8);
                        // proc_rect_8.drawGraph(full_rect_8);
                        full_rect.data = full_rect_8;
                        proc_rect.data = proc_rect_8;


                    }
                    // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                    full_rect.prepGraph(proc_rect);
                    proc_rect.prepGraph(full_rect);

                    // Feeding in graph data like this speeds things up really well!
                    full_rect.myGraph.graphData(full_rect.data)
                    proc_rect.myGraph.graphData(proc_rect.data)
                    // full_rect.drawGraph(proc_rect);
                    // proc_rect.drawGraph(full_rect);


                })



                // Think I can do better...
                
            }
            else if(target =='lesmis'){
                console.log('coming soon')

            }
            else if(target =='small'){

                // Draws graph and passes in references to other objects
                // full_graph.drawGraph(small_graph);
                // small_graph.drawGraph(full_rect_2);
            }
        }

      })

    
    




    // Code below dictates what dataset loads at the beginning

    // // Draws graph and passes in references to other objects
    // full_graph.drawGraph(rect_graph);
    // rect_graph.drawGraph(full_graph);
    
    // // Data dropdown
    // $('#datasetDrop').on('hide.bs.dropdown', function (e) {
    //     // do something...
    //     let targetClass = null;
    //     if (e.clickEvent){
    //         targetClass = $(e.clickEvent.target).attr('class')
    //     }
    //     if (targetClass == 'dropdown-item'){
    //         let target = e.clickEvent.target.id
    //         // console.log(target)
    //         // changes active highlighting
    //         let kids = $('#datasetDrop').find('a')
    //         kids.removeClass( "active" );
    //         $(`#${target}`).addClass("active")

    //         if (target == 'rectangle'){
    //             // Draws graph and passes in references to other objects
    //             // full_graph.drawGraph(rect_graph);
    //             console.log(rect_graph)
    //             rect_graph.drawGraph(full_graph);

    //             // Think I can do better...
                
    //         }
    //         else if(target =='lesmis'){
    //             console.log('coming soon')

    //         }
    //         else if(target =='small'){

    //             // Draws graph and passes in references to other objects
    //             // full_graph.drawGraph(small_graph);
    //             small_graph.drawGraph(full_graph);
    //         }
    //     }

    //   })
    

    

});