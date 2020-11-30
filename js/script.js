////////////////////////////// HIGH-LEVEL DESCRIPTION: /////////////////////////////////////
// script.js contains all of the logic and event listeners for the toolbar buttons.
// When toolbar buttons are clicked and the various logic paths are traveresed, there
// are a series of helper functions which load the appropriate data into the 'Graph' and  
// 'Table' classes. 
// Additionally, there is code which populates descriptions of the various features of the vis 
// as the user hovers over them.

// The general structure is:

// 1) INITIALIZING CLASSES + HANDLING WINDOW RESIZING

// 2) TOOLBAR LOGIC AND CALLS TO RENDERING FUNCTIONS

// 3) RENDERING FUNCTIONS

// 4) DESCRIPTION CODE

//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////  INITIALIZING CLASSES + HANDLING WINDOW RESIZING /////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// Initializes graph objects, passing in no data to begin with
// full_rect is the graph object for the full, un-processed graph. This will be referenced in the 
// rendering functions.
let full_rect = new Graph(null,'graph-orig','orig');
// proc_rect is the graph object for the reduced graph. This will be referenced in the rendering functions.
let proc_rect = new Graph(null,'graph-processed','clust');
// // Intance graph exclusively for co-occurrence 
// let instance_graph = new Graph(null,'graph-mini','instance');
let instance_graph = null;

// Initializes table object. This is the heatmap. This will be referenced in the rendering functions.
let heatMap = new Table(null,full_rect,proc_rect,null,null,null)

// Populates default view 
renderCoarseLesmis('local_adjusted_rand_index','njw_spectral_clustering');
$(`#gemsec`).addClass('disabled')

// Populates indiviudal graph - make sure to comment out the 2 lines of code directly above this
// Add path of data you want to display 
// path = 'data/njw_spectral_clustering/rec_100/cluster_10/local_jaccard_index/uncertainty_graph.json'
// renderIndividualGraph(path)
function renderIndividualGraph(path){

    // Load the data
    Promise.all([
        d3.json(path)
    ]).then(function(files){
        myData = files[0];

        // Simple graph
        let myGraph = ForceGraph();

        //Setting width and height of canvas object
        let location = document.getElementById('graph-processed')
        // console.log("LOCATION",this.LOCATION)

        // Canvas width and height
        let boundingRect = location.getBoundingClientRect()
        let WIDTH = boundingRect.width-6;
        let HEIGHT = boundingRect.height-4;

        myGraph(location)
            .graphData(files[0])
            .width(WIDTH)
            .height(HEIGHT);
            // Add any desirable stying here


    })


}

// Handling resizing stuff
window.addEventListener("resize", resize);
var redraw = document.getElementById("redraw");
function resize (event) {
    // Gets new sizes and sets new canvas dimensions

    let orig_loc = document.getElementById('graph-orig');
    let proc_loc = document.getElementById('graph-processed');
    let mini_loc = document.getElementById('graph-mini');

    // retrieves new size
    let boundingRect_orig = orig_loc.getBoundingClientRect();
    let boundingRect_proc = proc_loc.getBoundingClientRect();
    let boundingRect_mini = mini_loc.getBoundingClientRect();
    // stores new size width
    let orig_width = boundingRect_orig.width - 6;
    let orig_height = boundingRect_orig.height - 8;
    let proc_width = boundingRect_proc.width - 6;
    // stores new size height
    let proc_height = boundingRect_proc.height - 4;
    let mini_width = boundingRect_mini.width - 7;
    let mini_height = boundingRect_mini.height - 8;
    // re-adjusts the width and height of the graph using new, stored width and height
    full_rect.myGraph.width(orig_width);
    full_rect.myGraph.height(orig_height);
    proc_rect.myGraph.width(proc_width);
    proc_rect.myGraph.height(proc_height);
    heatMap.myGraph.width(mini_width);
    heatMap.myGraph.height(mini_height);
    
    if (instance_graph !== null){
        instance_graph.myGraph
            .height(mini_height)
            .width(mini_width);
    }
    

    // Now I need to resize the heat map (only if there currently is one)
    if (document.getElementById('row-g-0')){
        // console.log("heatmap exists")
        heatMap.removeHeatMap()
        heatMap.createHeatMap()
    }

    // Resize legend
    proc_rect.legend(proc_rect.link_legend,proc_rect,proc_rect.linkColor,'link');
    proc_rect.legend(proc_rect.node_legend,proc_rect,proc_rect.color,'node');
    
}

//////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////// TOOLBAR LOGIC AND CALLS TO RENDERING FUNCTIONS ///////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

//Uncertainty dropdown logic
$('#uncertaintyDrop').on('hide.bs.dropdown', function (e) {
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id

        //Removes infobox if still up
        d3.select(`#infobox-graph-orig`).transition()
            .duration(200)
            .style("opacity", 0);

        // Finds which dataset is active 
        let active_data = $('#datasetDrop').find('.active')[0].id;
        // console.log("active data",active_data);

        // Finds which algorithm is active 
        let active_alg = $('#algDrop').find('.active')[0].id;
        // console.log("active algorithm",active_alg);

        // Clear anything in the mini graph canvas
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        // removes bars
        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        // deletes q bar if one exists  
        d3.select(".active-qBar").remove();

        // makes the most recently selected target the 'active' option and removes
        // active class from previously active option
        let start_active = $('#uncertaintyDrop').find('active');
        let kids = $('#uncertaintyDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        //Remove unneccessary buttons for co-occurrence
        if (target == 'co_occurrence'){
            $(`#dropdownMenuButtonNode`).addClass('disabled')
            $(`#dropdownMenuButtonEdge`).addClass('disabled')
            $(`#dropdownMenuButtonSTD`).addClass('disabled')
            $(`#dropdownMenuButtonInvert`).addClass('disabled')
            instance_graph = new Graph(null,'graph-mini','instance');

        }
        //add them back if not co occurrence
        else{
            $(`#dropdownMenuButtonNode`).removeClass('disabled')
            $(`#dropdownMenuButtonEdge`).removeClass('disabled')
            $(`#dropdownMenuButtonSTD`).removeClass('disabled')
            $(`#dropdownMenuButtonInvert`).removeClass('disabled')
            // reset individual instance graph that's located in heatmap object
            d3.select("#graph-mini").select('canvas').remove()
            heatmap = new Table(null,full_rect,proc_rect,null,null,null)
            // // Creating force graph
            // let myGraph = ForceGraph();

            // //Setting width and height of canvas object
            // let LOCATION = document.getElementById('graph-mini')

            // // Canvas width and height
            // let boundingRect = LOCATION.getBoundingClientRect()
            // // console.log('graph mini rect',boundingRect)
            // let WIDTH = boundingRect.width - 7;
            // let HEIGHT = boundingRect.height - 8;
            // // console.log('graph mini dims',this.WIDTH,this.HEIGHT
            
            // heatmap.myGraph = myGraph(LOCATION)
            //     .width(WIDTH)
            //     .height(HEIGHT)
            //     .nodeColor(() => "black");
            // heatmap.coOccur = false

        }

        if (active_alg == 'coarse'){
            if (active_data == 'rectangle'){
                //Render coarse graph for rect
                renderCoarseRect(target,'njw_spectral_clustering')

            }
            else if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(target,'njw_spectral_clustering')

            }
            else if(active_data == 'cele'){
                //Render coarse graph for cele
                renderCoarseCele(target,'njw_spectral_clustering')

            }
            else if(active_data == 'email'){
                //Render coarse graph for email
                renderCoarseEmail(target,'njw_spectral_clustering')

            }
            else if(active_data == 'enron'){
                //Render coarse graph for email
                renderCoarseEnron(target,'njw_spectral_clustering')

            }
            else if(active_data == 'football'){
                //Render coarse graph for email
                renderCoarseFootball(target,'njw_spectral_clustering')

            }
        }
        else if (active_alg == 'spec_coarse'){
            if (active_data == 'rectangle'){
                //Render coarse graph for rect
                renderCoarseRect(target,'spectral_coarsening')

            }
            else if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(target,'spectral_coarsening')

            }
            else if(active_data == 'cele'){
                //Render coarse graph for cele
                renderCoarseCele(target,'spectral_coarsening')

            }
            else if(active_data == 'enron'){
                renderCoarseEnron(target,'spectral_coarsening')
            }

        }
        else if (active_alg == 'unifying_framework_coarse'){
            if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(target,'unifying_framework_coarsen')

            }

        }
        else if (active_alg == 'gemsec'){
            if(active_data =='tv'){
                //Render gemsec graph for tv 
                renderGemsecTv(target,'gemsec')

            }

        }
    }

});

// Algorithm dropdown logic
// Deals with detecting which algorithm was selected in combination with which dataset and loading the 
// appropriate data into the vis.
$('#algDrop').on('hide.bs.dropdown', function (e) {
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id

        //Removes infobox if still up
        d3.select(`#infobox-graph-orig`).transition()
            .duration(200)
            .style("opacity", 0);

        // Finds which dataset is active 
        let active_data = $('#datasetDrop').find('.active')[0].id;
        // console.log("active data",active_data);

        // Finds which uncertainty is active 
        let active_uncertainty = $('#uncertaintyDrop').find('.active')[0].id;
        // console.log("active uncertainty",active_uncertainty);

        // Clear anything in the mini graph canvas
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        // removes bars
        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        // deletes q bar if one exists  
        d3.select(".active-qBar").remove();
        

        if (target == 'coarse'){
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            // Enables datasets with course algorithm
            // $(`#rectangle`).removeClass('disabled')
            // $(`#cele`).removeClass('disabled')
            // $(`#email`).removeClass('disabled')

            //re-enables buttons that didn't work with sparsification algo
            // uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')


            if (active_data == 'rectangle'){
                //Render coarse graph for rect
                renderCoarseRect(active_uncertainty,'njw_spectral_clustering')
            }
            else if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(active_uncertainty,'njw_spectral_clustering')
            }
            else if(active_data == 'cele'){
                //Render coarse graph for cele
                renderCoarseCele(active_uncertainty,'njw_spectral_clustering')

            }
            else if(active_data == 'email'){
                //Render coarse graph for email
                renderCoarseEmail(active_uncertainty,'njw_spectral_clustering')
            }
            else if(active_data == 'enron'){
                //Render coarse graph for email
                renderCoarseEnron(active_uncertainty,'njw_spectral_clustering')

            }
            else if(active_data == 'football'){
                //Render coarse graph for email
                renderCoarseFootball(active_uncertainty,'njw_spectral_clustering')

            }

            // Descriotion code for the cluster text. These needs to be called here in order for 
            // the description to pop up when the user switches datasets or algorithms. 
            // let k_description = d3.select("#cluster-text");

            // k_description
            //     .on("mouseover",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 1);
            //         d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");  
            //     })
            //     .on("mouseout",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 0);
            //     });


        }
        else if (target == 'spars'){
            // Remove color by 
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            // reset color to viridis 
            // changes active highlighting
            let color_kids = $('#nodeColorDrop').find('a')
            color_kids.removeClass( "active" );
            $(`#viridis`).addClass("active")

            // $(`#dropdownMenuButtonNodeColor`).addClass('disabled')

            if(active_data =='lesmis'){
                // changes active highlighting if it's a valid move
                let start_active = $('#algDrop').find('active');
                // console.log("active start",start_active)
                let kids = $('#algDrop').find('div')
                kids.removeClass( "active" );
                $(`#${target}`).addClass("active")

                // disables datasets without sparsification data
                // $(`#rectangle`).addClass('disabled')
                // $(`#cele`).addClass('disabled')
                // $(`#email`).addClass('disabled')

                //disable buttons that don't work with sparsification algo
                // uncertainty button
                $(`#dropdownMenuButtonUncertainty`).addClass('disabled')
                //node vis button
                $(`#dropdownMenuButtonNode`).addClass('disabled')

                // Hides minigraph and labels div
                d3.select('#graph-mini').style('visibility','hidden')
                d3.select('#heatmap-label').style('visibility','hidden')
                d3.select('#instances-label').style('visibility','hidden')
                d3.select('#mini-label').style('visibility','hidden')

                //Render sparse graph for lesmis
                renderSparsLesmis()

                // Need to insert this particular description code on alg drop, otherwise
                // it gets overwritten when there is just a k-clusters bar present.
                // let filter_description = d3.select("#filter-text");
                // let reduction_description = d3.select("#reduction-text");

                // filter_description
                //     .on("mouseover",function(){
                //         d3.select("#info-tooltip")
                //             .transition()
                //             .duration(200)
                //             .style("opacity", 1);
                //         d3.select("#info-tooltip").html("<p> Adjust bar to filter out edges.</p>"); 
                //     })
                //     .on("mouseout",function(){
                //         d3.select("#info-tooltip")
                //             .transition()
                //             .duration(200)
                //             .style("opacity", 0);
                //     });

                // reduction_description
                //     .on("mouseover",function(){
                //         d3.select("#info-tooltip")
                //             .transition()
                //             .duration(200)
                //             .style("opacity", 1);
                //         d3.select("#info-tooltip").html("<p> Adjust bar to view different reduction ratios.</p>");
                //     })
                //     .on("mouseout",function(){
                //         d3.select("#info-tooltip")
                //             .transition()
                //             .duration(200)
                //             .style("opacity", 0);
                //     });


            }
            else if (active_data == 'adj_rect'){
                // changes active highlighting if it's a valid move
                let start_active = $('#algDrop').find('active');
                // console.log("active start",start_active)
                let kids = $('#algDrop').find('div')
                kids.removeClass( "active" );
                $(`#${target}`).addClass("active")

                // disables datasets without sparsification data
                // $(`#rectangle`).addClass('disabled')
                // $(`#cele`).addClass('disabled')
                // $(`#email`).addClass('disabled')

                //disable buttons that don't work with sparsification algo
                // uncertainty button
                $(`#dropdownMenuButtonUncertainty`).addClass('disabled')
                //node vis button
                $(`#dropdownMenuButtonNode`).addClass('disabled')

                // Hides minigraph and labels div
                // d3.select('#graph-mini').style('visibility','hidden')
                d3.select('#heatmap-label').style('visibility','hidden')
                d3.select('#instances-label').style('visibility','hidden')
                d3.select('#mini-label').style('visibility','hidden')

                //Render sparse graph for adjusted rect
                // Highjacking the unif spars function here to viusalize spectral sparsification
                renderUnifSpars('adj_rec_100','spectral_sparsification')



            }
        }
        else if (target == 'spec_coarse'){
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            // Enables datasets with spectral coursening algorithm
            // $(`#rectangle`).removeClass('disabled')
            // $(`#cele`).removeClass('disabled')

            //re-enables buttons that didn't work with sparsification algo
            // uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')


            if (active_data == 'rectangle'){
                //Render spectral coarse graph for rect
                renderCoarseRect(active_uncertainty,'spectral_coarsening')
            }
            else if(active_data =='lesmis'){
                //Render spectral coarse graph for lesmis
                renderCoarseLesmis(active_uncertainty,'spectral_coarsening')
            }
            else if(active_data == 'cele'){
                //Render spectral coarse graph for cele
                renderCoarseCele(active_uncertainty,'spectral_coarsening')
            }
            else if(active_data == 'enron'){
                renderCoarseEnron(active_uncertainty,'spectral_coarsening')
            }

            // Description code for the cluster text. These needs to be called here in order for 
            // the description to pop up when the user switches datasets or algorithms. 
            // let k_description = d3.select("#cluster-text");

            // k_description
            //     .on("mouseover",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 1);
            //         d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
            //     })
            //     .on("mouseout",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 0);
            //     });

        }
        else if (target == 'unifying_framework_coarse'){
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            // Enables datasets with unifying framework algorithm
            // $(`#lesmis`).removeClass('disabled')
            
            // removes buttons without
            // $(`#cele`).addClass('disabled')
            // $(`#rectangle`).addClass('disabled')
            // $(`#email`).addClass('disabled')

            //re-enables buttons that didn't work with sparsification algo
            // uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph
            d3.select('#graph-mini').style('visibility','visible')
            // d3.select('.labels').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')


            if(active_data =='lesmis'){
                //Render unifying coarse graph for lesmis
                renderCoarseLesmis(active_uncertainty,'unifying_framework_coarsen')
            }

            // Description code for the cluster text. These needs to be called here in order for 
            // the description to pop up when the user switches datasets or algorithms. 
            // let k_description = d3.select("#cluster-text");

            // k_description
            //     .on("mouseover",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 1);
            //         d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>"); 
            //     })
            //     .on("mouseout",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 0);
            //     });

        }

        else if (target == 'unifying_framework_spars'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            // changes active highlighting
            let color_kids = $('#nodeColorDrop').find('a')
            color_kids.removeClass( "active" );
            $(`#viridis`).addClass("active")


            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            // console.log("active start",start_active)
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#${target}`).addClass("active")

            // Enables datasets with unifying framework algorithm
            // $(`#lesmis`).removeClass('disabled')
            // $(`#rectangle`).removeClass('disabled')
            
            // removes buttons without
            // $(`#cele`).addClass('disabled')
            // $(`#email`).addClass('disabled')

            //disable buttons that don't work with sparsification algo
            // uncertainty button
            $(`#dropdownMenuButtonUncertainty`).addClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).addClass('disabled')

            // Hides minigraph and labels div
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','hidden')
            d3.select('#instances-label').style('visibility','visible')
            d3.select('#mini-label').style('visibility','visible')

            if(active_data =='lesmis'){
                //Render spectral coarse graph for lesmis
                // renderUnifSpars('lesmis_77','unifying_framework_sparsify')
                alert("Error in data - coming soon")
            }
            else if(active_data =='rectangle'){
                //Render unifying spars graph for rectangle
                renderUnifSpars('rec_100','unifying_framework_sparsify')
            }
            else if(active_data =='adj_rect'){
                //Render unifying spars graph for rectangle
                renderUnifSpars('adj_rec_100','unifying_framework_sparsify')
            }
            // Description code for the cluster text. These needs to be called here in order for 
            // the description to pop up when the user switches datasets or algorithms. 
            // let k_description = d3.select("#cluster-text");

            // k_description
            //     .on("mouseover",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 1);
            //         d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");   
            //     })
            //     .on("mouseout",function(){
            //         d3.select("#info-tooltip")
            //             .transition()
            //             .duration(200)
            //             .style("opacity", 0);
            //     });

        }




    }


});


// Data dropdown logic
// Deals with detecting which option was selected and loading appropriate data into the vis.
$('#datasetDrop').on('hide.bs.dropdown', function (e) {
    // Finds active thing in the data drop down 
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id
        // console.log(target)

        //Removes infobox if still up
        d3.select(`#infobox-graph-orig`).transition()
            .duration(200)
            .style("opacity", 0);

        // Clear anything in the mini graph canvas
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        // removes bars
        // deletes k bar if one exists  
        d3.select(".active-kBar").remove();

        // deletes f bar if one exists  
        d3.select(".active-fBar").remove();

        // deletes q bar if one exists  
        d3.select(".active-qBar").remove();

        // Finds which algorithm is active 
        let active_alg = $('#algDrop').find('.active')[0].id;
        // console.log("active algorithm",active_alg);

        // Finds which uncertainty is active 
        let active_uncertainty = $('#uncertaintyDrop').find('.active')[0].id;
        // console.log("active uncertainty",active_uncertainty);
        
        // changes active highlighting
        let kids = $('#datasetDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        if (target == 'rectangle'){

            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')


            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).removeClass('disabled')
            $(`#unifying_framework_spars`).removeClass('disabled')
            $(`#gemsec`).addClass('disabled')
            renderCoarseRect(active_uncertainty,'njw_spectral_clustering')
        }
        else if (target == "adj_rect"){
            // highlights unif sparse
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#unifying_framework_spars`).addClass("active")
            $(`#unifying_framework_spars`).removeClass('disabled')

            //disables uncertainty buttons
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).addClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).addClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')


            $(`#spars`).removeClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).addClass('disabled')
            $(`#unifying_framework_spars`).removeClass('disabled')
            $(`#gemsec`).addClass('disabled')
            renderUnifSpars('adj_rec_100','unifying_framework_sparsify')

        }
        else if(target =='lesmis'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).removeClass("disabled")
            $(`#unifying_framework_coarse`).removeClass('disabled')
            $(`#spec_coarse`).removeClass('disabled')
            $(`#unifying_framework_spars`).removeClass('disabled')
            $(`#gemsec`).addClass('disabled')
            renderCoarseLesmis(active_uncertainty,'njw_spectral_clustering')
        }
        else if(target =='cele'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).removeClass('disabled')
            $(`#unifying_framework_spars`).addClass('disabled')
            $(`#gemsec`).addClass('disabled')
            renderCoarseCele(active_uncertainty,'njw_spectral_clustering')

        }
        else if(target =='email'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).addClass('disabled')
            $(`#unifying_framework_spars`).addClass('disabled')
            $(`#gemsec`).addClass('disabled')
            renderCoarseEmail(active_uncertainty,'njw_spectral_clustering')

        }
        else if(target =='tv'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            $(`#gemsec`).addClass("active")
            $(`#gemsec`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).addClass('disabled')
            $(`#unifying_framework_spars`).addClass('disabled')
            $(`#coarse`).addClass('disabled')
            renderGemsecTv(active_uncertainty,'gemsec')

        }
        else if(target =='enron'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            // $(`#gemsec`).addClass("disabled")
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).removeClass('disabled')
            $(`#unifying_framework_spars`).addClass('disabled')
            $(`#coarse`).addClass('active')
            renderCoarseEnron(active_uncertainty,'njw_spectral_clustering')

        }
        else if(target =='football'){
            // highlights coarse algorithm
            let kids = $('#algDrop').find('div')
            kids.removeClass( "active" );
            // $(`#gemsec`).addClass("disabled")
            $(`#coarse`).addClass("active")
            $(`#coarse`).removeClass('disabled')

            //Reenables uncertainty buttons
            //re-enables buttons that didn't work with sparsification algo
            //uncertainty button
            $(`#dropdownMenuButtonUncertainty`).removeClass('disabled')
            //node vis button
            $(`#dropdownMenuButtonNode`).removeClass('disabled')

            //Shows minigraph and labels
            d3.select('#graph-mini').style('visibility','visible')
            d3.select('#heatmap-label').style('visibility','visible')
            d3.select('#instances-label').style('visibility','hidden')
            d3.select('#mini-label').style('visibility','visible')

            $(`#spars`).addClass('disabled')
            $(`#unifying_framework_coarse`).addClass('disabled')
            $(`#spec_coarse`).addClass('disabled')
            $(`#unifying_framework_spars`).addClass('disabled')
            $(`#coarse`).addClass('active')
            renderCoarseFootball(active_uncertainty,'njw_spectral_clustering')

        }
    }

})


// Invert button dropdown logic
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

        //Redraws. prepGraph contains logic which detects which invert option is active then 
        // scales the data appropriately. 
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        // Feeding in graph data like this speeds things up really well!
        full_rect.myGraph.graphData(full_rect.data)
        proc_rect.myGraph.graphData(proc_rect.data)
    }

})


// Color schemes
// let viridis = d3.interpolateViridis
// let inferno = d3.interpolateInferno
// let plasma =  d3.interpolatePlasma
// let cool = d3.interpolateCool
// let warm = d3.interpolateWarm

// let green =  d3.interpolateGreens
// let purple = d3.interpolatePurples
// let orange = d3.interpolateOranges
// let grey = d3.interpolateGreys
// let blue = d3.interpolateBlues
// let prgr = d3.interpolatePRGn

// let pinkblue = d3.interpolate("#ff3aa6", "#30ffe3")
// let greenorange = d3.interpolate('#a6ff3a','#ff5d30')

// label logic
$('#labelDrop').on('hide.bs.dropdown', function (e) {
    // console.log(e)
    let drop_color = null;
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id;
        // console.log('target',target)
        drop_color = target;

        // changes active highlighting
        let kids = $('#labelDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        // Sets color to selected
        if (target == 'label_off'){
            proc_rect.show_labels = false;
            // full_rect.color_by_group = false;
        }
        else if (target == 'label_on'){
            proc_rect.show_labels = true;
        }       
    }
        
    // redraw with labels
    // full_rect.drawGraph(proc_rect)
    proc_rect.drawGraph(full_rect)
})



// Color button dropdown logic
$('#nodeColorDrop').on('hide.bs.dropdown', function (e) {
    // console.log(e)
    let drop_color = null;
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id;
        // console.log('target',target)
        drop_color = target;

        // changes active highlighting
        let kids = $('#nodeColorDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        // Sets color to selected
        if (target == 'cool'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolateCool;
            heatMap.node_Color = d3.interpolateCool;
        }
        else if (target == 'viridis'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolateViridis;
            heatMap.node_Color = d3.interpolateViridis;
        }
        else if (target == 'plasma'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolatePlasma;
            heatMap.node_Color = d3.interpolatePlasma;
        }
        else if (target == 'warm'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolateWarm;
            heatMap.node_Color = d3.interpolateWarm;
        }
        else if (target == 'inferno'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolateInferno;
            heatMap.node_Color = d3.interpolateInferno;
        }
        else if (target == 'blues'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolate("#CEDDF2", "rgb(40, 85, 148)");
            heatMap.node_Color = d3.interpolate("#CEDDF2", "rgb(40, 85, 148)");
        }
        else if (target == 'purple-green'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolatePRGn;
            heatMap.node_Color = d3.interpolatePRGn;
        }
        else if (target == 'pink-blue'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolate("#ff3aa6", "#30ffe3");
            heatMap.node_Color = d3.interpolate("#ff3aa6", "#30ffe3");
        }
        else if (target == 'green-orange'){
            proc_rect.color_by_group = false;
            full_rect.color_by_group = false;
            proc_rect.node_Color = d3.interpolate('#a6ff3a','#ff5d30');
            heatMap.node_Color = d3.interpolate('#a6ff3a','#ff5d30');
        }
        else if(target == 'group'){
            // but need to indicate that the group option was selected
            proc_rect.color_by_group = true;
            full_rect.color_by_group = true;
            // Still set these colors for the default view 
            proc_rect.node_Color = d3.interpolateViridis;;
            heatMap.node_Color = d3.interpolateViridis;
            // full_rect.prepGraph(proc_rect);
            // proc_rect.prepGraph(full_rect);
            // heatMap.removeHeatMap()
            // heatMap.createHeatMap()
            // Feeding in graph data like this speeds things up really well!
            // full_rect.myGraph.graphData(full_rect.data)
            // proc_rect.myGraph.graphData(proc_rect.data)
            // Draw graph
            // full_rect.drawGraph(proc_rect);
            // proc_rect.drawGraph(full_rect);

        }
        
        

        //Redraws. prepGraph contains logic which detects which invert option is active then 
        // scales the data appropriately.

        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);
        // Clear instance
        // heatmap initializing data
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)
        heatMap.removeHeatMap()
        heatMap.createHeatMap()

        // Feeding in graph data like this speeds things up really well!
        // full_rect.myGraph.graphData(full_rect.data)
        // proc_rect.myGraph.graphData(proc_rect.data)
        full_rect.drawGraph(proc_rect)
        proc_rect.drawGraph(full_rect)
    }

})

$('#edgeColorDrop').on('hide.bs.dropdown', function (e) {
    // console.log(e)
    let drop_color = null;
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id;
        // console.log('target',target)
        drop_color = target;

        // changes active highlighting
        let kids = $('#edgeColorDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")
        if (target == 'grey_'){
            proc_rect.link_Color = d3.interpolate("#c9c9c9", "#666666");
            heatMap.link_Color = d3.interpolate("##c9c9c9", "#666666");
        }
        if (target == 'cool_'){
            proc_rect.link_Color = d3.interpolateCool;
            heatMap.link_Color = d3.interpolateCool;
        }
        else if (target == 'viridis_'){
            proc_rect.link_Color = d3.interpolateViridis;
            heatMap.link_Color = d3.interpolateViridis;
        }
        else if (target == 'plasma_'){
            proc_rect.link_Color = d3.interpolatePlasma;
            heatMap.link_Color = d3.interpolatePlasma;
        }
        else if (target == 'warm_'){
            proc_rect.link_Color = d3.interpolateWarm;
            heatMap.link_Color = d3.interpolateWarm;
        }
        else if (target == 'inferno_'){
            proc_rect.link_Color = d3.interpolateInferno;
            heatMap.link_Color = d3.interpolateInferno;
        }
        else if (target == 'purple-green_'){
            proc_rect.link_Color = d3.interpolatePRGn;
            heatMap.link_Color = d3.interpolatePRGn;
        }
        
        else if (target == 'pink-blue_'){
            proc_rect.link_Color = d3.interpolate("#ff3aa6", "#30ffe3")
            heatMap.link_Color = d3.interpolate("#ff3aa6", "#30ffe3");
        }
        else if (target == 'green-orange_'){
            proc_rect.link_Color = d3.interpolate('#a6ff3a','#ff5d30')
            heatMap.link_Color = d3.interpolate('#a6ff3a','#ff5d30');
        }

        //Redraws. prepGraph contains logic which detects which invert option is active then 
        // scales the data appropriately. 
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);
        heatMap.removeHeatMap()
        heatMap.createHeatMap()

        // Feeding in graph data like this speeds things up really well!
        full_rect.myGraph.graphData(full_rect.data)
        proc_rect.myGraph.graphData(proc_rect.data)
    }

})

$('#stdColorDrop').on('hide.bs.dropdown', function (e) {
    // console.log(e)
    let drop_color = null;
    let targetClass = null;
    if (e.clickEvent){
        targetClass = $(e.clickEvent.target).attr('class')
    }
    if (targetClass == 'dropdown-item'){
        let target = e.clickEvent.target.id;
        // console.log('target',target)
        drop_color = target;

        // changes active highlighting
        let kids = $('#stdColorDrop').find('a')
        kids.removeClass( "active" );
        $(`#${target}`).addClass("active")

        if (target == 'orange'){
            proc_rect.std_Color = '#ff920c';
        }
        else if (target == 'red'){
            proc_rect.std_Color = 'red';
        }
        else if (target == 'blue'){
            proc_rect.std_Color = '#5350ff'
        }
        else if (target == 'green'){
            proc_rect.std_Color = '#219117'
        }
        else if (target == 'purple'){
            proc_rect.std_Color = '#8055a1'
        }
        else if (target == 'pink'){
            proc_rect.std_Color = '#e34bde'
        }
        else if (target == 'gold'){
            proc_rect.std_Color = '#e6ce18'
        }
        else if (target == 'black'){
            proc_rect.std_Color = 'black'
        }

        //Redraws. prepGraph contains logic which detects which invert option is active then 
        // scales the data appropriately. 
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        // Feeding in graph data like this speeds things up really well!
        full_rect.myGraph.graphData(full_rect.data)
        proc_rect.myGraph.graphData(proc_rect.data)
    }

})


//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////   RENDERING FUNCTIONS   //////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////
this.mutual_information_node_scale = [0, 43];
this.mutual_information_link_scale = [0, 375];
let that = this;

/////////////////////// NJW SPECTRAL CLUSTERING RENDERING FUNCTIONS //////////////////////////////////////

function renderCoarseRect(uncert,file){
    // Type of uncertainty
    this.uncert = uncert;

    // console.log("my file",file)
    // console.log("type of uncertainty",this.uncert)

    //Sets default k
    this.k = 2
    let range = [2,12]
    let that = this;

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-rect');

    // co_occurence is very different from the rest
    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)
        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-rect').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            populateStuff(new_k,new_q,uncert,file)

        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/rec_100/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph
                d3.json(`data/${file}/rec_100/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                instance_graph = new Graph(null,'graph-mini','instance');
                // heatMap.myGraph.graphData(iInstances);
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                proc_rect.nodeScale = [0, 50]
                proc_rect.linkScale = [0, 6]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.8);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                full_rect.myGraph
                    .linkVisibility(true);
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;
                
            })

        }

    }
    else{

        // Loads data - this is the default view upon loading, which I've chosen to be 2 clusters
        Promise.all([
            //reduced
            d3.json(`data/${file}/rec_100/cluster_${2}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/rec_100/cluster_${2}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/rec_100/cluster_${2}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            proc_rect.type = 'clust'
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                proc_rect.nodeScale = [-0.005664816285412998, 0.5]
                proc_rect.linkScale = [0.3411491395477371, 100]
            }
            
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Handles appropriate zooming on loading
            proc_rect.myGraph
                .zoom(2.8);
            full_rect.myGraph
                .zoom(0.8);
            
            // Ensures links are visibile.
            full_rect.myGraph
                .linkVisibility(true);

            // Draws the graphs
            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initial data and initialization
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.active_alg = file;
            heatMap.data_name = 'rec_100';
            heatMap.uncert = uncert;
            heatMap.k = this.k;
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;


        })

        // detects change on k-bar and updates data shown accordingly
        d3.select('#coarse-rect').on('input', function(d){
            let k = k_Bar.activeK;
            //  console.log('in script',that.k)
                    
            // Loads data based on parameters 
            Promise.all([
                //reduced
                d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/rec_100/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                proc_rect.data = files[0];
                full_rect.data = files[1];

                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.8);

                // Hides the minigraph because new data has been loaded
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                // Updates heatmap class details
                heatMap.removeHeatMap()
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()

                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;
                
                // Recalculates scales and such for new data passed in
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);

                // Feeding in graph data like this speeds things up really well!
                full_rect.myGraph.graphData(full_rect.data)
                proc_rect.myGraph.graphData(proc_rect.data)

            })

        })

    }
}

function renderCoarseLesmis(uncert,file){

    // Type of coarsening uncertainty vis
    this.uncert=uncert;

    // Loads lesmis data set
    //Sets default k
    this.k = 9
    let range = [6,16]
    let that = this;

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-mis');

    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)

        // Creating filter bar
        //Sets default filter
        this.f = 0
        let f_range = [0,1]

        //Creates f bar
        let f_Bar = new fBar(this.f,f_range,'mis-filter');

        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-mis').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            populateStuff(new_k,new_q,uncert,file)

        })

        // FILTER BAR FUNCTIONALITY
        // Detects changes and messes with graph edge visibility
        d3.select('#mis-filter').on('input', function(d){
            that.f = f_Bar.activeF
            // console.log(that.f)

            let threshold = full_rect.linkRange[1]*that.f;
            // console.log(threshold)
            full_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.weight) >= threshold) ? true : false )


        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/lesmis_77/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/lesmis_77/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/lesmis_77/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph 
                // d3.json(`data/${file}/lesmis_77/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
                // Instead, I'm loading a - star data
                d3.json(`data/${file}/lesmis_77/cluster_${k}/${uncert}/a_star_graph.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
                // need to rename edges to links here too
                ori['links'] = ori['edges']
                // console.log(ori)
                // console.log(qGraph)
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                // instance_graph = new Graph(null,'graph-mini','instance');
                
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                full_rect.type = 'a-star' // setting type to a-star so it constructs the a star graph
                // proc_rect.nodeScale = [0, 38]
                proc_rect.nodeScale = [0, 15]
                proc_rect.linkScale = [0, 4]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.8);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                full_rect.myGraph
                    .linkVisibility(true);
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;

                // Reset type of full rect to orig - hacky fix
                full_rect.type = 'orig';
                
            })

        }

    }
    else{
        // Loads the data - I chose the default view here to have 9 clusters
        Promise.all([
            //reduced
            d3.json(`data/${file}/lesmis_77/cluster_${9}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/lesmis_77/cluster_${9}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/lesmis_77/cluster_${9}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            // Loads the data into the graph class
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Handling this graph's parameters
            proc_rect.type = 'clust'
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                proc_rect.nodeScale = [-0.009660296956141888, 0.5345581749927919];
                proc_rect.linkScale = [0.010101010101010102, 73.0909090909091];
            }

            full_rect.myGraph
                .linkVisibility(true);
            proc_rect.myGraph
                .zoom(2.7);
            full_rect.myGraph
                .zoom(0.8);

            // Recalculates scales and such for new data passed in
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Draws the graph
            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initializing data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.data_name = 'lesmis_77';
            heatMap.active_alg = file;
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
                d3.json(`data/${file}/lesmis_77/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/lesmis_77/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/lesmis_77/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                // Loads the data
                proc_rect.data = files[0];
                full_rect.data = files[1];

                // handling the zooming of this new data 
                proc_rect.myGraph
                    .zoom(2.7);
                full_rect.myGraph
                    .zoom(0.8);

                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                heatMap.removeHeatMap()
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.data_name = 'lesmis_77';
                heatMap.active_alg = file;
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
}

function renderCoarseCele(uncert,file){
    // Loads c-elegans data set

    // Type of uncertainty
    this.uncert = uncert;

    //Sets default k
    this.k = 10
    let range = [8,16]
    let that = this;


    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-cele');
    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)
        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // Creating filter bar
        //Sets default filter
        this.f = 0
        let f_range = [0,1]

        //Creates f bar
        let f_Bar = new fBar(this.f,f_range,'cele-filter');

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-cele').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            populateStuff(new_k,new_q,uncert,file)

        })

        // FILTER BAR FUNCTIONALITY
        // Detects changes and messes with graph edge visibility
        d3.select('#cele-filter').on('input', function(d){
            that.f = f_Bar.activeF
            // console.log(that.f)

            let threshold = full_rect.linkRange[1]*that.f;
            // console.log(threshold)
            full_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.weight) >= threshold) ? true : false )


        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/celegans_453/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // // Also need to load a representative original graph
                // d3.json(`data/${file}/celegans_453/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
                // Instead, I'm loading a - star data
                d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/a_star_graph.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
                // need to rename edges to links here too
                ori['links'] = ori['edges']
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                instance_graph = new Graph(null,'graph-mini','instance');
                // heatMap.myGraph.graphData(iInstances);
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                full_rect.type = 'a-star'
                proc_rect.nodeScale = [0.9, 107]
                proc_rect.linkScale = [0, 22]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.35);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                full_rect.myGraph
                    .linkVisibility(true);
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;

                // Reset type of full rect to orig - hacky fix
                full_rect.type = 'orig';
                
            })

        }

    }
    else{
        Promise.all([
            //reduced
            d3.json(`data/${file}/celegans_453/cluster_${10}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/celegans_453/cluster_${10}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/celegans_453/cluster_${10}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Recalculates scales and such for new data passed in and handles graph parameters
            proc_rect.type = 'clust';
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                proc_rect.nodeScale = [-0.001195036474254751, 0.3845227170550737];
                proc_rect.linkScale = [0.43434343434343436, 347.45454545454544];
            }
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            proc_rect.myGraph
                .zoom(3);
            full_rect.myGraph
                .zoom(0.35);
            
            full_rect.myGraph
                .linkVisibility(true);

            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initializing data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.active_alg = file;
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
                d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/celegans_453/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                proc_rect.data = files[0];
                full_rect.data = files[1];

                proc_rect.myGraph
                    .zoom(3);
                full_rect.myGraph
                    .zoom(0.35);

                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                heatMap.removeHeatMap()
                heatMap.unif_spars = false;
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.active_alg = file;
                heatMap.data_name = 'celegans_453';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                
                // Recalculates scales and such for new data passed in
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

}

function renderCoarseEmail(uncert,file){

    // Type of uncertainty
    this.uncert = uncert;
    // console.log("my file",file)

    // console.log("type of uncertainty",this.uncert)

    //Sets default k
    this.k = 20
    let range = [20,50]
    let that = this;

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-email');
    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)
        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-email').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            let email_vals = [20,30,32,34,36,38,40,41,42,43,44,50];
            if (email_vals.includes(parseInt(new_k))){
                populateStuff(new_k,new_q,uncert,file)
            }
            
            

        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/email_1005/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/email_1005/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/email_1005/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph
                d3.json(`data/${file}/email_1005/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                instance_graph = new Graph(null,'graph-mini','instance');
                // heatMap.myGraph.graphData(iInstances);
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                proc_rect.nodeScale = [0, 88]
                proc_rect.linkScale = [0, 36]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                // This graph is large, so I fiddle with some of the graph rendering parameters to optimize performance.
                full_rect.myGraph
                    // .d3AlphaDecay(0)
                    // .d3VelocityDecay(0.08)
                    // .nodeRelSize(6)
                    .cooldownTime(6000)
                    // .linkColor(() => 'rgba(0,0,0,0.05)')
                    .linkVisibility(false)
                    // This only renders the links after the physics engine stops.
                    .onEngineStop(() => full_rect.myGraph.linkVisibility(true))
                    // .onNodeHover( (d,i) => console.log(d) )
                    .zoom(0.1);
                    // .enablePointerInteraction(false);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;
                
            })

        }

    }
    else{
        // Initial k is 20
        Promise.all([
            //reduced
            d3.json(`data/${file}/email_1005/cluster_${20}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/email_1005/cluster_${20}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/email_1005/cluster_${20}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            proc_rect.type = 'clust';
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                proc_rect.nodeScale = [-0.0006845867347048577, 0.12624419648766752];
                proc_rect.linkScale = [0.09090909090909091, 375.8484848484849];
            }
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            proc_rect.myGraph
                .zoom(2.5);

            // This graph is large, so I fiddle with some of the graph rendering parameters to optimize performance.
            full_rect.myGraph
                // .d3AlphaDecay(0)
                // .d3VelocityDecay(0.08)
                // .nodeRelSize(6)
                .cooldownTime(6000)
                // .linkColor(() => 'rgba(0,0,0,0.05)')
                .linkVisibility(false)
                // This only renders the links after the physics engine stops.
                .onEngineStop(() => full_rect.myGraph.linkVisibility(true))
                // .onNodeHover( (d,i) => console.log(d) )
                .zoom(0.1);
                // .enablePointerInteraction(false);
            
            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initial data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.data_name = 'email_1005';
            heatMap.active_alg = file;
            heatMap.uncert = uncert;
            heatMap.k = this.k;
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;

        })

        

        // detects change on bar and updates data shown accordingly
        d3.select('#coarse-email').on('input', function(d){
            let k = k_Bar.activeK;
            //  console.log('in script',that.k)

            // There are oddly spaced values in this dataset, so a continues slider bar doesn't work.
            // My solutions involves creating this array of the actual data values, and only calling the 
            // code if these values are touched on in the slider bar. 
            let email_vals = [20,30,40,41,42,43,44,50];
            if (email_vals.includes(parseInt(k))){
                    
            // Loads data based on parameters 
            Promise.all([
                //reduced
                d3.json(`data/${file}/email_1005/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/email_1005/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/email_1005/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                proc_rect.data = files[0];
                full_rect.data = files[1];

                proc_rect.myGraph
                    .zoom(2.5);
                full_rect.myGraph
                    .zoom(0.1);

                // This graph is large, so I fiddle with some of the graph rendering parameters to optimize performance.
                full_rect.myGraph
                    // .d3AlphaDecay(0)
                    // .d3VelocityDecay(0.08)
                    // .nodeRelSize(6)
                    .cooldownTime(6000)
                    // .linkColor(() => 'rgba(0,0,0,0.05)')
                    .linkVisibility(false)
                    .onEngineStop(() => full_rect.myGraph.linkVisibility(true))
                    // .onNodeHover( (d,i) => console.log(d) )
                    .zoom(0.1);
                    // .enablePointerInteraction(false);

                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                heatMap.removeHeatMap()
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.data_name = 'email_1005';
                heatMap.active_alg = file;
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
        }

        })
    }
}

function renderCoarseEnron(uncert,file){

    // Type of coarsening uncertainty vis
    this.uncert=uncert;

    // Loads enron
    //Sets default k
    this.k = 8
    let range = [8,20]
    let that = this;

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-enron');

    // No co-occurence for this one, so I removed it, if I need it back,
    // copy and past and instert below this comment
    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)

        // Creating filter bar
        //Sets default filter
        this.f = 0
        let f_range = [0,1]

        //Creates f bar
        let f_Bar = new fBar(this.f,f_range,'enron-filter');

        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-enron').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            populateStuff(new_k,new_q,uncert,file)

        })

        // FILTER BAR FUNCTIONALITY
        // Detects changes and messes with graph edge visibility
        d3.select('#enron-filter').on('input', function(d){
            that.f = f_Bar.activeF
            // console.log(that.f)

            let threshold = full_rect.linkRange[1]*that.f;
            // console.log(threshold)
            full_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.weight) >= threshold) ? true : false )


        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/enron_148/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph 
                // d3.json(`data/${file}/enron_148/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
                // Instead, I'm loading a - star data
                d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/a_star_graph.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
                // need to rename edges to links here too
                ori['links'] = ori['edges']
                // console.log(ori)
                // console.log(qGraph)
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                // instance_graph = new Graph(null,'graph-mini','instance');
                
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                full_rect.type = 'a-star' // setting type to a-star so it constructs the a star graph
                // proc_rect.nodeScale = [0, 38]
                proc_rect.nodeScale = [0, 15]
                proc_rect.linkScale = [0, 4]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.8);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                full_rect.myGraph
                    .linkVisibility(true);
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;

                // Reset type of full rect to orig - hacky fix
                full_rect.type = 'orig';
                
            })

        }

    }
    else{
        // Loads the data - I chose the default view here to have 9 clusters
        Promise.all([
            //reduced
            d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/enron_148/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            // Loads the data into the graph class
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Handling this graph's parameters
            proc_rect.type = 'clust'
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                // RUNNING NODE MAX AND MIN 0.6071195070307225 -0.00485521522699129
                //  RUNNING LINK MAX AND MIN 1093.3535353535353 0.26262626262626265
                proc_rect.nodeScale = [-0.00485521522699129,0.6071195070307225];
                proc_rect.linkScale = [0.26262626262626265, 1093.3535353535353];
            }

            full_rect.myGraph
                .linkVisibility(true);
            proc_rect.myGraph
                .zoom(2.7);
            full_rect.myGraph
                .zoom(0.8);

            // Recalculates scales and such for new data passed in
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Draws the graph
            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initializing data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.data_name = 'enron_148';
            heatMap.active_alg = file;
            heatMap.uncert = uncert;
            heatMap.k = k;
            heatMap.removeHeatMap()
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;


        })

        // detects change on bar and updates data shown accordingly
        d3.select('#coarse-enron').on('input', function(d){
            let k = k_Bar.activeK;
            //  console.log('in script',that.k)
                    
            // Loads data based on parameters 
            Promise.all([
                //reduced
                d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/enron_148/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/enron_148/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                // Loads the data
                proc_rect.data = files[0];
                full_rect.data = files[1];

                // handling the zooming of this new data 
                proc_rect.myGraph
                    .zoom(2.7);
                full_rect.myGraph
                    .zoom(0.8);

                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                heatMap.removeHeatMap()
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.data_name = 'enron_148';
                heatMap.active_alg = file;
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
    
}

function renderCoarseFootball(uncert,file){

    // Type of coarsening uncertainty vis
    this.uncert=uncert;

    // Loads enron
    //Sets default k
    this.k = 8
    let range = [8,20]
    let that = this;

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-football');

    // No co-occurence for this one, so I removed it, if I need it back,
    // copy and past and instert below this comment
    if (uncert == 'co_occurrence'){

        let k = k_Bar.activeK;
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)

        // Creating filter bar
        //Sets default filter
        this.f = 0
        let f_range = [0,1]

        //Creates f bar
        let f_Bar = new fBar(this.f,f_range,'football-filter');

        this.q = 0;
        qRange = [0,99]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(k,q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            let new_k = k_Bar.activeK;
            populateStuff(new_k,new_q,uncert,file)

        });

        //detects changes on k bar and changes files accordingly 
        d3.select('#coarse-football').on('input', function(d){
            let new_k = k_Bar.activeK;
            let new_q = q_Bar.active;
            populateStuff(new_k,new_q,uncert,file)

        })

        // FILTER BAR FUNCTIONALITY
        // Detects changes and messes with graph edge visibility
        d3.select('#football-filter').on('input', function(d){
            that.f = f_Bar.activeF
            // console.log(that.f)

            let threshold = full_rect.linkRange[1]*that.f;
            // console.log(threshold)
            full_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.weight) >= threshold) ? true : false )


        })
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(k,q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/football_115/cluster_${k}/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph 
                // d3.json(`data/${file}/football_115/cluster_${k}/local_adjusted_rand_index/ori_graph_with_cluster.json`)
                // Instead, I'm loading a - star data
                d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/a_star_graph.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
                // need to rename edges to links here too
                ori['links'] = ori['edges']
                // console.log(ori)
                // console.log(qGraph)
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                // instance_graph = new Graph(null,'graph-mini','instance');
                
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                full_rect.type = 'a-star' // setting type to a-star so it constructs the a star graph
                // proc_rect.nodeScale = [0, 38]
                proc_rect.nodeScale = [0, 15]
                proc_rect.linkScale = [0, 4]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                full_rect.myGraph
                    .zoom(0.8);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                full_rect.myGraph
                    .linkVisibility(true);
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100'; // Maybe I need to change this?
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;

                // Reset type of full rect to orig - hacky fix
                full_rect.type = 'orig';
                
            })

        }

    }
    else{
        // Loads the data - I chose the default view here to have 9 clusters
        Promise.all([
            //reduced
            d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/football_115/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            // Loads the data into the graph class
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Handling this graph's parameters
            proc_rect.type = 'clust'
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{
                // RUNNING NODE MAX AND MIN 0.30256182745293475 -0.004258117355327653
                // RUNNING LINK MAX AND MIN 64 0.30303030303030304
                proc_rect.nodeScale = [-0.0045,0.4];
                proc_rect.linkScale = [0.3, 65];
            }

            full_rect.myGraph
                .linkVisibility(true);
            proc_rect.myGraph
                .zoom(2.7);
            full_rect.myGraph
                .zoom(0.8);

            // Recalculates scales and such for new data passed in
            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            // Draws the graph
            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initializing data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.data_name = 'football_115';
            heatMap.active_alg = file;
            heatMap.uncert = uncert;
            heatMap.k = k;
            heatMap.removeHeatMap()
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;


        })

        // detects change on bar and updates data shown accordingly
        d3.select('#coarse-football').on('input', function(d){
            let k = k_Bar.activeK;
            //  console.log('in script',that.k)
                    
            // Loads data based on parameters 
            Promise.all([
                //reduced
                d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/uncertainty_graph.json`),
                //original
                d3.json(`data/${file}/football_115/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
                // uncertainty matrix
                d3.csv(`data/${file}/football_115/cluster_${k}/${uncert}/uncertain_mat.csv`)

            ]).then(function(files){
                // Loads the data
                proc_rect.data = files[0];
                full_rect.data = files[1];

                // handling the zooming of this new data 
                proc_rect.myGraph
                    .zoom(2.7);
                full_rect.myGraph
                    .zoom(0.8);

                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)

                heatMap.removeHeatMap()
                heatMap.data = files[2];
                heatMap.unif_spars = false;
                heatMap.coOccur = false;
                heatMap.data_name = 'football_115';
                heatMap.active_alg = file;
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


    //Creates k bar
    let k_Bar = new kBar(this.k,range,'spars-mis');


    //Creates f bar
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
        
        // Recalculates scales and such for new data passed in
        proc_rect.type = 'spars';
        proc_rect.linkScale = [0,33];

        full_rect.myGraph
            .linkVisibility(true);

        full_rect.prepGraph();
        proc_rect.prepGraph();

        proc_rect.myGraph
            .zoom(0.8);
        full_rect.myGraph
            .zoom(0.8);

        full_rect.drawGraph();
        proc_rect.drawGraph();

        proc_rect.myGraph.nodeRelSize(4);

        heatMap.removeHeatMap()

    })


    // FILTER BAR FUNCTIONALITY
    // Detects changes and messes with graph edge visibility
    d3.select('#spars-mis-f').on('input', function(d){
        that.f = f_Bar.activeF
        // console.log(that.f)

        let threshold = proc_rect.linkRange[1]*that.f;
        // console.log(threshold)
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

            proc_rect.myGraph
                .zoom(0.8);
            full_rect.myGraph
                .zoom(0.8);

            // Feeding in graph data like this speeds things up really well!
            proc_rect.myGraph.graphData(proc_rect.data)

        })

    })


}
    
//////////////// UNIFYING FRAMEWORK SPARSIFICATION /////////////////////

function renderUnifSpars(data_name,file){

    this.data_name = data_name;
    this.file = file;

    //Sets default k
    let range = null;
    // The lesmis and the rect datasets have different ranges.
    if (data_name == 'lesmis_77'){
        range = [0.7,0.9]
    }
    // Adjusted rect 
    else{
        // For unif spars
        if (file == "unifying_framework_sparsify"){
            range = [0.6,0.9]
        }
        // for spectral spars
        else{
            range = [0.1,0.9]
        }
        
    }
    // console.log(range)
    let that = this;
    this.k = range[0];

    //Sets default filter
    this.f = 0
    let f_range = [0,1]

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'unif-spars');


    //Creates f bar
    let f_Bar = new fBar(this.f,f_range,'spars-mis-f');

    // Can choose any data for full graph, there's no linked views with this.
    // full_rect.data = full_mis_9;
    // Loads data based on parameters 
    Promise.all([
        //reduced
        d3.json(`data/${file}/${data_name}/${data_name}_${range[0]}/sparsified_uncertainty_graph_${range[0]}.json`),
        //original
        d3.json(`data/rec_100/original_10.json`),
        // selection skeleton for individual instances
        d3.csv(`data/unifying_framework_sparsify/rec_100/uncertain_mat.csv`)

    ]).then(function(files){
        proc_rect.data = files[0];
        full_rect.data = files[1];
        
        // Recalculates scales and such for new data passed in
        // For some reason completely bewildering to me, this prepgraph needs to be here or things break??
        proc_rect.prepGraph();
        proc_rect.type = 'spars';
        // Link scale for rect 
        proc_rect.linkScale = [0.3411491395477371, 2.6663668831664267]

        full_rect.prepGraph();
        proc_rect.prepGraph();

        full_rect.drawGraph();
        proc_rect.drawGraph();

        proc_rect.myGraph
            .zoom(0.8);
        full_rect.myGraph
            .zoom(0.8);

        full_rect.myGraph
            .linkVisibility(true);

        proc_rect.myGraph.nodeRelSize(2);

        // heatmap initial data
        heatMap.myGraph.nodeVisibility(false);
        heatMap.myGraph.linkVisibility(false);

        heatMap.removeHeatMap();
        heatMap.unif_spars = true;
        heatMap.coOccur = false;
        heatMap.data = files[2];
        heatMap.data_name = data_name;
        heatMap.active_alg = file;
        heatMap.uncert = uncert;
        heatMap.k = k;
        heatMap.createHeatMap()
        // Pass references to heatmap as well
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;

    })


    // FILTER BAR FUNCTIONALITY
    // Detects changes and messes with graph edge visibility
    d3.select('#spars-mis-f').on('input', function(d){
        that.f = f_Bar.activeF
        // console.log(that.f)

        let threshold = proc_rect.linkRange[1]*that.f;
        // console.log(threshold)
        proc_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.mean) >= threshold) ? true : false )


    })

    // detects change on bar and updates data shown accordingly
    d3.select('#unif-spars').on('input', function(d){
        let k = k_Bar.activeK;
        //  console.log('in script',k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
        d3.json(`data/${file}/${data_name}/${data_name}_${k}/sparsified_uncertainty_graph_${k}.json`),
        //original
        d3.json(`data/rec_100/original_10.json`),
        // selection skeleton for individual instances
        d3.csv(`data/unifying_framework_sparsify/rec_100/uncertain_mat.csv`)

        ]).then(function(files){
            proc_rect.data = files[0];
            
            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            proc_rect.prepGraph();
            
            proc_rect.myGraph
                .zoom(0.8);
            full_rect.myGraph
                .zoom(0.8);
            // Feeding in graph data like this speeds things up really well!
            proc_rect.myGraph.graphData(proc_rect.data)

            // heatmap initial data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.unif_spars = true;
            heatMap.coOccur = false;
            heatMap.data = files[2];
            heatMap.data_name = data_name;
            heatMap.active_alg = file;
            heatMap.uncert = uncert;
            heatMap.k = k;
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;

        })
    })
}



////////////////////////////// GEMSEC RENDERING ///////////////////////////////////////
function renderGemsecTv(uncert,file){

    // Type of uncertainty
    this.uncert = uncert;

    // Loads gemsec dataset
    //Sets default k - no default k for gemsec, only 20 clusters
    // this.k = 10
    // let range = [10,14]
    let that = this;


    //Creates k bar - no kbar for gemsec 
    // let k_Bar = new kBar(this.k,range,'coarse-cele');
    if (uncert == 'co_occurrence'){

        
        // console.log(`data/${file}/rec_100/cluster_${2}/${uncert}/Q_graph/Q_graph_${0}.json`)
        this.q = 0;
        qRange = [0,19]
        // create q bar
        let q_Bar = new qBar(this.q,qRange,'qBar');
        let q = q_Bar.active;

        // default view
        populateStuff(q,uncert,file)

        // detects change on qBar and changes files accordingly
        d3.select('#qBar').on('mouseup', function(d){
            let new_q = q_Bar.active;
            populateStuff(new_q,uncert,file)



        });
        
        // Things I need to display:
        // 1. graph with weight as circle radius and stability as color, edges weight as thickness, instability as color
        // 2. heatmap area as a selection tool for individual instances --> no, lets just make this a slider bar?
        // 3. matrix in the mini-graph section -> can put this in heatmap area if I use a slider bar

        // Default view - 2 clusters and first instance
        function populateStuff(q,uncert,file){
            Promise.all([
                // Q_graph
                d3.json(`data/${file}/tvshow_3892/cluster_20/${uncert}/Q_graph/Q_graph_${q}.json`),
                // individual instances
                d3.json(`data/${file}/tvshow_3892/cluster_20/${uncert}/individual_instances/clustered_graph_${q}.json`),
                // Q_matrix
                d3.csv(`data/${file}/tvshow_3892/cluster_20/${uncert}/Q_matrix/Q_mat_${q}.csv`),
                // Also need to load a representative original graph
                d3.json(`data/${file}/tvshow_3892/cluster_20/local_adjusted_rand_index/ori_graph_with_cluster.json`)
    
            ]).then(function(files){
    
                // Need to combine individual instance and q graph data
                let qGraph = files[0];
                // need to rename edges to links
                qGraph['links'] = qGraph['edges'];
                let iInstances = files[1];
                // need to rename edges to links
                iInstances['links'] = iInstances['edges']
                let qMat = files[2];
                let ori = files[3];
    
                // console.log("q graph",qGraph)
                // console.log("iInstances",iInstances)
                // console.log("qMat",qMat)
                // console.log("representative original graph",ori)
    
                // Display Q graph
    
                // Initialize graphs with new data
                proc_rect.data = qGraph;
                full_rect.data = ori;
                // console.log(iInstances)
    
                // Maybe just make completely new graph object here....
                // Intance graph exclusively for co-occurrence 
                instance_graph = new Graph(null,'graph-mini','instance');
                // heatMap.myGraph.graphData(iInstances);
                // Going to make completely new graph object for individual instance data
                instance_graph.data = iInstances;
                instance_graph.type = 'instance'; // Don't think this is necessary


                // This graph is large, so I fiddle with some of the graph rendering parameters to optimize performance.
                full_rect.myGraph
                    // .d3AlphaDecay(0)
                    // .d3VelocityDecay(0.08)
                    // .nodeRelSize(6)
                    // .nodeVal(5)
                    .cooldownTime(9000)
                    .linkColor(() => 'rgba(0,0,0,0.005)')
                    .linkVisibility(false)
                    // .onNodeHover( (d,i) => console.log(d) )
                    .zoom(0.07)
                    .onEngineStop(() => full_rect.myGraph.linkVisibility(true));
                    // .enablePointerInteraction(false);
                // full_rect.myGraph
                //     .linkVisibility(true);
                
                
        
                // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
                proc_rect.type = 'qGraph'
                proc_rect.nodeScale = [15, 220]
                proc_rect.linkScale = [0, 55]
                full_rect.prepGraph(proc_rect);
                proc_rect.prepGraph(full_rect);
                instance_graph.prepGraph();
    
    
                // Handles appropriate zooming on loading
                proc_rect.myGraph
                    .zoom(2.8);
                instance_graph.myGraph
                    .zoom(2);
                
                // Ensures links are visibile.
                proc_rect.myGraph
                    .linkVisibility(true);
                instance_graph.myGraph 
                    .linkVisibility(true)
                    .nodeVisibility(true);
    
    
                // Draws the graphs
                full_rect.drawGraph(proc_rect);
                proc_rect.drawGraph(instance_graph);
                instance_graph.drawGraph(proc_rect);
    
    
                // turns off highlighting from full rect
                full_rect.myGraph.onNodeHover( () => null)
    
                // heatmap initial data and initialization
                heatMap.myGraph.nodeVisibility(false)
                heatMap.myGraph.linkVisibility(false)
    
               
                // display q matrix
    
                heatMap.removeHeatMap()
                heatMap.data = qMat;
                heatMap.instance_ref = instance_graph;
                heatMap.unif_spars = false;
                heatMap.coOccur = true;
                heatMap.nodeScale = proc_rect.nodeScale
                heatMap.linkScale = proc_rect.linkScale
                heatMap.active_alg = file;
                heatMap.data_name = 'rec_100';
                heatMap.uncert = uncert;
                heatMap.k = k;
                heatMap.createHeatMap()
                // Pass references to heatmap as well
                heatMap.full_ref = full_rect;
                heatMap.proc_ref = proc_rect;
                
            })

        }

    }
    else{

        Promise.all([
            //reduced
            d3.json(`data/${file}/tvshow_3892/cluster_20/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/tvshow_3892/cluster_20/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/tvshow_3892/cluster_20/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            
            proc_rect.data = files[0];
            full_rect.data = files[1];

            // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
            proc_rect.type = 'clust';
            if (uncert == 'local_mutual_information'){
                proc_rect.nodeScale = this.mutual_information_node_scale
                proc_rect.linkScale = this.mutual_information_link_scale
            }
            else{

                proc_rect.nodeScale = [0.0013348737353079964, 0.03940252992083273];
                proc_rect.linkScale = [2.3157894736842106, 19.63157894736842];
            }

            full_rect.prepGraph(proc_rect);
            proc_rect.prepGraph(full_rect);

            proc_rect.myGraph
                .zoom(3);

            // This graph is large, so I fiddle with some of the graph rendering parameters to optimize performance.
            full_rect.myGraph
                // .d3AlphaDecay(0)
                // .d3VelocityDecay(0.08)
                // .nodeRelSize(6)
                // .nodeVal(5)
                .cooldownTime(9000)
                .linkColor(() => 'rgba(0,0,0,0.005)')
                .linkVisibility(false)
                // .onNodeHover( (d,i) => console.log(d) )
                .zoom(0.07)
                .onEngineStop(() => full_rect.myGraph.linkVisibility(true));
                // .enablePointerInteraction(false);
            // full_rect.myGraph
            //     .linkVisibility(true);

            full_rect.drawGraph(proc_rect);
            proc_rect.drawGraph(full_rect);

            // heatmap initial data
            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.nodeScale = proc_rect.nodeScale;
            heatMap.unif_spars = false;
            heatMap.coOccur = false;
            heatMap.active_alg = file;
            heatMap.data_name = 'tvshow_3892';
            heatMap.uncert = uncert;
            heatMap.k = 20;
            heatMap.createHeatMap()
            // Pass references to heatmap as well
            heatMap.full_ref = full_rect;
            heatMap.proc_ref = proc_rect;

        })
    }       

    // // detects change on bar and updates data shown accordingly
    // d3.select('#coarse-cele').on('input', function(d){
    //     let k = k_Bar.activeK;
    //     //  console.log('in script',that.k)
                
    //     // Loads data based on parameters 
    //     Promise.all([
    //         //reduced
    //         d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/uncertainty_graph.json`),
    //         //original
    //         d3.json(`data/${file}/celegans_453/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
    //         // uncertainty matrix
    //         d3.csv(`data/${file}/celegans_453/cluster_${k}/${uncert}/uncertain_mat.csv`)

    //     ]).then(function(files){
    //         proc_rect.data = files[0];
    //         full_rect.data = files[1];

    //         heatMap.myGraph.nodeVisibility(false)
    //         heatMap.myGraph.linkVisibility(false)

    //         heatMap.removeHeatMap()
    //         heatMap.unif_spars = false;
    //         heatMap.data = files[2];
    //         heatMap.unif_spars = false;
    //         heatMap.active_alg = file;
    //         heatMap.data_name = 'celegans_453';
    //         heatMap.uncert = uncert;
    //         heatMap.k = k;
    //         heatMap.createHeatMap()
            
    //         // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
    //         full_rect.prepGraph(proc_rect);
    //         proc_rect.prepGraph(full_rect);

    //         // Pass references to heatmap as well
    //         heatMap.full_ref = full_rect;
    //         heatMap.proc_ref = proc_rect;

    //         // Feeding in graph data like this speeds things up really well!
    //         full_rect.myGraph.graphData(full_rect.data)
    //         proc_rect.myGraph.graphData(proc_rect.data)

    //     })

    // })

}


//////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////   DESCRIPTION CODE   /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// //make tooltip div for descriptions
// d3.select("#data-panel")
//     .append("div")
//     .attr("id", "info-tooltip")
//     .style("opacity", 0);

// //Creating descriptive tooltips etc
// let original_description = d3.select("#full-label");
// let reduced_description = d3.select("#processed-label");
// let heatmap_description = d3.select("#heatmap-label");
// let mini_description = d3.select("#mini-label");
// let instances_description = d3.select("#instances-label");

// // algorithms
// let njw_description = d3.select("#coarse");
// let spec_spars_description = d3.select("#spars");
// let spec_coarse_description = d3.select("#spec_coarse");
// let unif_coarse_description = d3.select("#unifying_framework_coarse");
// let unif_spars_description = d3.select("#unifying_framework_spars");
// let gemsec_description = d3.select("#gemsec");

// original_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> The original graph with no algorithm applied to it. Highlight the nodes to see how they correspond to the reduced graph. </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// reduced_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> The 'reduced' graph which has had the selected algorithm applied to it. Highlight nodes to see how it corresponds to the original graph. </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// heatmap_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> A heatmap where every row corresponds to a node in the reduced graph and every column corresponds to an individual run using the selected algorithm. Squares are colored by the value of the uncertainty of a node. Click on columns to view the graph associated with that particular run. </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// instances_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> A row of all the individual instances where each rectangle represents one of the instances used in computing the sparsified graph above. </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// mini_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> The graph of the individual instance selected from the heatmap. Node size in this graph is scaled by weight, unlike the nodes in the reduced graph which are scaled by the uncertainty mean.</p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// njw_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> Spectral clustering algorithms group clusters of vertices into super-vertices, reducing the size of a graph. The NJW algorithm uses the k largest eigenvalues of the normalized adjacency matrix and k-means clustering to produce a reduced graph. </p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// spec_spars_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> Spectral Sparsification aims to reduce the size of a graph while preserving its spectral properties. It uses the notion of effective resistance to produce a reduced graph with the same number of vertices but a smaller number of edges.</p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// spec_coarse_description 
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> Spectral clustering algorithms group clusters of vertices into super-vertices, reducing the size of a graph. The JLJ algorithm uses both the largest and smallest eigenvalues of the normalized graph Laplacian and k-means clustering to produce a reduced graph. </p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// unif_coarse_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> This unifying framework for spectrum-preserving graph reduction allows users to simultaneously sparsify and coarsen a graph while preserving its large-scale structure. Both sparsification and coarsening are unified as edge actions, where edge deletion achieves sparsification and edge contraction supports coarsening. </p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// unif_spars_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> This unifying framework for spectrum-preserving graph reduction allows users to simultaneously sparsify and coarsen a graph while preserving its large-scale structure. Both sparsification and coarsening are unified as edge actions, where edge deletion achieves sparsification and edge contraction supports coarsening. </p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// gemsec_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html(`<p> GESMEC is.... </p>`); 
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });


// // Need to load these when they exist on alg drop
// let k_description = d3.select("#cluster-text");
// let filter_description = d3.select("#filter-text");
// let reduction_description = d3.select("#reduction-text");

// k_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// filter_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> Adjust bar to filter out edges.</p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });

// reduction_description
//     .on("mouseover",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 1);
//         d3.select("#info-tooltip").html("<p> Adjust bar to view different reduction ratios... (needs more explanation) </p>");
//             // .style("left",(d3.event.pageX+15) + "px") 
//             // .style("top", (d3.event.pageY+15) + "px");     
//     })
//     .on("mouseout",function(){
//         d3.select("#info-tooltip")
//             .transition()
//             .duration(200)
//             .style("opacity", 0);
//     });