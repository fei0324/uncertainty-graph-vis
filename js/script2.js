
//Instantiates graph objects with data

//This script loads data on demand instead of just all at once

// Makes graph objects once, passing in no data to begin with
let full_rect = new Graph(null,'graph-orig','orig');
let proc_rect = new Graph(null,'graph-processed','clust');

// Makes heatmap
let heatMap = new Table(null,full_rect,proc_rect,null,null,null)


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


        let start_active = $('#uncertaintyDrop').find('active');
        let kids = $('#uncertaintyDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        if (active_alg == 'coarse'){
            if (active_data == 'rectangle'){
                //Render coarse graph for rect
                renderCoarseRect(target)

            }
            else if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(target)

            }
            else if(active_data == 'cele'){
                //Render coarse graph for cele
                renderCoarseCele(target)

            }
        }
        else if (active_alg == 'sparse'){

            //TODO print message
            console.log("can't do nothin")

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
                renderCoarseRect(active_uncertainty)
            }
            else if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(active_uncertainty)
            }
            else if(active_data == 'cele'){
                //Render coarse graph for cele
                renderCoarseCele(active_uncertainty)

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
                renderCoarseLesmis(active_uncertainty)
            }
            else if(target =='cele'){
                renderCoarseCele(active_uncertainty)

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
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.removeHeatMap()
        heatMap.data = files[2];
        heatMap.data_name = 'rec_100';
        heatMap.uncert = uncert;
        heatMap.k = this.k;
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

            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.data_name = 'rec_100';
            heatMap.uncert = uncert;
            heatMap.k = k;
            heatMap.createHeatMap()

            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;
            
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Feeding in graph data like this speeds things up really well!
            full_rect.myGraph.graphData(full_rect.data)
            proc_rect.myGraph.graphData(proc_rect.data)

        })

    })
}

function renderCoarseLesmis(uncert){

    // Type of coarsening uncertainty vis
    this.uncert=uncert;

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
    

    Promise.all([
        //reduced
        d3.json(`data/njw_spectral_clustering/lesmis_77/cluster_${9}/${uncert}/uncertainty_graph.json`),
        //original
        d3.json(`data/njw_spectral_clustering/lesmis_77/cluster_${9}/${uncert}/ori_graph_with_cluster.json`),
        // uncertainty matrix
        d3.csv(`data/njw_spectral_clustering/lesmis_77/cluster_${9}/${uncert}/uncertain_mat.csv`)

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
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.data = files[2];
        heatMap.data_name = 'lesmis_77';
        heatMap.uncert = uncert;
        heatMap.k = k;
        heatMap.removeHeatMap()
        heatMap.createHeatMap()
        // Pass references to heatmap as well
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;


    })

    // detects change on bar and updates data shown accordingly
    d3.select('#coarse-mis').on('input', function(d){
        let k = k_Bar.activeK;
        //  console.log('in script',that.k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
            d3.json(`data/njw_spectral_clustering/lesmis_77/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/njw_spectral_clustering/lesmis_77/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/njw_spectral_clustering/lesmis_77/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            proc_rect.data = files[0];
            full_rect.data = files[1];

            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.data_name = 'lesmis_77';
            heatMap.uncert = uncert;
            heatMap.k = k;
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

function renderCoarseCele(uncert){

    // Type of uncertainty
    this.uncert = uncert;

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

    Promise.all([
        //reduced
        d3.json(`data/njw_spectral_clustering/celegans_453/cluster_${10}/${uncert}/uncertainty_graph.json`),
        //original
        d3.json(`data/njw_spectral_clustering/celegans_453/cluster_${10}/${uncert}/ori_graph_with_cluster.json`),
        // uncertainty matrix
        d3.csv(`data/njw_spectral_clustering/celegans_453/cluster_${10}/${uncert}/uncertain_mat.csv`)

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
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.removeHeatMap()
        heatMap.data = files[2];
        heatMap.data_name = 'celegans_453';
        heatMap.uncert = uncert;
        heatMap.k = k;
        heatMap.createHeatMap()
        // Pass references to heatmap as well
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;


    })

    // detects change on bar and updates data shown accordingly
    d3.select('#coarse-cele').on('input', function(d){
        let k = k_Bar.activeK;
        //  console.log('in script',that.k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
            d3.json(`data/njw_spectral_clustering/celegans_453/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/njw_spectral_clustering/celegans_453/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/njw_spectral_clustering/celegans_453/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            proc_rect.data = files[0];
            full_rect.data = files[1];

            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.data_name = 'celegans_453';
            heatMap.uncert = uncert;
            heatMap.k = k;
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
    // full_rect.data = full_mis_9;
    // Loads data based on parameters 
    Promise.all([
        //reduced
        d3.json(`data/spectral_sparsification_lesmis/lesmis_77_${0.1}.json`),
        //original
        d3.json(`data/njw_spectral_clustering/lesmis_77/cluster_9/local_adjusted_rand_index/ori_graph_with_cluster.json`),

    ]).then(function(files){
        proc_rect.data = files[0];
        full_rect.data = files[1];
        
        // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
        proc_rect.prepGraph();

        proc_rect.type = 'spars'
        full_rect.prepGraph();
        proc_rect.prepGraph();

        full_rect.drawGraph();
        proc_rect.drawGraph();

        proc_rect.myGraph.nodeRelSize(2);

        heatMap.removeHeatMap()

    })


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
        let k = k_Bar.activeK;
        //  console.log('in script',that.k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
            d3.json(`data/spectral_sparsification_lesmis/lesmis_77_${k}.json`),
            //original
            d3.json(`data/spectral_sparsification_lesmis/lesmis_77_${k}.json`)

        ]).then(function(files){
            proc_rect.data = files[0];
            
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            proc_rect.prepGraph();

            // Feeding in graph data like this speeds things up really well!
            proc_rect.myGraph.graphData(proc_rect.data)

        })

    })


}
    