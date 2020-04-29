
//Instantiates graph objects with data

//This script loads data on demand instead of just all at once

// TODO: Figure out loading data in better way than just doing it all at once at the beginning. 
// TODO: Think what is slowing everyhting down is the continual call to drawing the graph, I can just pass
// in the data when I'm in the same algorithm... implement this at some point

// //Clustered
// d3.json(`data/njw_spectral_clustering/rec_100/cluster_${i}/${type}/uncertainty_graph.json`).then(data => {
//     that.myGraph.graphData(data)
// })
// //Original
// d3.json(`data/njw_spectral_clustering/rec_100/cluster_${i}/${type}/ori_graph_with_cluster.json`).then(data => {
//     that.myGraph.graphData(data)
// })

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

        if (target == 'local_adjusted_rand_index'){
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
        else if (target == 'local_jaccard_index'){
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
        else if (target == 'local_mutual_information'){
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

        // Finds which uncertainty is active 
        let active_uncertainty = $('#uncertaintyDrop').find('.active')[0].id;
        console.log("active uncertainty",active_uncertainty);

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

        // Finds which uncertainty is active 
        let active_uncertainty = $('#uncertaintyDrop').find('.active')[0].id;
        console.log("active uncertainty",active_uncertainty);
        

        if (active_alg=='coarse'){
            // changes active highlighting
            let kids = $('#datasetDrop').find('a')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            if (target == 'rectangle'){
                renderCoarseRect(active_uncertainty)
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

function renderCoarseRect(uncert){

    // Type of uncertainty
    this.uncert = uncert;

    console.log("type of uncertainty",this.uncert)

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

    Promise.all([
        //reduced
        d3.json(`data/njw_spectral_clustering/rec_100/cluster_${2}/${uncert}/uncertainty_graph.json`),
        //original
        d3.json(`data/njw_spectral_clustering/rec_100/cluster_${2}/${uncert}/ori_graph_with_cluster.json`),
        // uncertainty matrix
        d3.csv(`data/njw_spectral_clustering/rec_100/cluster_${2}/${uncert}/uncertain_mat.csv`)

    ]).then(function(files){
        
        proc_rect.data = files[0];
        full_rect.data = files[1];

        
        // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        proc_rect.type = 'clust'
        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);


        // heatmap initial data
        heatMap.data = files[2];
        heatMap.removeHeatMap()
        heatMap.createHeatMap()
        // Pass references to heatmap as well
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;


    })

    // detects change on bar and updates data shown accordingly
    d3.select('#coarse-rect').on('input', function(d){
        let k = k_Bar.activeK;
        //  console.log('in script',that.k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
            d3.json(`data/njw_spectral_clustering/rec_100/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/njw_spectral_clustering/rec_100/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/njw_spectral_clustering/rec_100/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            proc_rect.data = files[0];
            full_rect.data = files[1];

            heatMap.data = files[2];
            heatMap.removeHeatMap()
            heatMap.createHeatMap()
            
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

    })
}

function renderCoarseLesmis(type){

    // Type of coarsening uncertainty vis
    this.type=type;

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

function renderCoarseCele(type){

    // Type of uncertainty
    this.type = type;

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
    