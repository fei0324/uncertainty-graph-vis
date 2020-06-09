/** Class for rendering a graph  */

class Graph{
    /**
     * Creates a Graph Object
     *
     * @param data the full dataset - node/link info
     */
    constructor(data,location,type) {

        //Stores data
        this.data = data;
        // Assigns graph to a particular div
        this.location = location;
        // Indicates what type of graph: orig (original) or clust (clustered) or spars (sparsified)
        this.type = type;

        // console.log("Graph data:",this.data);
        //Creating forcegraph object
        this.myGraph = ForceGraph();

        //Setting width and height of canvas object
        this.LOCATION = document.getElementById(this.location)

        // Canvas width and height
        let boundingRect = this.LOCATION.getBoundingClientRect()
        this.WIDTH = boundingRect.width;
        this.HEIGHT = boundingRect.height;

        this.myGraph(this.LOCATION)
            .width(this.WIDTH)
            .height(this.HEIGHT);

        //make tooltip div - more detailed info to the side -state in selected view
        let infobox = d3.select("#data-panel")
            .append("div")
            .attr("id", `infobox-${this.location}`)
            .style("opacity", 0);
            // .style("left","995px") 
            // .style("top", "580px");
        
        // this.prepGraph();
    }

    prepGraph(){
        // Creating scales and legend

        //Scales for sparsification
        if (this.type == 'spars'){

             // Different color schemes
             let viridis = d3.interpolateViridis
             let inferno = d3.interpolateInferno
             let plasma =  d3.interpolatePlasma
             let cool = d3.interpolateCool
             let warm = d3.interpolateWarm
 
             let green =  d3.interpolateGreens
             let purple = d3.interpolatePurples
             let orange = d3.interpolateOranges
             let grey = d3.interpolateGreys
             let blue = d3.interpolateBlues
 
             let link_color = cool;
             let node_color = orange;
 
             // Link ranges
             let squareRange = [1,2.5]
             let stdRange = [2,10]
             let splineRange = [1,15]
             let meanRange = [1,5]
 
             // Check to see if inverted is activated 
             let invert_active = $('#invertDrop').find('a.active').attr('id');
             // console.log("invert active",invert_active)
             if (invert_active == 'invert'){
                 
                 // Link ranges
                 squareRange = [2.5,1]
                 stdRange = [10,2]
                 splineRange = [15,1]
                 meanRange = [5,1]
             }

            // LINK

            //finding max and min of mean for link weights and means 
            let avg_arrayLW = this.data.links.map( d => d.weight );
            let avg_arrayLM = this.data.links.map( d => d.mean );
            let std_arrayL = this.data.links.map( d => d.std );

            this.linkRange = d3.extent(avg_arrayLM)


            // Color scale for links
            this.linkColor = d3.scaleSequential(link_color).domain(d3.extent(avg_arrayLM));
            this.linkColorStd = d3.scaleSequential(link_color).domain(d3.extent(std_arrayL));


            // Link scales
            this.linkweightScale = d3.scaleLinear().domain(d3.extent(avg_arrayLW)).range(stdRange);
            this.linkMeanScale = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(meanRange);
            this.linkSquareScale = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(squareRange);
            this.linkStdScale = d3.scaleLinear().domain(d3.extent(std_arrayL)).range(stdRange);
            this.meanScaleSpline = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(splineRange);

            let edge_active = $('#edgeDrop').find('a.active').attr('id');
            
            // Creating legend selection
            let legendSVG = d3.select("#legend-SVG");
           
            // Removing legends if they exist
            d3.select('.node-legend').remove()
            d3.select('.link-legend').remove()

            // Creating link legend
            this.link_legend = legendSVG.append("g")
                .attr("class","link-legend")
                .attr("transform", "translate(0,60)");

            // Link legends
            if (edge_active == 'stdevO'){
                this.legend(this.link_legend,this,this.linkColorStd,'link-std');
            }
            else{
                this.legend(this.link_legend,this,this.linkColor,'link');
            }
        }

        //Scales for clustering
        else if (this.type == 'clust'){

            // Creating legend selection
            let legendSVG = d3.select("#legend-SVG");

            // removing if it exists
            d3.select('.node-legend').remove()
            d3.select('.link-legend').remove()

            // Creating legend
            this.node_legend = legendSVG.append("g")
                .attr("class","node-legend")
                .attr("transform", "translate(0,15)");

            this.link_legend = legendSVG.append("g")
                .attr("class","link-legend")
                .attr("transform", "translate(0,60)");
    


            //finding max and min of mean for nodes
            let avg_array = this.data.nodes.map( d => d.uncertainty_mean );
            let std_array = this.data.nodes.map( d => d.uncertainty_std );

            // Different color schemes
            let viridis = d3.interpolateViridis
            let inferno = d3.interpolateInferno
            let plasma =  d3.interpolatePlasma
            let cool = d3.interpolateCool
            let warm = d3.interpolateWarm

            let green =  d3.interpolateGreens
            let purple = d3.interpolatePurples
            let orange = d3.interpolateOranges
            let grey = d3.interpolateGreys
            let blue = d3.interpolateBlues

            let pinkblue = d3.interpolate("#ff3aa6", "#30ffe3")
            let greenorange = d3.interpolate('#a6ff3a','#ff5d30')

            let link_color = cool;
            let node_color = blue;

            //Node range 
            let node_range = [1,4];

            // Link ranges
            let squareRange = [1,2.5]
            let stdRange = [2,10]
            let splineRange = [1,15]
            let meanRange = [1,5]

            // Check to see if inverted is activated 
            let invert_active = $('#invertDrop').find('a.active').attr('id');
            // console.log("invert active",invert_active)
            if (invert_active == 'invert'){
                //Node range 
                node_range = [4,1];

                // Link ranges
                squareRange = [2.5,1]
                stdRange = [10,2]
                splineRange = [15,1]
                meanRange = [5,1]
            }
        

            // NODE

            //Color scale for means of node
            //Experimenting by making the median the diverging point, if this doesn't work, could change to mean
            //this.color = d3.scaleDiverging([minMean, medMean, maxMean], d3.interpolateRdBu);
            this.color = d3.scaleSequential(node_color).domain(d3.extent(avg_array));
            this.stdColor = d3.scaleSequential(node_color).domain(d3.extent(std_array));

            // linear scale for mean of node
            this.meanScale = d3.scaleLinear().domain(d3.extent(avg_array)).range(node_range)
            this.nodeStdScale = d3.scaleLinear().domain(d3.extent(std_array)).range(node_range)


            // LINK

            //finding max and min of mean for link weights and means 
            let avg_arrayLW = this.data.links.map( d => d.weight );
            let avg_arrayLM = this.data.links.map( d => d.mean );
            let std_arrayL = this.data.links.map( d => d.std );

            // Color scale for links
            this.linkColor = d3.scaleSequential(link_color).domain(d3.extent(avg_arrayLM));
            this.linkColorStd = d3.scaleSequential(link_color).domain(d3.extent(std_arrayL));


            // Link scales
            this.linkweightScale = d3.scaleLinear().domain(d3.extent(avg_arrayLW)).range(stdRange);
            this.linkMeanScale = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(meanRange);
            this.linkSquareScale = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(squareRange);
            this.linkStdScale = d3.scaleLinear().domain(d3.extent(std_arrayL)).range(stdRange);
            this.meanScaleSpline = d3.scaleLinear().domain(d3.extent(avg_arrayLM)).range(splineRange);

            // // Creating legend selection
            // let legendSVG = d3.select("#legend-SVG");
            
            // // Creating legend
            // this.clust_legend = legendSVG.append("g")
            //     .attr("class","clust-legend")
            //     .attr("transform", "translate(45,0)");

            //calls legend - need to detect here what options are active in dropdowns and style accordingly
            let node_active = $('#nodeDrop').find('a.active').attr('id');
            // console.log("node active in prep",node_active)
            let edge_active = $('#edgeDrop').find('a.active').attr('id');
            // console.log("edge active in prep",edge_active)

            // Node legends
            if (node_active == 'std'){
                this.legend(this.node_legend,this,this.stdColor,'node-std');
            }
            else{
                this.legend(this.node_legend,this,this.color,'node');
            }

            // Link legends
            if (edge_active == 'stdevO'){
                this.legend(this.link_legend,this,this.linkColorStd,'link-std');
            }
            else{
                this.legend(this.link_legend,this,this.linkColor,'link');
            }
            

        }
    }

    /**
     * Renders the graph
     * @param 
     */
    drawGraph(reference){

        //Allows me to access this scope inside deeper functions
        let that = this;

        // Reference to other graph object
        this.reference = reference
        console.log("my ref",this.reference)


        // let myGraph = ForceGraph();
        let data = this.data;

        // TODO: See if I can incorporate gaussian blurring
        // TODO: Clear on background click for node or link selectiin
        // TODO: Node selection on click
        // TODO: Add animations
        // TODO: implement zooming on node (or edge) 
            // Could be cool idea that when we click on a node, only the nodes neighbors are rendered
            // Same with links - look into if I can do this....
            // https://github.com/vasturiano/force-graph/blob/master/example/dynamic/index.html
        // TODO: implement drag and stay 
        // TODO: better color scheme + legend
        // TODO: Adjust the way I've built this class to contain a 'draw graph' and an 'update graph'
            // Then I can just pass in new data and have 1 graph class per dataset
        // TODO: Think of a way that I don't have to redraw the graph every time, maybe 
            // Just make a canvas object and class it uniquely, then class as hidden when it's off screen
            // This way won't force computer to redraw everything
        // TODO: add std dev scaling bar?

        // For link highlighting
        let highlightLink = null;
        let clickedLink = [];
        let highlightNodes = [];

        
        let location = this.LOCATION;
        let WIDTH = this.WIDTH;
        let HEIGHT = this.HEIGHT;

        // Graph for SPARSIFICATION
        if (this.type == 'spars'){
            console.log("IN SPARS IN DRAW GRAPH")

            let thatNode = this;
            let node_rel_size = 4;
            this.myGraph
                .graphData(data)
                .nodeRelSize(node_rel_size)
                .nodeColor(() => "black")
                .nodeLabel(node => node.id)
                .onNodeClick(node => console.log(node.id))
                .onNodeHover(node => {
                    highlightNodes = node ? [node] : []
                    
                    let that = this
                    // console.log(node)
                    if (node){
                        
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select(`#infobox-graph-processed`).html(that.infoboxRender(node,null));

                        // //Row highlighting
                        // d3.select(`#row-${node.id}`).transition()
                        //     .duration(100)
                        //     .style('opacity',1);
                    }
                    else{
                       
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 0);

                        // //Row de-highlighting
                        // d3.selectAll(`.row-back`).transition()
                        //     .duration(100)
                        //     .style('opacity',0);
                    }

                })
                // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : this.color(node.uncertainty_mean))
                .nodeCanvasObjectMode(()=> 'before')
                .nodeCanvasObject((node, ctx) => {
                    // Calculate radius for std
                    //let stdSCALING = highlightNodes.indexOf(node) !== -1 ? 4000 : 1000;
                    let NODE_R = 0;
                    let halo_color = null;
                    if (highlightNodes.indexOf(node) !== -1){
                        NODE_R = 12;
                        halo_color = '#EA000080'
                    }
                });


            // LINK STYLING

            // Determine which is active, style by that.....
            let edge_active = $('#edgeDrop').find('a.active').attr('id');

            if (edge_active == 'splineOD'){

                that.splineOD(thatNode.myGraph,that)
                
            }
            // else if( edge_active == 'spline'){

            //     that.spline(thatNode.myGraph,that)

            // }
                
            // Link Menu selections

            // EDGE VIS
            // Detect which edge vis type is active and executes appropriate code
            $('#edgeDrop').on('hide.bs.dropdown', function (e) {
                let drop_edge = null;
                let targetClass = null;
                if (e.clickEvent){
                    targetClass = $(e.clickEvent.target).attr('class')
                }
                if (targetClass == 'dropdown-item'){
                    let target = e.clickEvent.target.id;
                    // console.log('target',target)
                    drop_edge = target;

                    // changes active highlighting
                    let kids = $('#edgeDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")

                    
                }


                if (drop_edge == 'splineOD'){
                    // console.log('spline on demand')
                    that.splineOD(thatNode.myGraph,that);
                    that.legend(that.link_legend,that,that.linkColor,'link');
                        
                }
                else if(drop_edge == 'spline'){
                    // console.log('spline')
                    that.spline(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColor,'link');
        
                }
                else if(drop_edge =='square'){
                    // console.log('square')
                    that.square(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColor,'link');
                    
                }
                else if (drop_edge == 'stdevO'){
                    // console.log('stdevO')
                    that.stdevO(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColorStd,'link-std');
                    
                }



            });



        }

        //graph for NODE COARSENING
        else if (this.type == 'clust'){
            console.log("node clustering")
            // allows me to access this scope inside of drop down functions
            let thatNode = this;
            
            // //calls legend
            // this.legend(this.clust_legend,this,this.color,'clust');
            // this.legend(le_legend,this,this.color_le,"le");

            let node_rel_size = 4;
            this.myGraph
                .graphData(data)

                // NODE STYLING - default

                // Determine which is active, style by that.....
                let node_active = $('#nodeDrop').find('a.active').attr('id');
                // console.log("node active",node_active)

                if (node_active == 'mstdev'){

                    that.mstdev(thatNode.myGraph,that,node_rel_size)
                  
                }
                // else if( node_active == 'spline'){

                //     that.spline(thatNode.myGraph,that)

                // }

                // NODE MENU OPTIONS
                // Detect which edge vis type is active and executes appropriate code
                $('#nodeDrop').on('hide.bs.dropdown', function (e) {
                    // console.log(e)
                    // console.log("graph obj",thatNode.myGraph.graphData())
                    let drop_edge = null;
                    let targetClass = null;
                    if (e.clickEvent){
                        targetClass = $(e.clickEvent.target).attr('class')
                    }
                    if (targetClass == 'dropdown-item'){
                        let target = e.clickEvent.target.id;
                        // console.log('target',target)
                        drop_edge = target;

                        // changes active highlighting
                        let kids = $('#nodeDrop').find('a')
                        kids.removeClass( "active" );
                        $(`#${target}`).addClass("active")

                        
                    }
                    // console.log('drop_edge',drop_edge)

                    if (drop_edge == 'mstdev'){
                        // console.log('mean + stdev')
                        that.mstdev(thatNode.myGraph,that,node_rel_size);
                        that.legend(that.node_legend,that,that.color,'node');
                            
                    }
                    else if(drop_edge == 'mean'){
                        // console.log('mean')
                        that.nodeMean(thatNode.myGraph,that,node_rel_size)
                        that.legend(that.node_legend,that,that.color,'node');
            
                    }
                    else if(drop_edge == 'std'){
                        // console.log('std')
                        that.nodeStd(thatNode.myGraph,that,node_rel_size)
                        that.legend(that.node_legend,that,that.stdColor,'node-std');
            
                    }





                });


                // LINK STYLING - default

                // Determine which is active, style by that.....
                let edge_active = $('#edgeDrop').find('a.active').attr('id');
                // console.log("edge active",edge_active)

                if (edge_active == 'splineOD'){

                    that.splineOD(thatNode.myGraph,that)
                  
                }
                // else if( edge_active == 'spline'){

                //     that.spline(thatNode.myGraph,that)

                // }

                
            // Link Menu selections

            // EDGE VIS
            // Detect which edge vis type is active and executes appropriate code
            $('#edgeDrop').on('hide.bs.dropdown', function (e) {
                // console.log(e)
                // console.log("graph obj",thatNode.myGraph.graphData())
                let drop_edge = null;
                let targetClass = null;
                if (e.clickEvent){
                    targetClass = $(e.clickEvent.target).attr('class')
                }
                if (targetClass == 'dropdown-item'){
                    let target = e.clickEvent.target.id;
                    // console.log('target',target)
                    drop_edge = target;

                    // changes active highlighting
                    let kids = $('#edgeDrop').find('a')
                    kids.removeClass( "active" );
                    $(`#${target}`).addClass("active")

                    
                }
                // console.log('drop_edge',drop_edge)


                if (drop_edge == 'splineOD'){
                    // console.log('spline on demand')
                    that.splineOD(thatNode.myGraph,that);
                    that.legend(that.link_legend,that,that.linkColor,'link');
                        
                }
                else if(drop_edge == 'spline'){
                    // console.log('spline')
                    that.spline(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColor,'link');
        
                }
                else if(drop_edge =='square'){
                    // console.log('square')
                    that.square(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColor,'link');
                    
                }
                else if (drop_edge == 'stdevO'){
                    // console.log('stdevO')
                    that.stdevO(thatNode.myGraph,that)
                    that.legend(that.link_legend,that,that.linkColorStd,'link-std');
                    
                }



            });
            


        }

        // This is the original, full, un-annotated graph
        else if (this.type == 'orig'){

            //TODO: when I highlight node here, it highlights corresoinding supercluster
            const NODE_R = 8;

            // Detects if sparsification is active algo and sets is_sparse accordingly
            let is_sparse = null;
            let active_alg = $('#algDrop').find('.active')[0].id;
            if (active_alg == 'spars'){
                is_sparse = true;
            }
            else{
                is_sparse = false;
            }
            console.log("is_sparse:",is_sparse)

            this.myGraph
                .graphData(data)
                .nodeRelSize(NODE_R)
                .nodeLabel(node => node.id)
                .nodeColor(()=> "black")
                .onNodeHover(node => {
                    highlightNodes = node ? [node] : [];

                    if (node){
                        // Need to select node with id that is node.cluster
                        if (this.reference != null){
                            let my_data = this.reference.myGraph.graphData();
                            // console.log(my_data.nodes)
                            let da_node = my_data.nodes.filter(l => l.id == node.cluster); // extract node with correct id
                            // console.log("selected node",da_node)
                            this.reference.myGraph
                                .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.reference.color(ref_node.uncertainty_mean));

                            // // activating panel
                            // d3.select(`#infobox-graph-processed`).transition()
                            //     .duration(200)
                            //     .style("opacity", 1);
                            // d3.select(`#infobox-graph-processed`).html(this.infoboxRenderOrig(node));

                            //Row highlighting
                            d3.selectAll(`#row-${node.cluster}`).transition()
                                .duration(100)
                                .style('opacity',1);
                        }
                        // activating panel
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select(`#infobox-graph-processed`).html(this.infoboxRenderOrig(node,is_sparse));

                    }
                    else{
                        highlightNodes = []
                        // Need to reset da_node's color to what it was and ena
                        if (this.reference != null){
                            this.reference.myGraph
                                .nodeColor( ref_node => this.reference.color(ref_node.uncertainty_mean));

                            

                            //Row de-highlighting
                            d3.selectAll(`.row-back`).transition()
                                .duration(100)
                                .style('opacity',0);
                        }

                        // deactivating panel
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 0);

                    }
                    
                })
                // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : 'black')
                // Uncomment for halo on highlight
                .nodeCanvasObjectMode(node => highlightNodes.indexOf(node) !== -1 ? 'before' : undefined)
                .nodeCanvasObject((node, ctx) => {

                    // add ring just for highlighted nodes
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, NODE_R * 2, 0, 2 * Math.PI, false);
                    ctx.fillStyle = '#EA000080';
                    ctx.fill();
                })
                .linkWidth(1)
                .linkColor(() => '#878787');
        }


    }

    // Legend Function from: https://observablehq.com/@mbostock/population-change-2017-2018
    legend (g,indic,color,text){
        let that = indic;

        //Setting width and height of canvas object
        let LOCATION = document.getElementById('legend-SVG')

        // Canvas width and height
        let padding = 20;
        let boundingRect = LOCATION.getBoundingClientRect()
        const width = boundingRect.width - padding;

        // Removes everything
        g.selectAll("image").remove();
        g.selectAll(".caption").remove();
        g.selectAll(".tick").remove();

        //Sets tick count
        let tick_count = 4;

        g.attr('width',width)
        
        g.append("image")
            .attr("width", width)
            .attr("height", 10)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", that.ramp(color.interpolator()).toDataURL());
        
        g.append("text")
            .attr("class", "caption")
            .attr("y", -5)
            .attr("x", 10)
            .attr("text-anchor", "start")
            // .text((text=="node") ? 'node mean' : 'edge mean')
            .text((text=="link-std") ? 'edge std' : (text=="node-std") ? 'node std' : (text=="node") ? 'node mean' : 'edge mean');
        // console.log(color.domain())

        g.call(d3.axisBottom(d3.scaleLinear().domain(color.domain()).range([0,width]))
            .ticks(tick_count)
            .tickFormat(d => d.toFixed(2))
            // .tickFormat(d => (text=="eg") ? (`${d > 0 ? "" : ""}${Math.abs((d * factor).toFixed(0))}`) : (d.toFixed(0) == 3) ? `${d.toFixed(0)}+`:`${d.toFixed(0)}`)
            .tickSize(13))
          .select(".domain")
            .remove();
      }

    ramp(color, n = 512) {
        const {DOM, require} = new observablehq.Library;
        const canvas = DOM.canvas(n, 1); //This seems to be an issue
        const context = canvas.getContext("2d");
        canvas.style.margin = "0 -14px";
        canvas.style.width = "calc(100% + 28px)";
        canvas.style.height = "40px";
        canvas.style.imageRendering = "pixelated";
        for (let i = 0; i < n; ++i) {
          context.fillStyle = color(i / (n - 1));
          context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    // Spline on demand edge viz function
    // Takes myGraph object and scope as input 
    splineOD(myGraph,scope){
        let highlightLink = null;
        let clickedLink = [];
        let highlightNodes = [];

        myGraph
            .linkHoverPrecision(4) //May need to adjust based on network size
            // Sets link hover behavoir based on type
            .onLinkHover(link => {
                let that = this;
                highlightLink = link;
                // TODO: Add node highlighting
                highlightNodes = link ? [link.source, link.target] : [];
                //event()
                if (link){
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.infoboxRenderLink(link));
                }
                else{
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }
               
            })
            .onLinkClick(link => {
                //console.log(link)
                // checks if link already been clicked
                if (clickedLink.includes(link)){
                    let prevIdx = clickedLink.indexOf(link)
                    clickedLink.splice(prevIdx,1)
                }
                else{
                    clickedLink.push(link)
                }
                // console.log(link.mean,link.std)
            })
            .linkWidth(link => scope.linkMeanScale(link.mean))
            .linkColor(link => scope.linkColor(link.mean))
            .linkCanvasObjectMode(link => (link === highlightLink || clickedLink.includes(link)) ? 'replace': undefined)
            .linkCanvasObject((link, ctx) => {
                // This draws the links' uncertainty viz
                //console.log("in link canvas object")

                // Path node margin is how far out the edge uncertainty starts to taper
                const PATH_NODE_MARGIN = 5;
                // start and end coordinates
                const start = link.source;
                const end = link.target;

                // ignore unbound links
                if (typeof start !== 'object' || typeof end !== 'object') return;

                // calculate path midpoint
                const midPos = Object.assign(...['x', 'y'].map(c => ({
                    [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                })));
                //console.log(midPos.x)

                // Relative positioning along line
                const relLink = { x: end.x - start.x, y: end.y - start.y };

                // I need to calculate the positiong of the 2 outer-most path points
                let textAngle = Math.atan2(relLink.y, relLink.x);
                // Edge angle is separate to interpolate inner edge points
                let edgeAngle = textAngle;

                // Maintains orientation
                if (textAngle > 0) textAngle = (Math.PI - textAngle);
                if (textAngle < 0) textAngle = (-Math.PI - textAngle);

                // Set this to change the scaling of uncertainty vis
                const perc = link.std/link.mean;
                const mean_val = scope.meanScaleSpline(link.mean);
                const std_val = mean_val*perc;

                let x_prime = Math.sin(textAngle)*mean_val;
                let y_prime = Math.cos(textAngle)*mean_val;
                let xs_prime = Math.sin(textAngle)*(mean_val+std_val);
                let ys_prime = Math.cos(textAngle)*(mean_val+std_val);

                // Calculating points that are in from the edges
                let xe_prime = Math.cos(edgeAngle)*PATH_NODE_MARGIN;
                let ye_prime = Math.sin(edgeAngle)*PATH_NODE_MARGIN;

                //line data for the mean shape
                let mean_data = [
                    [start.x , start.y ], // point at the end
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [midPos.x + x_prime , midPos.y + y_prime ], // point orthogonal from midpoint
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ end.x , end.y ], // point at other end
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ midPos.x - x_prime , midPos.y - y_prime ], // other point orthogonal from midpoint
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [start.x , start.y ] // back to start
                ]

                let std_data = [
                    [start.x , start.y ], // point near the end 
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [midPos.x + xs_prime , midPos.y + ys_prime ], // point orthogonal from midpoint
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ end.x , end.y ], // other point near the end
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ midPos.x - xs_prime , midPos.y - ys_prime ], // other point orthogonal from midpoint
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [start.x , start.y ] // back to start
                ]

                // draw edge uncertainties
                ctx.save();

                //Retrieve color and adjust opacity
                let colorM = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.7})
                let colorStd = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.45});
                // can also explore # color.brighter([k]) <> https://github.com/d3/d3-color for std instead of opacity

                //Line for first std dev
                const lineStd = d3.line()
                    .curve(d3.curveBasisClosed); //good one
                //.curve(d3.curveCardinalClosed.tension(0)); //adjusting tension is cool
                //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineStd.context(ctx); // for canvas
                ctx.beginPath();
                lineStd(std_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorStd;
                //ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'red';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                //Line for mean
                const lineM = d3.line()
                    .curve(d3.curveBasisClosed); //good one
                // .curve(d3.curveCardinalClosed.tension(1)); //adjusting tension is cool
                    //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineM.context(ctx); // for canvas
                ctx.beginPath();
                lineM(mean_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorM
                // ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'rgba(46, 213, 197, 0.6)';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                ctx.restore();

                })
    }

    // Spline function that returns spline edge vis
    // myGraph object and scope variable as input
    spline(myGraph,scope){

        myGraph
            .linkHoverPrecision(4) //May need to adjust based on network size
            .linkWidth(link => scope.linkMeanScale(link.mean))
            .linkColor(link => scope.linkColor(link.mean))
            .onLinkHover(link => {
                let that = this;
                if (link){
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.infoboxRenderLink(link));
                }
                else{
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }

            })
            .linkCanvasObjectMode(() => 'replace')
            .linkCanvasObject((link, ctx) => {
                // This draws the links' uncertainty viz
                //console.log("in link canvas object")

                // Path node margin is how far out the edge uncertainty starts to taper
                const PATH_NODE_MARGIN = 5;
                // start and end coordinates
                const start = link.source;
                const end = link.target;

                // ignore unbound links
                if (typeof start !== 'object' || typeof end !== 'object') return;

                // calculate path midpoint
                const midPos = Object.assign(...['x', 'y'].map(c => ({
                    [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                })));
                //console.log(midPos.x)

                // Relative positioning along line
                const relLink = { x: end.x - start.x, y: end.y - start.y };

                // I need to calculate the positiong of the 2 outer-most path points
                let textAngle = Math.atan2(relLink.y, relLink.x);
                // Edge angle is separate to interpolate inner edge points
                let edgeAngle = textAngle;

                // Maintains orientation
                if (textAngle > 0) textAngle = (Math.PI - textAngle);
                if (textAngle < 0) textAngle = (-Math.PI - textAngle);

                // Set this to change the scaling of uncertainty vis
                const perc = link.std/link.mean;
                const mean_val = scope.meanScaleSpline(link.mean);
                const std_val = mean_val*perc;

                let x_prime = Math.sin(textAngle)*mean_val;
                let y_prime = Math.cos(textAngle)*mean_val;
                let xs_prime = Math.sin(textAngle)*(mean_val+std_val);
                let ys_prime = Math.cos(textAngle)*(mean_val+std_val);

                // Calculating points that are in from the edges
                let xe_prime = Math.cos(edgeAngle)*PATH_NODE_MARGIN;
                let ye_prime = Math.sin(edgeAngle)*PATH_NODE_MARGIN;

                //line data for the mean shape
                let mean_data = [
                    [start.x , start.y ], // point at the end
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [midPos.x + x_prime , midPos.y + y_prime ], // point orthogonal from midpoint
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ end.x , end.y ], // point at other end
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ midPos.x - x_prime , midPos.y - y_prime ], // other point orthogonal from midpoint
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [start.x , start.y ] // back to start
                ]

                let std_data = [
                    [start.x , start.y ], // point near the end 
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [midPos.x + xs_prime , midPos.y + ys_prime ], // point orthogonal from midpoint
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ end.x , end.y ], // other point near the end
                    [end.x - xe_prime, end.y - ye_prime], // point a certaing distance in from other end 
                    [ midPos.x - xs_prime , midPos.y - ys_prime ], // other point orthogonal from midpoint
                    [start.x + xe_prime, start.y + ye_prime], // point a certain distance in from the end
                    [start.x , start.y ] // back to start
                ]

                // draw edge uncertainties
                ctx.save();

                //Retrieve color and adjust opacity
                let colorM = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.7})
                let colorStd = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.45});
                // can also explore # color.brighter([k]) <> https://github.com/d3/d3-color for std instead of opacity

                //Line for first std dev
                const lineStd = d3.line()
                    .curve(d3.curveBasisClosed); //good one
                //.curve(d3.curveCardinalClosed.tension(0)); //adjusting tension is cool
                //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineStd.context(ctx); // for canvas
                ctx.beginPath();
                lineStd(std_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorStd;
                //ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'red';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                //Line for mean
                const lineM = d3.line()
                    .curve(d3.curveBasisClosed); //good one
                // .curve(d3.curveCardinalClosed.tension(1)); //adjusting tension is cool
                    //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineM.context(ctx); // for canvas
                ctx.beginPath();
                lineM(mean_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorM
                // ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'rgba(46, 213, 197, 0.6)';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                ctx.restore();

                })
    }


    // Square function that returns square edge vis
    // Input is myGraph object and scope variable
    square(myGraph,scope){

        myGraph
            .linkHoverPrecision(4) //May need to adjust based on network size
            .linkWidth(link => scope.linkMeanScale(link.mean))
            .linkColor(link => scope.linkColor(link.mean))
            .onLinkHover(link => {
                let that = this;
                if (link){
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.infoboxRenderLink(link));
                }
                else{
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }

            })
            .onLinkClick(link => console.log(link.std/link.mean,scope.linkMeanScale(link.mean)))
            .linkCanvasObjectMode(() => 'replace')
            .linkCanvasObject((link, ctx) => {
                // This draws the links' uncertainty viz
                //console.log("in link canvas object")

                // Path node margin is how far out the edge uncertainty starts to taper
                const PATH_NODE_MARGIN = 5;
                // start and end coordinates
                const start = link.source;
                const end = link.target;

                // ignore unbound links
                if (typeof start !== 'object' || typeof end !== 'object') return;

                // calculate path midpoint
                const midPos = Object.assign(...['x', 'y'].map(c => ({
                    [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
                })));
                //console.log(midPos.x)

                // Relative positioning along line
                const relLink = { x: end.x - start.x, y: end.y - start.y };

                // I need to calculate the positiong of the 2 outer-most path points
                let textAngle = Math.atan2(relLink.y, relLink.x);
                // Edge angle is separate to interpolate inner edge points
                let edgeAngle = textAngle;

                // Maintains orientation
                if (textAngle > 0) textAngle = (Math.PI - textAngle);
                if (textAngle < 0) textAngle = (-Math.PI - textAngle);

                // Set this to change the scaling of uncertainty vis

                const perc = link.std/link.mean;
                const mean_val = scope.linkSquareScale(link.mean);
                const std_val = mean_val*perc;

                // Point orthogonal from midpoint
                let x_prime = Math.sin(textAngle)*mean_val;
                let y_prime = Math.cos(textAngle)*mean_val;
                let xs_prime = Math.sin(textAngle)*(mean_val+std_val);
                let ys_prime = Math.cos(textAngle)*(mean_val+std_val);


                // Calculating points that are in from the edges
                let xe_prime = Math.cos(edgeAngle)*PATH_NODE_MARGIN;
                let ye_prime = Math.sin(edgeAngle)*PATH_NODE_MARGIN;

                //line data for the mean shape
                let mean_data = [
                    [start.x , start.y ], // point at the end
                    [start.x + x_prime, start.y + y_prime], // SQUARE
                    [end.x + x_prime, end.y + y_prime], //SQAURE
                    [ end.x , end.y ], // point at other end
                    [end.x - x_prime, end.y - y_prime], //SQUARE
                    [start.x - x_prime, start.y - y_prime], //SQAURE
                    [start.x , start.y ] // back to start
                ]


                let std_data = [
                    [start.x , start.y ], // point at the end
                    [start.x + xs_prime, start.y + ys_prime], // SQUARE
                    [end.x + xs_prime, end.y + ys_prime], //SQAURE
                    [ end.x , end.y ], // point at other end
                    [end.x - xs_prime, end.y - ys_prime], //SQUARE
                    [start.x - xs_prime, start.y - ys_prime], //SQAURE
                    [start.x , start.y ] // back to start
                ]

                // draw edge uncertainties
                ctx.save();

                //Retrieve color and adjust opacity
                let colorM = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.7})
                let colorStd = d3.color(scope.linkColor(link.mean)).copy({opacity: 0.45});
                // can also explore # color.brighter([k]) <> https://github.com/d3/d3-color for std instead of opacity

                //Line for first std dev
                const lineStd = d3.line()
                    // .curve(d3.curveBasisClosed); //good one
                //.curve(d3.curveCardinalClosed.tension(0)); //adjusting tension is cool
                //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineStd.context(ctx); // for canvas
                ctx.beginPath();
                lineStd(std_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorStd;
                //ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'red';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                //Line for mean
                const lineM = d3.line()
                    // .curve(d3.curveBasisClosed); //good one
                // .curve(d3.curveCardinalClosed.tension(1)); //adjusting tension is cool
                    //.curve(d3.curveCatmullRomClosed.alpha(0.5));
                lineM.context(ctx); // for canvas
                ctx.beginPath();
                lineM(mean_data);
                ctx.lineWidth = 0.1
                ctx.fillStyle = colorM
                // ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'rgba(46, 213, 197, 0.6)';
                // ctx.shadowBlur = 100;
                ctx.fill();
                // ctx.stroke();

                ctx.restore();

            })

    }

    // Stdeviation only function that returns stdev only edge vis
    // Input is myGraph object and scope variable
    // stdevO(myGraph,scope){
    //     myGraph
    //         .linkHoverPrecision(4) //May need to adjust based on network size
    //         .linkWidth(link => scope.linkStdScale(link.std))
    //         .linkColor(link => scope.linkColorStd(link.std))
    //         .onLinkClick(link => console.log(link.std/link.mean,scope.linkMeanScale(link.mean),link))
    //         .onLinkHover(() =>console.log() )
    //         .linkCanvasObjectMode(() => undefined)
    //         .linkCanvasObject((link, ctx) => {});
           
    // }


    // NODE FUNCTIONS

    // Mean + stdeviation node styling
    mstdev(myGraph,scope,node_rel_size){
        let highlightNodes = [];

        myGraph
            .nodeRelSize(node_rel_size)
            .nodeVal(node => scope.meanScale(node.uncertainty_mean))
            .nodeLabel(node => node.id)
            .nodeColor(node => scope.color(node.uncertainty_mean))
            .onNodeClick(node => {
                
                console.log(node.uncertainty_std/node.uncertainty_mean,node.uncertainty_mean*(node.uncertainty_std/node.uncertainty_mean)+node.uncertainty_std,node,this.meanScale(node.uncertainty_mean))
            })
            .onNodeHover(node => {
                highlightNodes = node ? [node] : []
                
                let that = this
                // console.log(node)
                if (node){
                    // commented code below confirms my stdev calculations
                    // console.log(highlightNodes)
                    // this.myGraph.nodeColor(node => node === highlightNodes[0] ? '#00ff0000' : '#00ff0000');

                    // Need to select node with id that is node.cluster
                    let my_data = scope.reference.myGraph.graphData();
                    // console.log(my_data.nodes)
                    let da_node = my_data.nodes.filter(l => l.cluster == node.id); // extract node with correct id
                    // console.log("selected node",da_node)
                    this.reference.myGraph
                        .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': 'black');
                    
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.infoboxRender(node,da_node));

                    //Row highlighting
                    d3.select(`#row-${node.id}`).transition()
                        .duration(100)
                        .style('opacity',1);
                }
                else{
                    highlightNodes = []
                    // Need to reset da_node's color to what it was
                    scope.reference.myGraph
                        .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')
                        // .nodeColor( ref_node => 'black');
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);

                    //Row de-highlighting
                    d3.selectAll(`.row-back`).transition()
                        .duration(100)
                        .style('opacity',0);
                }

            })
            // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : this.color(node.uncertainty_mean))
            .nodeCanvasObjectMode(()=> 'before')
            .nodeCanvasObject((node, ctx) => {
                // Calculate radius for std
                //let stdSCALING = highlighTNodes.indexOf(node) !== -1 ? 4000 : 1000;
                let stdSCALING = 1;
                let NODE_R = 0;
                let halo_color = null;
                // Sets the red circle of defined size around node when highlighted
                if (highlightNodes.indexOf(node) !== -1){
                    NODE_R = 12;
                    halo_color = '#EA000080'
                }
                // Sets the stdev ring around node when not highlighted
                else{
                    // calculates percentage of node uncertainty over mean
                    let std_perc = Math.abs(node.uncertainty_std)/Math.abs(node.uncertainty_mean);
                    // calculates the radius of the node 
                    let mean_radius = Math.sqrt(scope.meanScale(node.uncertainty_mean))*node_rel_size;
                    // makes the stdev ring by adding the stdev to the mean radius 
                    let std_radius = (mean_radius*std_perc)*stdSCALING + mean_radius;
                    NODE_R = std_radius;
                    halo_color = d3.color(scope.color(node.uncertainty_mean)).copy({opacity: 0.45});
                }
                // add a halo for stdev
                ctx.beginPath();
                ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI, false);
                ctx.fillStyle = halo_color;
                ctx.fill();
            })
    }


    // Mean node styling
    nodeMean(myGraph,scope,node_rel_size){

        let highlightNodes = [];
        let that = this;

        myGraph
            .nodeRelSize(node_rel_size)
            .nodeVal(node => scope.meanScale(node.uncertainty_mean))
            .nodeLabel(node => node.id)
            .nodeColor(node => scope.color(node.uncertainty_mean))
            .onNodeClick(node => {
                console.log(node===highlightNodes[0])
                console.log(node.uncertainty_std/node.uncertainty_mean,node.uncertainty_mean*(node.uncertainty_std/node.uncertainty_mean)+node.uncertainty_std,node,this.meanScale(node.uncertainty_mean))
            })
            .onNodeHover(node => {
                highlightNodes = node ? [node] : []

                // console.log(node)
                if (node){
                    // Need to select node with id that is node.cluster
                    let my_data = scope.reference.myGraph.graphData();
                    // console.log(my_data.nodes)
                    let da_node = my_data.nodes.filter(l => l.cluster == node.id); // extract node with correct id
                    // console.log("selected node",da_node)
                    this.reference.myGraph
                        .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': 'black');

                    // INFOBOX 
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.infoboxRender(node,da_node));

                    //Row highlighting
                    d3.select(`#row-${node.id}`).transition()
                        .duration(100)
                        .style('opacity',1);

                }
                else{
                    highlightNodes = []
                    // Need to reset da_node's color to what it was
                    scope.reference.myGraph
                        .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')
                        // .nodeColor( ref_node => 'black');
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);

                    //Row de-highlighting
                    d3.selectAll(`.row-back`).transition()
                        .duration(100)
                        .style('opacity',0);
                }

            })
            // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : this.color(node.uncertainty_mean))
            .nodeCanvasObjectMode(() => 'before')
            .nodeCanvasObject((node, ctx) => {
                let NODE_R = 0;
                let halo_color = null;
                if (highlightNodes.indexOf(node) !== -1){
                    NODE_R = 12;
                    halo_color = '#EA000080'
                }
                ctx.beginPath();
                ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI, false);
                ctx.fillStyle = halo_color;
                ctx.fill();
            })

    }

    // // Std node styling
    // nodeStd(myGraph,scope,node_rel_size){

    //     let highlightNodes = [];

    //     myGraph
    //         .nodeRelSize(node_rel_size)
    //         .nodeVal(node => scope.nodeStdScale(node.uncertainty_std))
    //         .nodeLabel(node => node.id)
    //         .nodeColor(node => scope.stdColor(node.uncertainty_std))
    //         .onNodeClick(node => {
    //             console.log(node===highlightNodes[0])
    //             console.log(node.uncertainty_std/node.uncertainty_mean,node.uncertainty_mean*(node.uncertainty_std/node.uncertainty_mean)+node.uncertainty_std,node,this.meanScale(node.uncertainty_mean))
    //         })
    //         .onNodeHover(node => {
    //             highlightNodes = node ? [node] : []

    //             // console.log(node)
    //             if (node){
    //                 // Need to select node with id that is node.cluster
    //                 let my_data = scope.reference.myGraph.graphData();
    //                 // console.log(my_data.nodes)
    //                 let da_node = my_data.nodes.filter(l => l.cluster == node.id); // extract node with correct id
    //                 // console.log("selected node",da_node)
    //                 this.reference.myGraph
    //                     .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': 'black');
    //             }
    //             else{
    //                 highlightNodes = []
    //                 // Need to reset da_node's color to what it was
    //                 scope.reference.myGraph
    //                     .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')
    //                     // .nodeColor( ref_node => 'black');
    //             }

    //         })
    //         // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : this.color(node.uncertainty_mean))
    //         .nodeCanvasObjectMode(() => 'before')
    //         .nodeCanvasObject((node, ctx) => {
    //             let NODE_R = 0;
    //             let halo_color = null;
    //             if (highlightNodes.indexOf(node) !== -1){
    //                 NODE_R = 12;
    //                 halo_color = '#EA000080'
    //             }
    //             ctx.beginPath();
    //             ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI, false);
    //             ctx.fillStyle = halo_color;
    //             ctx.fill();
    //         })



    // }

    /**
     * Returns info for infobox
     * @param data
     * @returns {string}
     */
    infoboxRender(node_data,ref_data) {
        // console.log(node_data,ref_data)
        let that = this;
        let text = null;
        text = "<h3>" + node_data.id + "</h3>";
        text = text + "<p> weight: " + node_data.weight + "</p>";
        text = text + "<p> mean: " + node_data.uncertainty_mean.toFixed(4) + "</p>";
        text = text + "<p> stdev: " + node_data.uncertainty_std.toFixed(4) + "</p>";
        // //Adds in relevant data
        // text = text + `<p style="color:${((data.r_eg > data.d_eg) ? '#DB090C' : '#2F88ED')}"> EG: ` + ((data.r_eg > data.d_eg) ? (data.r_eg*100).toFixed(2)+'%' : (data.d_eg*100).toFixed(2)+'%');
        // text = text + "<p> LE: "+ data.le.toFixed(2)+"</p>";
        // //console.log(text)
        return text;

    }

    /**
     * Returns info for infobox
     * @param data
     * @returns {string}
     */
    infoboxRenderLink(link) {
        // console.log(link)
        let that = this;
        let text = null;
        text = "<h3>" + link.source.id + "&#8212;" + link.target.id + "</h3>";
        text = text + "<p> weight: " + link.weight + "</p>";
        text = text + "<p> mean: " + link.mean.toFixed(4) + "</p>";
        text = text + "<p> stdev: " + link.std.toFixed(4) + "</p>";
        return text;

    }

    /**
     * Returns info for infobox
     * @param data
     * @returns {string}
     */
    infoboxRenderOrig(node,sparse) {
        // console.log(node)
        let that = this;
        let text = null;
        text = "<h3>" + node.id + "</h3>";
        if (sparse!=true){
            text = text + "<p> clusters to: " + node.cluster + "</p>";
        }
        return text;

    }





}