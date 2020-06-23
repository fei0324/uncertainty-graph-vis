
//Instantiates graph objects with data

//This script loads data on demand instead of just all at once

// Makes graph objects once, passing in no data to begin with
let full_rect = new Graph(null,'graph-orig','orig');
let proc_rect = new Graph(null,'graph-processed','clust');

// Makes heatmap
let heatMap = new Table(null,full_rect,proc_rect,null,null,null)


// Populates default view
renderCoarseLesmis('local_adjusted_rand_index','njw_spectral_clustering');
$(`#gemsec`).addClass('disabled')


// Handling resizing stuff
window.addEventListener("resize", resize);
var redraw = document.getElementById("redraw");
function resize (event) {
    // Gets new sizes and sets new canvas dimensions
    let orig_loc = document.getElementById('graph-orig');
    let proc_loc = document.getElementById('graph-processed');
    let mini_loc = document.getElementById('graph-mini');

    let boundingRect_orig = orig_loc.getBoundingClientRect();
    let boundingRect_proc = proc_loc.getBoundingClientRect();
    let boundingRect_mini = mini_loc.getBoundingClientRect();

    let orig_width = boundingRect_orig.width;
    let orig_height = boundingRect_orig.height;
    let proc_width = boundingRect_proc.width;

    let proc_height = boundingRect_proc.height;
    let mini_width = boundingRect_mini.width;
    let mini_height = boundingRect_mini.height;

    full_rect.myGraph.width(orig_width);
    full_rect.myGraph.height(orig_height);
    proc_rect.myGraph.width(proc_width);
    proc_rect.myGraph.height(proc_height);
    heatMap.myGraph.width(mini_width);
    heatMap.myGraph.height(mini_height);

    // Now I need to resize the heat map (only if there currently is one)
    if (document.getElementById('row-g-0')){
        console.log("heatmap exists")
        heatMap.removeHeatMap()
        heatMap.createHeatMap()
    }

    // Resize legend.... this is tricky
    proc_rect.legend(proc_rect.link_legend,proc_rect,proc_rect.linkColor,'link');
    proc_rect.legend(proc_rect.node_legend,proc_rect,proc_rect.color,'node');
    
}


//Uncertainty dropdown
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
                //Render coarse graph for cele
                renderCoarseEmail(target,'njw_spectral_clustering')

            }
        }
        else if (active_alg == 'sparse'){

            //TODO print message
            console.log("can't do nothin")

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

        }
        else if (active_alg == 'unifying_framework_coarse'){
            if(active_data =='lesmis'){
                //Render coarse graph for lesmis
                renderCoarseLesmis(target,'unifying_framework_coarsen')

            }

        }
        else if (active_alg == 'gemsec'){
            if(active_data =='tv'){
                //Render coarse graph for lesmis
                renderGemsecTv(target,'gemsec')

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

        //Removes infobox if still up
        d3.select(`#infobox-graph-orig`).transition()
            .duration(200)
            .style("opacity", 0);

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

            // Need to load these when they exist on alg drop
            let k_description = d3.select("#cluster-text");

            k_description
                .on("mouseover",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
                        // .style("left",(d3.event.pageX+15) + "px") 
                        // .style("top", (d3.event.pageY+15) + "px");     
                })
                .on("mouseout",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                });


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
                let kids = $('#algDrop').find('div')
                kids.removeClass( "active" );
                // kids.addClass('disabled')
                // $(`#${target}`).removeClass("disabled")
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


                // Need to load these when they exist on alg drop
                let filter_description = d3.select("#filter-text");
                let reduction_description = d3.select("#reduction-text");

                filter_description
                    .on("mouseover",function(){
                        d3.select("#info-tooltip")
                            .transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select("#info-tooltip").html("<p> Adjust bar to filter out edges.</p>");
                            // .style("left",(d3.event.pageX+15) + "px") 
                            // .style("top", (d3.event.pageY+15) + "px");     
                    })
                    .on("mouseout",function(){
                        d3.select("#info-tooltip")
                            .transition()
                            .duration(200)
                            .style("opacity", 0);
                    });

                reduction_description
                    .on("mouseover",function(){
                        d3.select("#info-tooltip")
                            .transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select("#info-tooltip").html("<p> Adjust bar to view different reduction ratios... (needs more explanation) </p>");
                            // .style("left",(d3.event.pageX+15) + "px") 
                            // .style("top", (d3.event.pageY+15) + "px");     
                    })
                    .on("mouseout",function(){
                        d3.select("#info-tooltip")
                            .transition()
                            .duration(200)
                            .style("opacity", 0);
                    });


            }
            else if(active_data == 'cele'){
                console.log('sparsification data not available')


            }
        }
        else if (target == 'spec_coarse'){
            //TODO: Hide buttons that don't apply/ make buttons that do reappear
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            console.log("active start",start_active)
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

            // Need to load these when they exist on alg drop
            let k_description = d3.select("#cluster-text");

            k_description
                .on("mouseover",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
                        // .style("left",(d3.event.pageX+15) + "px") 
                        // .style("top", (d3.event.pageY+15) + "px");     
                })
                .on("mouseout",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                });

        }
        else if (target == 'unifying_framework_coarse'){
            //TODO: Hide buttons that don't apply/ make buttons that do reappear
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            console.log("active start",start_active)
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

            // Need to load these when they exist on alg drop
            let k_description = d3.select("#cluster-text");

            k_description
                .on("mouseover",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
                        // .style("left",(d3.event.pageX+15) + "px") 
                        // .style("top", (d3.event.pageY+15) + "px");     
                })
                .on("mouseout",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                });

        }

        else if (target == 'unifying_framework_spars'){
            //TODO: Hide buttons that don't apply/ make buttons that do reappear
            // changes active highlighting if it's a valid move
            let start_active = $('#algDrop').find('active');
            console.log("active start",start_active)
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
                renderUnifSpars('lesmis_77','unifying_framework_sparsify')
            }
            else if(active_data =='rectangle'){
                //Render unifying spars graph for rectangle
                renderUnifSpars('rec_100','unifying_framework_sparsify')
            }

            // Need to load these when they exist on alg drop
            let k_description = d3.select("#cluster-text");

            k_description
                .on("mouseover",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
                        // .style("left",(d3.event.pageX+15) + "px") 
                        // .style("top", (d3.event.pageY+15) + "px");     
                })
                .on("mouseout",function(){
                    d3.select("#info-tooltip")
                        .transition()
                        .duration(200)
                        .style("opacity", 0);
                });

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

        //Removes infobox if still up
        d3.select(`#infobox-graph-orig`).transition()
            .duration(200)
            .style("opacity", 0);

        // Clear anything in the mini graph canvas
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)


        // Finds which algorithm is active 
        let active_alg = $('#algDrop').find('.active')[0].id;
        console.log("active algorithm",active_alg);

        // Finds which uncertainty is active 
        let active_uncertainty = $('#uncertaintyDrop').find('.active')[0].id;
        console.log("active uncertainty",active_uncertainty);
        

        // if (active_alg=='coarse'){
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


                $(`#spars`).addClass('disabled')
                $(`#unifying_framework_coarse`).addClass('disabled')
                $(`#spec_coarse`).removeClass('disabled')
                $(`#unifying_framework_spars`).removeClass('disabled')
                $(`#gemsec`).addClass('disabled')
                renderCoarseRect(active_uncertainty,'njw_spectral_clustering')
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

                $(`#spars`).addClass('disabled')
                $(`#unifying_framework_coarse`).addClass('disabled')
                $(`#spec_coarse`).addClass('disabled')
                $(`#unifying_framework_spars`).addClass('disabled')
                $(`#coarse`).addClass('disabled')
                renderGemsecTv(active_uncertainty,'gemsec')

            }
        // }
        // else if (active_alg=='spars'){
        //     if (target == 'rectangle'){
        //         // TODO: Display message on screen 
        //         console.log('sparsification data not available')

        //     }
        //     else if(target =='lesmis'){
        //         // changes active highlighting
        //         let kids = $('#datasetDrop').find('a')
        //         kids.removeClass( "active" );
        //         $(`#${target}`).addClass("active")
        //         //Render sparse graph for lesmis
        //         renderSparsLesmis()

        //     }
        //     else if(target == 'cele'){
        //         console.log('sparsification data not available')

        //     }

        // }
        // else if (active_alg=='spec_coarse'){
        //     // changes active highlighting
        //     let kids = $('#datasetDrop').find('a')
        //     kids.removeClass( "active" );
        //     $(`#${target}`).addClass("active")

        //     if (target == 'rectangle'){

        //         $(`#spars`).addClass('disabled')
        //         renderCoarseRect(active_uncertainty,'spectral_coarsening')
        //     }
        //     else if(target =='lesmis'){
        //         $(`#spars`).removeClass("disabled")
        //         renderCoarseLesmis(active_uncertainty,'spectral_coarsening')
        //     }
        //     else if(target =='cele'){
        //         $(`#spars`).addClass('disabled')
        //         renderCoarseCele(active_uncertainty,'spectral_coarsening')

        //     }
        // }
        // else if (active_alg=='unifying_framework_coarse'){
        //     // changes active highlighting
        //     let kids = $('#datasetDrop').find('a')
        //     kids.removeClass( "active" );
        //     $(`#${target}`).addClass("active")

        //     if(target =='lesmis'){
        //         $(`#spars`).removeClass("disabled")
        //         renderCoarseLesmis(active_uncertainty,'unifying_framework_coarsen')
        //     }
        // }
        // else if (active_alg=='unifying_framework_spars'){
        //     // changes active highlighting
        //     let kids = $('#datasetDrop').find('a')
        //     kids.removeClass( "active" );
        //     $(`#${target}`).addClass("active")

        //     if(target =='lesmis'){
        //         $(`#spars`).removeClass("disabled")
        //         renderUnifSpars('lesmis_77','unifying_framework_sparsify')
        //     }
        //     else if(target =='rectangle'){
        //         $(`#spars`).addClass("disabled")
        //         $(`#unifying_framework_coarsen`).addClass("disabled")
        //         renderUnifSpars('rec_100','unifying_framework_sparsify')
        //     }
        // }
        
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


/////////////////////// NJW SPECTRAL CLUSTERING RENDERING FUNCTIONS //////////////////////////////////////

function renderCoarseRect(uncert,file){

    // Type of uncertainty
    this.uncert = uncert;
    console.log("my file",file)

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
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        proc_rect.myGraph
            .zoom(2.8);
        full_rect.myGraph
            .zoom(0.8);
        
        full_rect.myGraph
            .linkVisibility(true);

        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);

        // heatmap initial data
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.removeHeatMap()
        heatMap.data = files[2];
        heatMap.unif_spars = false;
        heatMap.active_alg = file;
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
            d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/uncertainty_graph.json`),
            //original
            d3.json(`data/${file}/rec_100/cluster_${k}/${uncert}/ori_graph_with_cluster.json`),
            // uncertainty matrix
            d3.csv(`data/${file}/rec_100/cluster_${k}/${uncert}/uncertain_mat.csv`)

        ]).then(function(files){
            proc_rect.data = files[0];
            full_rect.data = files[1];

            proc_rect.myGraph
                .zoom(2.8);
            full_rect.myGraph
                .zoom(0.8);

            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.unif_spars = false;
            heatMap.active_alg = file;
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

function renderCoarseLesmis(uncert,file){

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
        d3.json(`data/${file}/lesmis_77/cluster_${9}/${uncert}/uncertainty_graph.json`),
        //original
        d3.json(`data/${file}/lesmis_77/cluster_${9}/${uncert}/ori_graph_with_cluster.json`),
        // uncertainty matrix
        d3.csv(`data/${file}/lesmis_77/cluster_${9}/${uncert}/uncertain_mat.csv`)

    ]).then(function(files){
        
        proc_rect.data = files[0];
        full_rect.data = files[1];

        // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
        proc_rect.type = 'clust'
        full_rect.myGraph
            .linkVisibility(true);

        proc_rect.myGraph
            .zoom(2.7);
        full_rect.myGraph
            .zoom(0.8);

        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

    
        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);

        // heatmap initial data
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.data = files[2];
        heatMap.unif_spars = false;
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
            proc_rect.data = files[0];
            full_rect.data = files[1];

            proc_rect.myGraph
                .zoom(2.7);
            full_rect.myGraph
                .zoom(0.8);

            heatMap.myGraph.nodeVisibility(false)
            heatMap.myGraph.linkVisibility(false)

            heatMap.removeHeatMap()
            heatMap.data = files[2];
            heatMap.unif_spars = false;
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

function renderCoarseCele(uncert,file){

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
        d3.json(`data/${file}/celegans_453/cluster_${10}/${uncert}/uncertainty_graph.json`),
        //original
        d3.json(`data/${file}/celegans_453/cluster_${10}/${uncert}/ori_graph_with_cluster.json`),
        // uncertainty matrix
        d3.csv(`data/${file}/celegans_453/cluster_${10}/${uncert}/uncertain_mat.csv`)

    ]).then(function(files){
        
        proc_rect.data = files[0];
        full_rect.data = files[1];

        // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
        proc_rect.type = 'clust';
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

        // heatmap initial data
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.removeHeatMap()
        heatMap.data = files[2];
        heatMap.unif_spars = false;
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
            heatMap.active_alg = file;
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


function renderCoarseEmail(uncert,file){

    // Type of uncertainty
    this.uncert = uncert;
    console.log("my file",file)

    console.log("type of uncertainty",this.uncert)

    //Sets default k
    this.k = 20
    let range = [20,50]
    let that = this;

        // deletes k bar if one exists  
    d3.select(".active-kBar").remove();

    // deletes f bar if one exists  
    d3.select(".active-fBar").remove();

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'coarse-email');

    // Initial k is 2, so draws this

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
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        proc_rect.myGraph
            .zoom(2.5);

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
        
        full_rect.drawGraph(proc_rect);
        proc_rect.drawGraph(full_rect);

        // heatmap initial data
        heatMap.myGraph.nodeVisibility(false)
        heatMap.myGraph.linkVisibility(false)

        heatMap.removeHeatMap()
        heatMap.data = files[2];
        heatMap.unif_spars = false;
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
        proc_rect.type = 'spars';

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
    if (data_name == 'lesmis_77'){
        range = [0.7,0.9]
    }
    else{
        range = [0.6,0.9]
    }
    console.log(range)
    let that = this;
    this.k = range[0];

    //Sets default filter
    this.f = 0
    let f_range = [0,1]

    // deletes k bar if one exists  
    d3.select(".active-kBar").remove();

    //Creates k bar
    let k_Bar = new kBar(this.k,range,'unif-spars');

    // deletes f bar if one exists  
    d3.select(".active-fBar").remove();

    //Creates f bar
    let f_Bar = new fBar(this.f,f_range,'spars-mis-f');

    // Can choose any data for full graph, there's no linked views with this.
    // full_rect.data = full_mis_9;
    // Loads data based on parameters 
    Promise.all([
        //reduced
        d3.json(`data/${file}/${data_name}/${data_name}_${range[0]}/sparsified_uncertainty_graph_${range[0]}.json`),
        //original
        d3.json(`data/${data_name}/original_10.json`),
        // selection skeleton for individual instances
        d3.csv(`data/${file}/${data_name}/uncertain_mat.csv`)

    ]).then(function(files){
        proc_rect.data = files[0];
        full_rect.data = files[1];
        
        // Recalculates scales and such for new data passed in - should I go back to making separate graph objects?
        // For some reason completely bewildering to me, this prepgraph needs to be here or things break??
        proc_rect.prepGraph();
        proc_rect.type = 'spars';

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
        console.log(threshold)
        proc_rect.myGraph.linkVisibility( (d,i) => (parseFloat(d.mean) >= threshold) ? true : false )


    })

    // detects change on bar and updates data shown accordingly
    d3.select('#unif-spars').on('input', function(d){
        let k = k_Bar.activeK;
         console.log('in script',k)
                
        // Loads data based on parameters 
        Promise.all([
            //reduced
        d3.json(`data/${file}/${data_name}/${data_name}_${k}/sparsified_uncertainty_graph_${k}.json`),
        //original
        d3.json(`data/${data_name}/original_10.json`),
        // selection skeleton for individual instances
        d3.csv(`data/${file}/${data_name}/uncertain_mat.csv`)

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

    // deletes k bar if one exists  
    d3.select(".active-kBar").remove();

    // deletes f bar if one exists  
    d3.select(".active-fBar").remove();

    //Creates k bar - no kbar for gemsec 
    // let k_Bar = new kBar(this.k,range,'coarse-cele');

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
        full_rect.prepGraph(proc_rect);
        proc_rect.prepGraph(full_rect);

        proc_rect.myGraph
            .zoom(3);

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
        heatMap.unif_spars = false;
        heatMap.active_alg = file;
        heatMap.data_name = 'tvshow_3892';
        heatMap.uncert = uncert;
        heatMap.k = 20;
        heatMap.createHeatMap()
        // Pass references to heatmap as well
        heatMap.full_ref = full_rect;
        heatMap.proc_ref = proc_rect;

    })

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





///////////// TUTORIAL RENDERING  /////////////////
//make tooltip div for descriptions
d3.select("#data-panel")
    .append("div")
    .attr("id", "info-tooltip")
    .style("opacity", 0);

//Creating descriptive tooltips etc
let original_description = d3.select("#full-label");
let reduced_description = d3.select("#processed-label");
let heatmap_description = d3.select("#heatmap-label");
let mini_description = d3.select("#mini-label");
let instances_description = d3.select("#instances-label");

// algorithms
let njw_description = d3.select("#coarse");
let spec_spars_description = d3.select("#spars");
let spec_coarse_description = d3.select("#spec_coarse");
let unif_coarse_description = d3.select("#unifying_framework_coarse");
let unif_spars_description = d3.select("#unifying_framework_spars");
let gemsec_description = d3.select("#gemsec");

original_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> The original graph with no algorithm applied to it. Highlight the nodes to see how they correspond to the reduced graph. </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

reduced_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> The 'reduced' graph which has had the selected algorithm applied to it. Highlight nodes to see how it corresponds to the original graph. </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

heatmap_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> A heatmap where every row corresponds to a node in the reduced graph and every column corresponds to an individual run using the selected algorithm. Squares are colored by the value of the uncertainty of a node. Click on columns to view the graph associated with that particular run. </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

instances_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> A row of all the individual instances where each rectangle represents one of the instances used in computing the sparsified graph above. </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


mini_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> The graph of the individual instance selected from the heatmap. Node size in this graph is scaled by weight, unlike the nodes in the reduced graph which are scaled by the uncertainty mean.</p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


njw_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> Spectral clustering algorithms group clusters of vertices into super-vertices, reducing the size of a graph. The NJW algorithm uses the k largest eigenvalues of the normalized adjacency matrix and k-means clustering to produce a reduced graph. </p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


spec_spars_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> Spectral Sparsification aims to reduce the size of a graph while preserving its spectral properties. It uses the notion of effective resistance to produce a reduced graph with the same number of vertices but a smaller number of edges.</p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

spec_coarse_description 
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> Spectral clustering algorithms group clusters of vertices into super-vertices, reducing the size of a graph. The JLJ algorithm uses both the largest and smallest eigenvalues of the normalized graph Laplacian and k-means clustering to produce a reduced graph. </p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


unif_coarse_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> This unifying framework for spectrum-preserving graph reduction allows users to simultaneously sparsify and coarsen a graph while preserving its large-scale structure. Both sparsification and coarsening are unified as edge actions, where edge deletion achieves sparsification and edge contraction supports coarsening. </p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


unif_spars_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> This unifying framework for spectrum-preserving graph reduction allows users to simultaneously sparsify and coarsen a graph while preserving its large-scale structure. Both sparsification and coarsening are unified as edge actions, where edge deletion achieves sparsification and edge contraction supports coarsening. </p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


gemsec_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html(`<p> GESMEC is.... </p>`); 
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });


// Need to load these when they exist on alg drop
let k_description = d3.select("#cluster-text");
let filter_description = d3.select("#filter-text");
let reduction_description = d3.select("#reduction-text");

k_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> Adjust bar to view different clusterings of the original graph with 'k' clusters. </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

filter_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> Adjust bar to filter out edges.</p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });

reduction_description
    .on("mouseover",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 1);
        d3.select("#info-tooltip").html("<p> Adjust bar to view different reduction ratios... (needs more explanation) </p>");
            // .style("left",(d3.event.pageX+15) + "px") 
            // .style("top", (d3.event.pageY+15) + "px");     
    })
    .on("mouseout",function(){
        d3.select("#info-tooltip")
            .transition()
            .duration(200)
            .style("opacity", 0);
    });