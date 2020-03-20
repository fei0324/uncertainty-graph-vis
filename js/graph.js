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
        console.log("Graph data:",this.data);

        //Creating forcegraph object
        this.myGraph = ForceGraph();

        // Creating scales

        //Scales for sparsification
        if (this.type == 'spars'){
            //finding max and min of mean for links 
            let avg_array = this.data.links.map( d => d.average);
            let maxMeanL = d3.max(avg_array);
            let minMeanL = d3.min(avg_array);
            let medMeanL = d3.median(avg_array)
            console.log("max:",maxMeanL,"min:",minMeanL,"median:",medMeanL)

            //Color scale for means of links
            //Experimenting by making the median the diverging point, if this doesn't work, could change to mean
            //this.color = d3.scaleDiverging([minMean, medMean, maxMean], d3.interpolateRdBu);
            this.color = d3.scaleSequential(d3.interpolateViridis).domain([minMeanL,maxMeanL]);
        
            // linear scale for mean of links
            // may need to find way to adjust range automatically based on network size
            this.meanScale = d3.scaleLinear().domain([minMeanL,maxMeanL]).range([1,5])
        }
        //Scales for clustering
        else if (this.type == 'clust'){
            //finding max and min of mean for nodes
            let avg_array = this.data.nodes.map( d => d.uncertainty_mean );
            let maxMeanN = d3.max(avg_array);
            let minMeanN = d3.min(avg_array);
            let medMeanN = d3.median(avg_array)
            console.log("max:",maxMeanN,"min:",minMeanN,"median:",medMeanN)

            //Color scale for means of node
            //Experimenting by making the median the diverging point, if this doesn't work, could change to mean
            //this.color = d3.scaleDiverging([minMean, medMean, maxMean], d3.interpolateRdBu);
            this.color = d3.scaleSequential(d3.interpolateViridis).domain([minMeanN,maxMeanN]);
        
            // linear scale for mean of node
            // may need to find way to adjust range automatically based on network size
            this.meanScale = d3.scaleLinear().domain([minMeanN,maxMeanN]).range([1,5])

            //finding max and min of mean for link weights
            let avg_arrayLW = this.data.links.map( d => d.weight );
            let maxMeanLW = d3.max(avg_arrayLW);
            let minMeanLW = d3.min(avg_arrayLW);
            let medMeanLW = d3.median(avg_arrayLW)

            this.linkweightScale = d3.scaleLinear().domain([minMeanLW,maxMeanLW]).range([1,7])
        }

    
    }

    /**
     * Renders the graph
     * @param 
     */
    drawGraph(reference){

        let that = this;

        // Reference to other graph object
        this.reference = reference
        console.log(this.reference)

        // let myGraph = ForceGraph();
        let data = this.data;

        // TODO: See if I can incorporate gaussian blurring
        // TODO: Clear on background click
        // TODO: Add animations
        // TODO: Add infobox
        // TODO: implement zooming on node (or edge) 
            // Could be cool idea that when we click on a node, only the nodes neighbors are rendered
            // Same with links - look into if I can do this....
            // https://github.com/vasturiano/force-graph/blob/master/example/dynamic/index.html
        // TODO: implement drag and stay 
        // TODO: better color scheme + legend
        // TODO: Implement some functionality that checks to see what type of graph we're drawing 
        //      and adjusts things accordingly (i.e. not coloring original graph)
        // TODO: Implement linked views...think critical thing here is to have data available
        // TODO: Adjust the way I'm scaling stdev possibly?

        // For link highlighting
        let highlightLink = null;
        let clickedLink = [];
        let highlightNodes = [];

        //Location of canvas (parent div)
        let location = document.getElementById(this.location)

        // Canvas width and height
        let WIDTH = location.offsetWidth;//800;
        let HEIGHT = location.offsetHeight;//1000;
        // console.log(WIDTH,HEIGHT)

        // Graph for sparsification
        if (this.type == 'spars'){
            this.myGraph(location)
                .width(WIDTH)
                .height(HEIGHT)
                .graphData(data)
                .nodeRelSize(2)
                .nodeColor(() => "black")
                .nodeLabel(node => node.id)
                .linkHoverPrecision(4) //May need to adjust based on network size
                // Sets link hover behavoir based on type
                .onLinkHover(link => {
                    highlightLink = link;
                    // TODO: Add node highlighting
                    highlightNodes = link ? [link.source, link.target] : [];
                    //event()
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
                })
                // Draw width based on mean
                .linkWidth(link => this.meanScale(link.average))
                .linkColor(link => this.color(link.average))
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
                    // May need to have this automatically adjust based on network size
                    const scaling = 1

                    const mean_val = link.average * scaling;
                    const std_val = link.standard_deviation * scaling;
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
                    let colorM = d3.color(that.color(link.average)).copy({opacity: 0.7})
                    let colorStd = d3.color(that.color(link.average)).copy({opacity: 0.45});
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
                .zoom(3);
        }

        //This is the graph for node clustered data
        else if (this.type == 'clust'){
            console.log("node clustering")

            let node_rel_size = 4;
            this.myGraph(location)
                .graphData(data)
                .width(WIDTH)
                .height(HEIGHT)
                .nodeRelSize(node_rel_size)
                .nodeVal(node => this.meanScale(node.uncertainty_mean))
                .nodeLabel(node => node.id)
                .nodeColor(node => this.color(node.uncertainty_mean))
                .onNodeHover(node => {
                    highlightNodes = node ? [node] : []

                    // console.log(node)
                    if (node){
                        // Need to select node with id that is node.cluster
                        let my_data = this.reference.myGraph.graphData();
                        // console.log(my_data.nodes)
                        let da_node = my_data.nodes.filter(l => l.cluster == node.id); // extract node with correct id
                        // console.log("selected node",da_node)
                        this.reference.myGraph
                            .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': 'black');
                    }
                    else{
                        highlightNodes = []
                        // Need to reset da_node's color to what it was
                        this.reference.myGraph
                            .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')
                            // .nodeColor( ref_node => 'black');
                    }

                })
                // .nodeColor(node => highlightNodes.indexOf(node) !== -1 ? '#EA0000' : this.color(node.uncertainty_mean))
                .nodeCanvasObjectMode(()=> 'before')
                .nodeCanvasObject((node, ctx) => {
                    // Calculate radius for std
                    //let stdSCALING = highlightNodes.indexOf(node) !== -1 ? 4000 : 1000;
                    let stdSCALING = 1000;
                    let NODE_R = 0;
                    let halo_color = null;
                    if (highlightNodes.indexOf(node) !== -1){
                        NODE_R = 18;
                        halo_color = '#EA000080'
                    }
                    else{
                        NODE_R = Math.sqrt(this.meanScale(node.uncertainty_mean))*node_rel_size+node.uncertainty_std*stdSCALING;
                        halo_color = d3.color(this.color(node.uncertainty_mean)).copy({opacity: 0.45});
                    }
                    // add a halo for stdev
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, NODE_R, 0, 2 * Math.PI, false);
                    ctx.fillStyle = halo_color;
                    ctx.fill();
                })
                .linkWidth(link => this.linkweightScale(link.weight))
                .linkColor(() => '#878787')
                .zoom(4);


        }

        // This is the original, full, un-annotated graph
        else if (this.type == 'orig'){

            //TODO: when I highlight node here, it highlights corresoinding supercluster
            const NODE_R = 8;

            this.myGraph(location)
                .graphData(data)
                .width(WIDTH)
                .height(HEIGHT)
                .nodeRelSize(NODE_R)
                .nodeLabel(node => node.id)
                .nodeColor(()=> "black")
                .onNodeHover(node => {
                    highlightNodes = node ? [node] : [];

                    if (node){
                        // Need to select node with id that is node.cluster
                        let my_data = this.reference.myGraph.graphData();
                        // console.log(my_data.nodes)
                        let da_node = my_data.nodes.filter(l => l.id == node.cluster); // extract node with correct id
                        // console.log("selected node",da_node)
                        this.reference.myGraph
                            .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.reference.color(ref_node.uncertainty_mean));
                    }
                    else{
                        highlightNodes = []
                        // Need to reset da_node's color to what it was and ena
                        this.reference.myGraph
                            .nodeColor( ref_node => this.reference.color(ref_node.uncertainty_mean));
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
                .linkColor(() => '#878787')
                .zoom(1.5);
        }

    }



}