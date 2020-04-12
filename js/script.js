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

    // d3.json('data/ori_rec_100_cluster.json'), //the original dataset with cluster assignment information (100 nodes, 1300 edges)
    // d3.json('data/rec_100_clustered_uncertainty.json'), //the clustered graph dataset with uncertainty mean and uncertainty standard deviation information (20 nodes)
    // d3.json('data/small_net.json'),
    // rectangle orignals
    d3.json('data/rec_100/original_2.json'), // 0
    d3.json('data/rec_100/original_4.json'), // 1 
    d3.json('data/rec_100/original_6.json'), // 2 
    d3.json('data/rec_100/original_8.json'),  // 3
    d3.json('data/rec_100/original_10.json'), // 4 
    d3.json('data/rec_100/original_12.json'), // 5
    // rectangle clusters
    d3.json('data/rec_100/clu_2.json'), // 6 
    d3.json('data/rec_100/clu_4.json'), // 7
    d3.json('data/rec_100/clu_6.json'), // 8
    d3.json('data/rec_100/clu_8.json'), // 9 
    d3.json('data/rec_100/clu_10.json'), // 10 
    d3.json('data/rec_100/clu_12.json'), // 11 
    // c elegans originals
    d3.json('data/celegans_453/original_10.json'), // 12 
    d3.json('data/celegans_453/original_11.json'), // 13 
    d3.json('data/celegans_453/original_12.json'), // 14 
    d3.json('data/celegans_453/original_13.json'), // 15
    d3.json('data/celegans_453/original_14.json'), // 16
    // c elegans clusters
    d3.json('data/celegans_453/clu_10.json'), // 17
    d3.json('data/celegans_453/clu_11.json'), // 18
    d3.json('data/celegans_453/clu_12.json'), // 19
    d3.json('data/celegans_453/clu_13.json'), // 20
    d3.json('data/celegans_453/clu_14.json') // 21

    
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
    let full_rect_2 = files[0];
    let full_rect_4 = files[1];
    let full_rect_6 = files[2];
    let full_rect_8 = files[3];
    let full_rect_10 = files[4];
    let full_rect_12 = files[5];
    
    //cluster - rectangles
    // let proc_rect_2 = new Graph(files[7],'graph-processed','clust');
    // let proc_rect_4 = new Graph(files[8],'graph-processed','clust');
    // let proc_rect_6 = new Graph(files[9],'graph-processed','clust');
    // let proc_rect_8 = new Graph(files[10],'graph-processed','clust');
    let proc_rect_2 = files[6];
    let proc_rect_4 = files[7];
    let proc_rect_6 = files[8];
    let proc_rect_8 = files[9];
    let proc_rect_10 = files[10];
    let proc_rect_12 = files[11];


    //originals - celeegans
    let full_cele_10 = files[12];
    let full_cele_11 = files[13];
    let full_cele_12 = files[14];
    let full_cele_13 = files[15];
    let full_cele_14 = files[16];
    // cluster - celegans
    let proc_cele_10 = files[17];
    let proc_cele_11= files[18];
    let proc_cele_12 = files[19];
    let proc_cele_13 = files[20];
    let proc_cele_14 = files[21];


    // Makes graph objects once, passing in no data to begin with
    let full_rect = new Graph(null,'graph-orig','orig');
    let proc_rect = new Graph(null,'graph-processed','clust');


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
                let range = [2,12]
                let that = this;

                // deletes k bar if one exists  
                d3.select(".slider-wrap").remove();

                //Creates k bar
                let k_Bar = new kBar(this.k,range);

                // Initial k is 2, so draws this
                // let full_rect = new Graph(files[3],'graph-orig','orig');
                // let proc_rect = new Graph(files[7],'graph-processed','clust');
                full_rect.data = full_rect_2;
                proc_rect.data = proc_rect_2;

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
                    else if(k_Bar.activeK == 10){
                        // Draws graph and passes in references to other objects
                        // full_rect_8.drawGraph(proc_rect_8);
                        // proc_rect_8.drawGraph(full_rect_8);
                        full_rect.data = full_rect_10;
                        proc_rect.data = proc_rect_10;


                    }
                    else if(k_Bar.activeK == 12){
                        // Draws graph and passes in references to other objects
                        // full_rect_8.drawGraph(proc_rect_8);
                        // proc_rect_8.drawGraph(full_rect_8);
                        full_rect.data = full_rect_12;
                        proc_rect.data = proc_rect_12;


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

                
            }
            else if(target =='lesmis'){
                console.log('coming soon')

            }
            else if(target =='cele'){
                // Loads c-elegans data set
                //Sets default k
                this.k = 10
                let range = [10,14]
                let that = this;

                // deletes k bar if one exists  
                d3.select(".slider-wrap").remove();

                //Creates k bar
                let k_Bar = new kBar(this.k,range);

                full_rect.data = full_cele_10;
                proc_rect.data = proc_cele_10;

                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);

                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(full_rect);

                
                // detects change on bar and updates data shown accordingly
                d3.select('#activeK-bar').on('input', function(d){
                    that.k = k_Bar.activeK;
                    console.log('in script',that.k)
                    
                    
                    if(k_Bar.activeK == 10){
                        // Draws graph and passes in references to other objects
                        // full_rect_2.data = files[3]
                        // proc_rect_2.data = files[7]
                        // let full_rect = new Graph(files[3],'graph-orig','orig');
                        // let proc_rect = new Graph(files[7],'graph-processed','clust');


                        // full_rect.drawGraph(proc_rect);
                        // proc_rect.drawGraph(full_rect);

                        full_rect.data = full_cele_10;
                        proc_rect.data = proc_cele_10;
                        
                
                    }
                    else if(k_Bar.activeK == 11){
                        // Draws graph and passes in references to other objects
                        // let full_rect = new Graph(files[4],'graph-orig','orig');
                        // let proc_rect = new Graph(files[8],'graph-processed','clust');

                        full_rect.data = full_cele_11;
                        proc_rect.data = proc_cele_11;
                    }
                    else if(k_Bar.activeK == 12){
                        // Draws graph and passes in references to other objects
                        // full_rect_6.drawGraph(proc_rect_6);
                        // proc_rect_6.drawGraph(full_rect_6);
                        full_rect.data = full_cele_12;
                        proc_rect.data = proc_cele_12;

                    }
                    else if(k_Bar.activeK == 13){
                        // Draws graph and passes in references to other objects
                        // full_rect_8.drawGraph(proc_rect_8);
                        // proc_rect_8.drawGraph(full_rect_8);
                        full_rect.data = full_cele_13;
                        proc_rect.data = proc_cele_13;


                    }
                    else if(k_Bar.activeK == 14){
                        // Draws graph and passes in references to other objects
                        // full_rect_8.drawGraph(proc_rect_8);
                        // proc_rect_8.drawGraph(full_rect_8);
                        full_rect.data = full_cele_14;
                        proc_rect.data = proc_cele_14;


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


            }
        }

      })


      // Button inversion dropdown - simply changes active class the calls prep graph?
      $('#invertDrop').on('hide.bs.dropdown', function (e) {
        // console.log(e)
        let drop_invert = null;
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id;
            console.log('target',target)
            drop_invert = target;

            // changes active highlighting
            let kids = $('#invertDrop').find('a')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            
        }
        console.log('drop_edge',drop_invert)

        //Redraws
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        // Feeding in graph data like this speeds things up really well!
        full_rect.myGraph.graphData(full_rect.data)
        proc_rect.myGraph.graphData(proc_rect.data)


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