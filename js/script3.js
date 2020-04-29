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



    // GRAPH COARSENING: ////////////////////////////////////////////////////////////////////
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
    d3.json('data/celegans_453/clu_14.json'), // 21

    // uncertainty matrix data - rectangle
    d3.csv('data/rec_100/uncertainty_mat_2.csv'), //22
    d3.csv('data/rec_100/uncertainty_mat_4.csv'), //23
    d3.csv('data/rec_100/uncertainty_mat_6.csv'), //24
    d3.csv('data/rec_100/uncertainty_mat_8.csv'), //25
    d3.csv('data/rec_100/uncertainty_mat_10.csv'), //26
    d3.csv('data/rec_100/uncertainty_mat_12.csv'), //27

    //uncertainty matrix data - c. elegans
    d3.csv('data/celegans_453/uncertainty_mat_10.csv'), //28
    d3.csv('data/celegans_453/uncertainty_mat_11.csv'), //29
    d3.csv('data/celegans_453/uncertainty_mat_12.csv'), //30
    d3.csv('data/celegans_453/uncertainty_mat_13.csv'), //31
    d3.csv('data/celegans_453/uncertainty_mat_14.csv'), //32

    //les mis originals
    d3.json('data/lesmis_77/original_9.json'), //33
    d3.json('data/lesmis_77/original_10.json'), //34
    d3.json('data/lesmis_77/original_11.json'), //35
    d3.json('data/lesmis_77/original_12.json'), //36
    d3.json('data/lesmis_77/original_13.json'), //37
    d3.json('data/lesmis_77/original_14.json'), //38

    //les mis processed
    d3.json('data/lesmis_77/clu_9.json'), //39
    d3.json('data/lesmis_77/clu_10.json'), //40
    d3.json('data/lesmis_77/clu_11.json'), //41
    d3.json('data/lesmis_77/clu_12.json'), //42
    d3.json('data/lesmis_77/clu_13.json'), //43
    d3.json('data/lesmis_77/clu_14.json'), //44

    //uncertainty matrix data - les mis
    d3.csv('data/lesmis_77/uncertainty_mat_9.csv'), //45
    d3.csv('data/lesmis_77/uncertainty_mat_10.csv'), //46
    d3.csv('data/lesmis_77/uncertainty_mat_11.csv'), //47
    d3.csv('data/lesmis_77/uncertainty_mat_12.csv'), //48
    d3.csv('data/lesmis_77/uncertainty_mat_13.csv'), //49
    d3.csv('data/lesmis_77/uncertainty_mat_14.csv'), //50

    /// SPARSIFICATION //////////////////////////////////////////////////////////////////////////////////////

    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.1.json'), //51
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.2.json'), //52
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.3.json'), //53
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.4.json'), //54
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.5.json'), //55
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.6.json'), //56
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.7.json'), //57
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.8.json'), //58
    d3.json('data/spectral_sparsification_lesmis/lesmis_77_0.9.json') //59
    
]).then(function(files){


    //Instantiates graph objects with data

    // TODO: Figure out loading data in better way than just doing it all at once at the beginning. 
    // TODO: Think what is slowing everyhting down is the continual call to drawing the graph, I can just pass
    // in the data when I'm in the same algorithm... implement this at some point

    // GRAPH COARSENING: ////////////////////////////////////////////////////////////////////

    //originals - rectangles
    let full_rect_2 = files[0];
    let full_rect_4 = files[1];
    let full_rect_6 = files[2];
    let full_rect_8 = files[3];
    let full_rect_10 = files[4];
    let full_rect_12 = files[5];
    
    //cluster - rectangles
    let proc_rect_2 = files[6];
    let proc_rect_4 = files[7];
    let proc_rect_6 = files[8];
    let proc_rect_8 = files[9];
    let proc_rect_10 = files[10];
    let proc_rect_12 = files[11];

    // heatmaps  - rectangles
    let hm_rect_2 = files[22];
    let hm_rect_4 = files[23];
    let hm_rect_6 = files[24];
    let hm_rect_8 = files[25];
    let hm_rect_10 = files[26];
    let hm_rect_12 = files[27];

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
    // heatmap - celegans
    let hm_cele_10 = files[28];
    let hm_cele_11= files[29];
    let hm_cele_12 = files[30];
    let hm_cele_13 = files[31];
    let hm_cele_14 = files[32];


    //originals - lesmis
    let full_mis_9 = files[33];
    let full_mis_10 = files[34];
    let full_mis_11 = files[35];
    let full_mis_12 = files[36];
    let full_mis_13 = files[37];
    let full_mis_14 = files[38];
    // cluster - lesmis
    let proc_mis_9 = files[39];
    let proc_mis_10 = files[40];
    let proc_mis_11 = files[41];
    let proc_mis_12 = files[42];
    let proc_mis_13 = files[43];
    let proc_mis_14 = files[44];
    // heatmap - lesmis
    let hm_mis_9 = files[45];
    let hm_mis_10 = files[46];
    let hm_mis_11 = files[47];
    let hm_mis_12 = files[48];
    let hm_mis_13 = files[49];
    let hm_mis_14 = files[50];

    /// SPARSIFICATION //////////////////////////////////////////////////////////////////////////////////////

    // Les mis spectral sparsification data
    let mis_spars_1 = files[51];
    let mis_spars_2 = files[52];
    let mis_spars_3 = files[53];
    let mis_spars_4 = files[54];
    let mis_spars_5 = files[55];
    let mis_spars_6 = files[56];
    let mis_spars_7 = files[57];
    let mis_spars_8 = files[58];
    let mis_spars_9 = files[59];


    // Makes graph objects once, passing in no data to begin with
    let full_rect = new Graph(null,'graph-orig','orig');
    let proc_rect = new Graph(null,'graph-processed','clust');

    // Makes heatmap
    let heatMap = new Table(null,full_rect,proc_rect)

    //Uncertainty dropdown
    $('#uncertaintyDrop').on('hide.bs.dropdown', function (e) {
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id

            // Finds which dataset is active 
            let active_data = $('#datasetDrop').find('.active')[0].id;
            console.log("active data",active_data);

            // Finds which algorithm is active 
            let active_alg = $('#algDrop').find('.active')[0].id;
            console.log("active algorithm",active_alg);

            // // changes active highlighting if it's a valid move
            // let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            // let kids = $('#algDrop').find('a')
            // kids.removeClass( "active" );
            // $(`#${target}`).addClass("active")

            // Clear anything in the mini graph canvas
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            if (target == 'ARI'){
                // Adjusted rand index
                //TODO: Hide buttons that don't apply/ make buttons that do reappear
                // changes active highlighting if it's a valid move
                let start_active = $('#uncertaintyDrop').find('active');
                // console.log("active start",start_active)
                let kids = $('#uncertaintyDrop').find('a')
                kids.removeClass( "active" );
                $(`#${target}`).addClass("active")

                if (active_data == 'rectangle'){
                    //Render coarse graph for rect
                    renderCoarseRect(target)

                }
                else if(active_data =='lesmis'){
                    //Render coarse graph for lesmis
                    renderCoarseLesmis()

                }
                else if(active_data == 'cele'){
                    //Render coarse graph for cele
                    renderCoarseCele()


                }

            }
            else if (target == 'JI'){
                // Jaccard
                //TODO: Hide buttons that don't apply/ make buttons that do reappear
                if (active_data == 'rectangle'){
                    // TODO: Display message on screen 
                    console.log('sparsification data not available')

                }
                else if(active_data =='lesmis'){
                    // changes active highlighting if it's a valid move
                    let start_active = $('#algDrop').find('active');
                    console.log("active start",start_active)
                    let kids = $('#algDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")
                    //Render sparse graph for lesmis
                    renderSparsLesmis()

                }
                else if(active_data == 'cele'){
                    console.log('sparsification data not available')


                }
            }
            else if (target == 'MI'){
                // Mutual information
                //TODO: Hide buttons that don't apply/ make buttons that do reappear
                if (active_data == 'rectangle'){
                    // TODO: Display message on screen 
                    console.log('sparsification data not available')

                }
                else if(active_data =='lesmis'){
                    // changes active highlighting if it's a valid move
                    let start_active = $('#algDrop').find('active');
                    console.log("active start",start_active)
                    let kids = $('#algDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")
                    //Render sparse graph for lesmis
                    renderSparsLesmis()

                }
                else if(active_data == 'cele'){
                    console.log('sparsification data not available')


                }
            }
        }

    });

    //Algorithm dropdown
    $('#algDrop').on('hide.bs.dropdown', function (e) {
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id

            // Finds which dataset is active 
            let active_data = $('#datasetDrop').find('.active')[0].id;
            console.log("active data",active_data);

            // // changes active highlighting if it's a valid move
            // let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            // let kids = $('#algDrop').find('a')
            // kids.removeClass( "active" );
            // $(`#${target}`).addClass("active")

            // Clear anything in the mini graph canvas
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            if (target == 'coarse'){
                //TODO: Hide buttons that don't apply/ make buttons that do reappear
                // changes active highlighting if it's a valid move
                let start_active = $('#algDrop').find('active');
                console.log("active start",start_active)
                let kids = $('#algDrop').find('a')
                kids.removeClass( "active" );
                $(`#${target}`).addClass("active")

                

                if (active_data == 'rectangle'){
                    //Render coarse graph for rect
                    renderCoarseRect()
                }
                else if(active_data =='lesmis'){
                    //Render coarse graph for lesmis
                    renderCoarseLesmis()
                }
                else if(active_data == 'cele'){
                    //Render coarse graph for cele
                    renderCoarseCele()

                }


            }
            else if (target == 'spars'){
                //TODO: Hide buttons that don't apply/ make buttons that do reappear
                if (active_data == 'rectangle'){
                    // TODO: Display message on screen 
                    console.log('sparsification data not available')

                }
                else if(active_data =='lesmis'){
                    // changes active highlighting if it's a valid move
                    let start_active = $('#algDrop').find('active');
                    console.log("active start",start_active)
                    let kids = $('#algDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")
                    //Render sparse graph for lesmis
                    renderSparsLesmis()

                }
                else if(active_data == 'cele'){
                    console.log('sparsification data not available')


                }


            }
        }


    });


    // Data dropdown
    $('#datasetDrop').on('hide.bs.dropdown', function (e) {
        // Finds active thing in the data drop down 
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id
            // console.log(target)

            // Clear anything in the mini graph canvas
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)


            // Finds which algorithm is active 
            let active_alg = $('#algDrop').find('.active')[0].id;
            console.log("active algorithm",active_alg);

            

            if (active_alg=='coarse'){
                // changes active highlighting
                let kids = $('#datasetDrop').find('a')
                kids.removeClass( "active" );
                $(`#${target}`).addClass("active")

                if (target == 'rectangle'){
                    renderCoarseRect()
                }
                else if(target =='lesmis'){
                    renderCoarseLesmis()
                }
                else if(target =='cele'){
                    renderCoarseCele()
    
                }
            }
            else if (active_alg=='spars'){
                if (target == 'rectangle'){
                    // TODO: Display message on screen 
                    console.log('sparsification data not available')

                }
                else if(target =='lesmis'){
                    // changes active highlighting
                    let kids = $('#datasetDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")
                    //Render sparse graph for lesmis
                    renderSparsLesmis()

                }
                else if(target == 'cele'){
                    console.log('sparsification data not available')


                }

            }
            
        }

      })


      // Button inversion dropdown - simply changes active class then calls prep graph?
      $('#invertDrop').on('hide.bs.dropdown', function (e) {
        // console.log(e)
        let drop_invert = null;
        let targetClass = null;
        if (e.clickEvent){
            targetClass = $(e.clickEvent.target).attr('class')
        }
        if (targetClass == 'dropdown-item'){
            let target = e.clickEvent.target.id;
            // console.log('target',target)
            drop_invert = target;

            // changes active highlighting
            let kids = $('#invertDrop').find('a')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            //Redraws
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Feeding in graph data like this speeds things up really well!
            full_rect.myGraph.graphData(full_rect.data)
            proc_rect.myGraph.graphData(proc_rect.data)
        }
        // console.log('drop_edge',drop_invert)

        


    })


    /////////////////////// COARSENING RENDERING FUNCTIONS //////////////////////////////////////

    function renderCoarseRect(){

         //Sets default k
         this.k = 2
         let range = [2,12]
         let that = this;

         // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        //Creates k bar
        let k_Bar = new kBar(this.k,range,'coarse-rect');

         // Initial k is 2, so draws this
         // let full_rect = new Graph(files[3],'graph-orig','orig');
         // let proc_rect = new Graph(files[7],'graph-processed','clust');
         full_rect.data = full_rect_2;
         proc_rect.data = proc_rect_2;

         proc_rect.type = 'clust'
         full_rect.prepGraph(proc_rect);
         proc_rect.prepGraph(full_rect);

         full_rect.drawGraph(proc_rect);
         proc_rect.drawGraph(full_rect);

         heatMap.data = hm_rect_2;
         heatMap.full_ref = full_rect;
         heatMap.proc_ref = proc_rect;
         heatMap.removeHeatMap()
         heatMap.createHeatMap();

         // detects change on bar and updates data shown accordingly
         d3.select('#coarse-rect').on('input', function(d){
             that.k = k_Bar.activeK;
            //  console.log('in script',that.k)
             
             
             if(k_Bar.activeK == 2){
                 // Draws graph and passes in references to other objects

                 full_rect.data = full_rect_2;
                 proc_rect.data = proc_rect_2;

                 heatMap.data = hm_rect_2
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()
                
                 
         
             }
             else if(k_Bar.activeK == 4){
                 // Draws graph and passes in references to other objects
                 full_rect.data = full_rect_4;
                 proc_rect.data = proc_rect_4;
                 
                 heatMap.data = hm_rect_4
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()

             }
             else if(k_Bar.activeK == 6){
                 // Draws graph and passes in references to other objects
                 // full_rect_6.drawGraph(proc_rect_6);
                 // proc_rect_6.drawGraph(full_rect_6);
                 full_rect.data = full_rect_6;
                 proc_rect.data = proc_rect_6;

                 heatMap.data = hm_rect_6
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()

             }
             else if(k_Bar.activeK == 8){
                 // Draws graph and passes in references to other objects
                 full_rect.data = full_rect_8;
                 proc_rect.data = proc_rect_8;

                 heatMap.data = hm_rect_8
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()

             }
             else if(k_Bar.activeK == 10){
                 // Draws graph and passes in references to other objects
                 full_rect.data = full_rect_10;
                 proc_rect.data = proc_rect_10;

                 heatMap.data = hm_rect_10
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()


             }
             else if(k_Bar.activeK == 12){
                 // Draws graph and passes in references to other objects
                 full_rect.data = full_rect_12;
                 proc_rect.data = proc_rect_12;

                 heatMap.data = hm_rect_12
                 heatMap.removeHeatMap()
                 heatMap.createHeatMap()

             }
             // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
             full_rect.prepGraph(proc_rect);
             proc_rect.prepGraph(full_rect);

             // Pass references to heatmap as well
             heatMap.full_ref = full_rect;
             heatMap.proc_ref = proc_rect;

             // Feeding in graph data like this speeds things up really well!
             full_rect.myGraph.graphData(full_rect.data)
             proc_rect.myGraph.graphData(proc_rect.data)


         })
    }

    function renderCoarseLesmis(){
        // Loads lesmis data set
        //Sets default k
        this.k = 9
        let range = [9,14]
        let that = this;

        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        //Creates k bar
        let k_Bar = new kBar(this.k,range,'coarse-mis');
        

        full_rect.data = full_mis_9;
        proc_rect.data = proc_mis_9;

        proc_rect.type = 'clust';
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);


        heatMap.data = hm_mis_9;
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;
        heatMap.removeHeatMap()
        heatMap.createHeatMap();

        
        // detects change on bar and updates data shown accordingly
        d3.select('#coarse-mis').on('input', function(d){
            that.k = k_Bar.activeK;
            // console.log('in script',that.k)
            
            if(k_Bar.activeK == 9){
                // Draws graph and passes in references to other objects

                full_rect.data = full_mis_9;
                proc_rect.data = proc_mis_9;

                heatMap.data = hm_mis_9
                heatMap.removeHeatMap()
                heatMap.createHeatMap()
                
        
            }
            else if(k_Bar.activeK == 10){
                // Draws graph and passes in references to other objects

                full_rect.data = full_mis_10;
                proc_rect.data = proc_mis_10;

                heatMap.data = hm_mis_10
                heatMap.removeHeatMap()
                heatMap.createHeatMap()
                
        
            }
            else if(k_Bar.activeK == 11){
                // Draws graph and passes in references to other objects

                full_rect.data = full_mis_11;
                proc_rect.data = proc_mis_11;

                heatMap.data = hm_mis_11
                heatMap.removeHeatMap()
                heatMap.createHeatMap()
            }
            else if(k_Bar.activeK == 12){
                // Draws graph and passes in references to other objects
                full_rect.data = full_mis_12;
                proc_rect.data = proc_mis_12;

                heatMap.data = hm_mis_12
                heatMap.removeHeatMap()
                heatMap.createHeatMap()

            }
            else if(k_Bar.activeK == 13){
                // Draws graph and passes in references to other objects

                full_rect.data = full_mis_13;
                proc_rect.data = proc_mis_13;

                heatMap.data = hm_mis_13
                heatMap.removeHeatMap()
                heatMap.createHeatMap()


            }
            else if(k_Bar.activeK == 14){
                // Draws graph and passes in references to other objects
                full_rect.data = full_mis_14;
                proc_rect.data = proc_mis_14;

                heatMap.data = hm_mis_14
                heatMap.removeHeatMap()
                heatMap.createHeatMap()


            }
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;

            // Feeding in graph data like this speeds things up really well!
            full_rect.myGraph.graphData(full_rect.data)
            proc_rect.myGraph.graphData(proc_rect.data)




        })
    }
    
    function renderCoarseCele(){
         // Loads c-elegans data set
        //Sets default k
        this.k = 10
        let range = [10,14]
        let that = this;

        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        //Creates k bar
        let k_Bar = new kBar(this.k,range,'coarse-cele');

        full_rect.data = full_cele_10;
        proc_rect.data = proc_cele_10;

        proc_rect.type = 'clust'
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);

        heatMap.data = hm_cele_10;
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;
        heatMap.removeHeatMap()
        heatMap.createHeatMap();

        
        // detects change on bar and updates data shown accordingly
        d3.select('#coarse-cele').on('input', function(d){
            that.k = k_Bar.activeK;
            // console.log('in script',that.k)
            
            
            if(k_Bar.activeK == 10){
                // Draws graph and passes in references to other objects

                full_rect.data = full_cele_10;
                proc_rect.data = proc_cele_10;

                heatMap.data = hm_cele_10
                heatMap.removeHeatMap()
                heatMap.createHeatMap()
                
        
            }
            else if(k_Bar.activeK == 11){
                // Draws graph and passes in references to other objects

                full_rect.data = full_cele_11;
                proc_rect.data = proc_cele_11;

                heatMap.data = hm_cele_11
                heatMap.removeHeatMap()
                heatMap.createHeatMap()
            }
            else if(k_Bar.activeK == 12){
                // Draws graph and passes in references to other objects
                full_rect.data = full_cele_12;
                proc_rect.data = proc_cele_12;

                heatMap.data = hm_cele_12
                heatMap.removeHeatMap()
                heatMap.createHeatMap()

            }
            else if(k_Bar.activeK == 13){
                // Draws graph and passes in references to other objects

                full_rect.data = full_cele_13;
                proc_rect.data = proc_cele_13;

                heatMap.data = hm_cele_13
                heatMap.removeHeatMap()
                heatMap.createHeatMap()


            }
            else if(k_Bar.activeK == 14){
                // Draws graph and passes in references to other objects
                full_rect.data = full_cele_14;
                proc_rect.data = proc_cele_14;

                heatMap.data = hm_cele_14
                heatMap.removeHeatMap()
                heatMap.createHeatMap()


            }
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;

            // Feeding in graph data like this speeds things up really well!
            full_rect.myGraph.graphData(full_rect.data)
            proc_rect.myGraph.graphData(proc_rect.data)

        })
    
    }


////////////////////////////// SPARSIFICATION RENDERING FUNCTIONS ////////////////////////////////////////
    function renderSparsLesmis(){

        // Loads lesmis data set

        //Sets default k
        this.k = 0.1
        let range = [0.1,0.9]
        let that = this;

        //Sets default filter
        this.f = 0
        let f_range = [0,1]

        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        //Creates k bar
        let k_Bar = new kBar(this.k,range,'spars-mis');

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        //Creates k bar
        let f_Bar = new fBar(this.f,f_range,'spars-mis-f');

        // Can choose any data for full graph, there's no linked views with this.
        full_rect.data = full_mis_9;
        proc_rect.data = mis_spars_1;

        proc_rect.type = 'spars'
        full_rect.prepGraph(null);
        proc_rect.prepGraph();

        full_rect.drawGraph(null);
        proc_rect.drawGraph();

        // Pretty sure not heat map here, what else could I put there? 
        // heatMap.data = hm_mis_9;
        // heatMap.full_ref = full_rect;
        // heatMap.proc_ref = proc_rect;
        heatMap.removeHeatMap()
        // heatMap.createHeatMap();


        // FILTER BAR FUNCTIONALITY
        // Detects changes and messes with graph edge visibility
        d3.select('#spars-mis-f').on('input', function(d){
            that.f = f_Bar.activeF
            // console.log(that.f)

            let threshold = proc_rect.linkRange[1]*that.f;
            console.log(threshold)
            proc_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.mean) >= threshold) ? true : false )


        })

        
        // detects change on bar and updates data shown accordingly
        d3.select('#spars-mis').on('input', function(d){
            that.k = k_Bar.activeK;
            // console.log('in script',that.k)
            
            if(k_Bar.activeK == 0.1){
                // Draws graph and passes in references to other objects

                proc_rect.data = mis_spars_1;
                
        
            }
            else if(k_Bar.activeK == 0.2){
                // Draws graph and passes in references to other objects

                proc_rect.data = mis_spars_2;
                
        
            }
            else if(k_Bar.activeK == 0.3){
                // Draws graph and passes in references to other objects

                proc_rect.data = mis_spars_3;

            }
            else if(k_Bar.activeK == 0.4){
                // Draws graph and passes in references to other objects
                proc_rect.data = mis_spars_4;

            }
            else if(k_Bar.activeK == 0.5){
                // Draws graph and passes in references to other objects

                proc_rect.data = mis_spars_5;

            }
            else if(k_Bar.activeK == 0.6){
                // Draws graph and passes in references to other objects
                proc_rect.data = mis_spars_6;


            }
            else if(k_Bar.activeK == 0.7){
                // Draws graph and passes in references to other objects
                proc_rect.data = mis_spars_7;


            }
            else if(k_Bar.activeK == 0.8){
                // Draws graph and passes in references to other objects
                proc_rect.data = mis_spars_8;


            }
            else if(k_Bar.activeK == 0.9){
                // Draws graph and passes in references to other objects
                proc_rect.data = mis_spars_9;


            }
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            // full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);


            // Feeding in graph data like this speeds things up really well!
            // full_rect.myGraph.graphData(full_rect.data)
            // Think I have to redraw the graph here
            proc_rect.myGraph.graphData(proc_rect.data)


        })


    }
    

});