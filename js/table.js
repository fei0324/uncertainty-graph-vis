/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(data,full_ref,proc_ref,data_name,uncert,k,active_alg,unif_spars=false){
        // Set data variable
        this.data = data;
        this.data_name = data_name;
        this.uncert = uncert;
        this.k = k;
        this.active_alg = active_alg;
        this.unif_spars = unif_spars;
        this.coOccur = false;

        //Used for co-occurence linked highlighting
        this.row_num = null;
        this.col_num = null;
        this.coords = null;

        // Setting scaling variable
        this.scale = null;

        // Making a universal color for mini-graph and heatmap
        this.node_Color = d3.interpolateViridis;
        this.link_Color = d3.interpolate("#c9c9c9", "#666666");

        //This is the varible for the node and link scaling
        this.nodeScale = null;
        this.linkScale = null;

        //Setting references
        this.full_ref = full_ref;
        this.proc_ref = proc_ref;
        this.instance_ref = null;

        // Creating force graph
        this.myGraph = ForceGraph();

        //Setting width and height of canvas object
        this.LOCATION = document.getElementById('graph-mini')

        // Canvas width and height
        let boundingRect = this.LOCATION.getBoundingClientRect()
        // console.log('graph mini rect',boundingRect)
        this.WIDTH = boundingRect.width - 7;
        this.HEIGHT = boundingRect.height - 8;
        // console.log('graph mini dims',this.WIDTH,this.HEIGHT)
        
        this.myGraph(this.LOCATION)
                    .width(this.WIDTH)
                    .height(this.HEIGHT)
                    .nodeColor(() => "black");


        //Margins for table cells- the bostock way
        this.margin = {top: 0, right: 10, bottom: 0, left: 10};
        this.width = 150 - this.margin.left - this.margin.right;
        this.height = 30 - this.margin.top-this.margin.bottom;


    }

    createHeatMap(){

        /** Creates heat map **/
        let data = this.data
        // console.log("heatmap data",data)
        

        // // Different color schemes
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


        //Setting width and height of canvas object
        let LOCATION = document.getElementById('heatmap')

        // SVG width and height
        let boundingRect = LOCATION.getBoundingClientRect()
        let WIDTH = boundingRect.width;
        let HEIGHT = boundingRect.height;
        let margin = {top: 10, right: 10, bottom: 10, left: 10};
        // For matrix 
        let width = WIDTH - margin.left - margin.right
        let height = HEIGHT - margin.top - margin.bottom

        let svg = d3.select("#heatmap").append("svg")
                .attr("width", WIDTH)
                .attr("height", HEIGHT)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height);


        // Data scales and such
        let y = d3.scaleBand().range([0, height]).domain(d3.range(data.length));
        let x = d3.scaleBand().range([0, width]).domain(d3.range(data.columns.length));
        // let x = d3.scale.ordinal().rangeBands([0,  WIDTH - margin.left - margin.right]),
            // z = d3.scale.linear().domain([0, 4]).clamp(true),
            // c = d3.scale.category10().domain(d3.range(10));

        let data_values = this.data.map( d => Object.values(d) );
        // console.log("data values",data_values)
        let mat_values = new Array()
        for (let elem of data_values){
            for (let i of elem){
                // console.log(i)
                // console.log(parseFloat(i).toFixed(5));
                mat_values = mat_values.concat(parseFloat(i).toFixed(5))
            }
        }
        // console.log('my mat',mat_values)
        // console.log(d3.extent(mat_values))

        let color = null;
        let link_color = null;
        if (this.unif_spars==true){
            // color = d3.scaleSequential(viridis).domain(d3.extent(mat_values));
            color = d3.scaleSequential(this.node_Color).domain(this.nodeScale);
        }
        else if (this.coOccur == true){
            color = d3.scaleSequential(this.node_Color).domain(this.nodeScale);
            link_color = d3.scaleSequential(this.link_Color).domain(this.linkScale);

        }
        else{
            // color = d3.scaleSequential(viridis).domain(d3.extent(mat_values)); //usually blue
            color = d3.scaleSequential(this.node_Color).domain(this.nodeScale); //usually blue
        }
        
        // Make rows
        let row = svg.selectAll(".row")
            .data(data)
        .enter().append("g")
            .attr("id", (d,i) => `row-g-${i}`)
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
            .on("mouseover", (d,i) => mouseoverRow(d,i))
            .on("mouseout", (d,i) => mouseoutRow(d,i));

        row.append('rect')
            .attr('class','row-back')
            .attr('id',(d,i) => `row-${i}`)
            .attr('width',WIDTH)
            .attr('height',y.bandwidth()+5)
            .attr('rx','10px')
            .attr('ry','10px')
            .attr("transform", function(d, i) { return "translate(-10,"+ -3.5 + ")"; });
            

        
        let squares = row.selectAll(".cell")
            .data(function(d,i){
                return Object.values(d).map(d => [d,i]);
                // return Object.values(d);
            })
        .enter().append("rect")
            .attr("class", (d,i) => `cell-${i}`)
            .attr("id",(d,i,scope) => `${i}`)
            // .attr("y", function(d,i) {return y(i)})
            .attr("x", (d,i) => x(i))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth()-2)
            .attr("fill", (d,i,scope) => {
                if (this.coOccur == false){
                    return color(d[0])
                    // return color(d)
                }
                else{
                    // means we're at a node
                    // return color(d)
                    if (i==d[1]){
                        return color(d[0])
                    }
                    // means we're at a link
                    else{
                        return link_color(d[0])
                    }
                }
                
            })
            .on("mouseover", mouseoverCell)
            .on("mouseout", mouseoutCell)
            .on('click', mouseClick);

        let that = this;

        function mouseoverRow(r,i){
            // console.log("in row",i)
            // console.log(that.proc_ref)

            if (that.unif_spars == true){

                //Row highlighting
                d3.select(`#row-${i}`).transition()
                .duration(100)
                .style('opacity',1);

            }
            else if (that.coOccur == true){
                // console.log("ON ROW:",i)
                // that.row_num = i;



            }
            else{
                // PROCESSED HIGHLIGHTING
                // console.log("ON ROW",i)
                // Need to select node with id that is node.cluster
                let active_node_vis = $('#nodeDrop').find('.active')[0].id
                if (active_node_vis == 'std-color'){
                    let my_data = that.proc_ref.myGraph.graphData();
                    // console.log(my_data.nodes)
                    let da_node = my_data.nodes.filter(l => l.id == i); // extract node with correct id
                    // console.log("selected node",da_node)
                    that.proc_ref.myGraph
                        .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.proc_ref.stdColor(ref_node.uncertainty_std));
    
                    // FULL HIGHLIGHTING
                    // Need to select node with id that is node.cluster
                    let my_full_data = that.full_ref.myGraph.graphData();
                    let da_nodes = my_full_data.nodes.filter(l => l.cluster == i); // extract node with correct id
                    that.full_ref.myGraph
                        .nodeColor( ref_node => da_nodes.indexOf(ref_node) !== -1 ? '#EA0000': 'black');
    
                    // INFOBOX
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.proc_ref.infoboxRender(da_node[0],null));
    
    
                    //Row highlighting
                    d3.select(`#row-${i}`).transition()
                        .duration(100)
                        .style('opacity',1);

                }
                else{
                    let my_data = that.proc_ref.myGraph.graphData();
                    // console.log(my_data.nodes)
                    let da_node = my_data.nodes.filter(l => l.id == i); // extract node with correct id
                    // console.log("selected node",da_node)
                    that.proc_ref.myGraph
                        .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.proc_ref.color(ref_node.uncertainty_mean));
    
                    // FULL HIGHLIGHTING
                    // Need to select node with id that is node.cluster
                    let my_full_data = that.full_ref.myGraph.graphData();
                    let da_nodes = my_full_data.nodes.filter(l => l.cluster == i); // extract node with correct id
                    that.full_ref.myGraph
                        .nodeColor( ref_node => da_nodes.indexOf(ref_node) !== -1 ? '#EA0000': 'black');
    
                    // INFOBOX
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.proc_ref.infoboxRender(da_node[0],null));
    
    
                    //Row highlighting
                    d3.select(`#row-${i}`).transition()
                        .duration(100)
                        .style('opacity',1);

                }
               
            }


        }

        function mouseoutRow(r,i) {
            

            if (that.unif_spars == true){

                //Row de-highlighting
                d3.select(`#row-${i}`).transition()
                    .duration(100)
                    .style('opacity',0);

            }
            else if (that.coOccur == true){
                // that.row_num = i;


            }
            else{
                let active_node_vis = $('#nodeDrop').find('.active')[0].id
                if (active_node_vis == 'std-color'){
                    // PROCESSED DE-HIGHLIGHTING
                    that.proc_ref.myGraph
                    .nodeColor( ref_node => that.proc_ref.stdColor(ref_node.uncertainty_std));

                    // FULL DE- HIGHLIGHTING
                    let highlightNodes = []
                    // Need to reset da_node's color to what it was
                    that.full_ref.myGraph
                    .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')

                    //INFOBOX 
                    d3.select(`#infobox-graph-processed`).transition()
                    .duration(200)
                    .style("opacity", 0);

                    //Row de-highlighting
                    d3.select(`#row-${i}`).transition()
                    .duration(100)
                    .style('opacity',0);


                }
                else{
                    // PROCESSED DE-HIGHLIGHTING
                    that.proc_ref.myGraph
                    .nodeColor( ref_node => that.proc_ref.color(ref_node.uncertainty_mean));

                    // FULL DE- HIGHLIGHTING
                    let highlightNodes = []
                    // Need to reset da_node's color to what it was
                    that.full_ref.myGraph
                    .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')

                    //INFOBOX 
                    d3.select(`#infobox-graph-processed`).transition()
                    .duration(200)
                    .style("opacity", 0);

                    //Row de-highlighting
                    d3.select(`#row-${i}`).transition()
                    .duration(100)
                    .style('opacity',0);

                }
                
            }
            
        }

        function mouseoverCell(c,i) {


            if (that.unif_spars == true){
                // Highlight column
                d3.selectAll(`.cell-${i}`).attr('fill','orange')

                d3.select(`#infobox-graph-orig`).transition()
                    .duration(200)
                    .style("opacity", 1);
                d3.select(`#infobox-graph-orig`).html(that.infoboxRenderSpars(c,i)); 
            }
            else if (that.coOccur == true){

                // I need someway to display row and column
                // console.log("ON CELL",d3.select(this).node().id)
                // console.log(that.row_num)
                // TODO, can't simply slice here, need to get the whole number
                let num_row = parseInt(d3.select(this.parentNode).node().id.match(/\d+/g))
                let coords = [num_row,parseInt(d3.select(this).node().id)]
                // console.log("COORDS:",coords)

                let my_data = that.proc_ref.myGraph.graphData();
                // Highlight the corresponding node OR edge of the q graph
                // HIGHLIGHT NODE
                if (coords[0] == coords[1]){
                    // console.log("highlight node")
                    
                    // console.log(my_data.nodes)
                    let da_node = my_data.nodes.filter(l => l.id == coords[0]); // extract node with correct id
                    // console.log("selected node",da_node)
                    that.proc_ref.myGraph
                        .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.proc_ref.qColorScale(ref_node['stability:']));

                    // HIGHLIGHT individual instance graph nodes
                    that.instance_ref.myGraph   
                        .nodeColor( ref_node => da_node[0].id == ref_node.id ? '#EA0000': 'black');

                    // INFOBOX
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.proc_ref.infoboxQRender(da_node[0],null));


                }
                // HIGHLIGHT EDGES
                else{
                    // console.log("highlight edge")
                    // console.log(my_data.edges)
                    let da_edge = my_data.edges.filter(l => (l.source.id == coords[0] && l.target.id == coords[1]) || (l.source.id == coords[1] && l.target.id == coords[0])); // extract node with correct id
                    // console.log("selected edge",da_edge)
                    that.proc_ref.myGraph
                        .linkWidth(ref_node => da_edge.indexOf(ref_node) !== -1 ? 7: that.proc_ref.qLinkWidth(ref_node['instability']))
                        .linkColor( ref_node => da_edge.indexOf(ref_node) !== -1 ? '#EA0000': d3.color(that.proc_ref.qLinkColor(ref_node['instability'])).copy({opacity:0.65}));

                    // INFOBOX
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(that.proc_ref.infoboxRenderQLink(da_edge[0],null));

                }



                // d3.select(this).attr('fill','orange')
                d3.select(this).attr('stroke-width','5px')
                    .attr("stroke-opacity","0.7")
                    .attr("stroke","orange");

                

                
            }
            else{
                // tooltip showing run and value, using graph-orig becasue it's made automatically and not used for anything else
                // Highlight column
                d3.selectAll(`.cell-${i}`).attr('fill','orange')

                // INFOBOX
                d3.select(`#infobox-graph-orig`).transition()
                    .duration(200)
                    .style("opacity", 1);
                d3.select(`#infobox-graph-orig`).html(that.infoboxRender(c,i));     
            }
    

        }

        function mouseoutCell(d,i) {

            if (that.unif_spars == true){
                d3.selectAll(`.cell-${i}`).attr('fill',(d) => color(d[0]))

                let highlighted = d3.selectAll('.highlighted')._groups[0][0];
                // Keeps info up if something's been clicked 
                // console.log(highlighted)
                if(highlighted){
                    d3.select(`#infobox-graph-orig`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-orig`).html(that.infoboxRenderSpars(highlighted.__data__,highlighted.id));
                }
                else{
                    //INFOBOX 
                    d3.select(`#infobox-graph-orig`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }


            }
            else if (that.coOccur == true){

                // d3.select(this).attr('fill',(d) => color(d));
                d3.select(this)
                    .attr('stroke-width','0px')
                    .attr('stroke-opacity',"0");

                // DE HIHGLIGHT NODES & EDGES
                // PROCESSED DE-HIGHLIGHTING
                that.proc_ref.myGraph
                    .nodeColor( ref_node => that.proc_ref.qColorScale(ref_node['stability:']))
                    .linkColor( d => d3.color(that.proc_ref.qLinkColor(d['instability'])).copy({opacity:0.65}) )
                    .linkWidth( d => that.proc_ref.qLinkWidth(d['instability']));

                // HIGHLIGHT individual instance graph nodes
                that.instance_ref.myGraph   
                    .nodeColor( () => "black");

                //INFOBOX 
                d3.select(`#infobox-graph-processed`).transition()
                    .duration(200)
                    .style("opacity", 0);

                





                
            }
            else{
                // d3.select(this).attr('fill', (d) => color(d))
                // Highlight column
                d3.selectAll(`.cell-${i}`).attr('fill',(d) => color(d[0]))

                let highlighted = d3.selectAll('.highlighted')._groups[0][0];
                // Keeps info up if something's been clicked 
                // console.log(highlighted)
                if(highlighted){
                    d3.select(`#infobox-graph-orig`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-orig`).html(that.infoboxRender(highlighted.__data__,highlighted.id));
                }
                else{
                    //INFOBOX 
                    d3.select(`#infobox-graph-orig`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }
            }

        }

        function mouseClick(c,i){

            // Loading data and plotting graph
            that.myGraph.nodeVisibility(true)
            that.myGraph.linkVisibility(true)
            // console.log(" in mouse click",that.data_name,that.k,that.uncert,that.active_alg,i)
            if (that.unif_spars == true){
                // console.log("in unif spars load")
                d3.json(`data/unifying_framework_sparsify/${that.data_name}/${that.data_name}_${that.k}/individual_instances/${that.data_name}_${that.k}_${i}.json`).then(my_data => {
                    
                    // console.log(my_data)

                    // scales
                    // //finding max and min of mean for link weights and means 
                    let avg_arrayNW = my_data.nodes.map( d => d.weight );
                    let nodeRange = d3.extent(avg_arrayNW)

                    //finding max and min of mean for link weights and means 
                    let avg_arrayLW = my_data.links.map( d => d.weight );
                    let linkRange = d3.extent(avg_arrayLW)

                    // let link_color = cool;
                    // let node_color = viridis; //blue
                    // console.log(this.proc_ref.node_Color)

                    // Color scales
                    let linkColor = d3.scaleSequential(that.proc_ref.link_Color).domain(d3.extent(avg_arrayLW));
                    let nodeColor = d3.scaleSequential(that.proc_ref.node_Color).domain(d3.extent(avg_arrayNW));

                    // Width and size scales
                    let linkScale = d3.scaleLinear().domain(d3.extent(avg_arrayLW)).range([1,8]);
                    let nodeScale = d3.scaleLinear().domain(d3.extent(avg_arrayNW)).range([1,4]);

                    that.myGraph
                        .graphData(my_data)
                        .nodeVal(d => nodeScale(d.weight))
                        .nodeColor(d => 'black')
                        .linkWidth( d => linkScale(d.weight))
                        .linkColor(d => linkColor(d.weight));

                });

            }
            else if (that.coOccur == true){





                
            }
            else{
                d3.json(`data/${that.active_alg}/${that.data_name}/cluster_${that.k}/${that.uncert}/individual_instances/clustered_graph_${i}.json`).then(my_data => {
                    // LOL - need to rename 'edges' to 'links'
                    my_data['links'] = my_data['edges'];
                    // console.log("clicked data",c,i)
                    // Access data in column
                    // Highlight column
                    // console.log(d3.selectAll(`.cell-${i}`).nodes().map( m => m.__data__));
                    
                    // Retrieves column data for coloring of nodes 
                    let nodeColoring = d3.selectAll(`.cell-${i}`).nodes().map( m => m.__data__)
                    // console.log("here",color(parseFloat(nodeColoring[0])),color(parseFloat(nodeColoring[1])))

                    // scales
                    // //finding max and min of mean for link weights and means 
                    let avg_arrayNW = my_data.nodes.map( d => d.weight );
                    let nodeRange = d3.extent(avg_arrayNW)

                    //finding max and min of mean for link weights and means 
                    let avg_arrayLW = my_data.links.map( d => d.weight );
                    let linkRange = d3.extent(avg_arrayLW)

                    // let link_color = cool;
                    // let node_color = viridis; //blue

                    // Color scales
                    let linkColor = d3.scaleSequential(that.proc_ref.link_Color).domain(d3.extent(avg_arrayLW));
                    let nodeColor = d3.scaleSequential(that.proc_ref.node_Color).domain(d3.extent(avg_arrayNW));

                    // Width and size scales
                    let linkScale = d3.scaleLinear().domain(d3.extent(avg_arrayLW)).range([1,8]);
                    let nodeScale = d3.scaleLinear().domain(d3.extent(avg_arrayNW)).range([1,5]);

                    that.myGraph
                        .graphData(my_data)
                        .nodeVal(d => nodeScale(d.weight))
                        // .nodeColor(d => nodeColor(d.weight))
                        .nodeColor(d => color(parseFloat(nodeColoring[d.id])))
                        .linkWidth( d => linkScale(d.weight))
                        .linkColor(d => linkColor(d.weight));

                });
            }

            // If already selected it, then clears selection and removes graph
            // console.log(" highlighted",d3.select('.highlighted')._groups[0][0])
            // console.log(this.id)
            
            if(d3.select('.highlighted')._groups[0][0] == null){
                // Selects previously highlighted and changes color back and reclasses it
                d3.selectAll('.highlighted').style('fill',d => color(d))
                d3.selectAll('.highlighted').classed("highlighted",false)
                // Highlights newly selected
                d3.selectAll(`.cell-${i}`).attr('fill','orange').classed("highlighted",true).style('fill','orange')
            }
            else if (d3.select('.highlighted')._groups[0][0].id == this.id){
                // Selects previously highlighted and changes color back and reclasses it
                d3.selectAll('.highlighted').style('fill',d => color(d))
                d3.selectAll('.highlighted').classed("highlighted",false)
                // clearing graph
                that.myGraph.nodeVisibility(false)
                that.myGraph.linkVisibility(false)
            }
            else if (d3.select('.highlighted')._groups[0][0].id != this.id){
                // Selects previously highlighted and changes color back and reclasses it
                d3.selectAll('.highlighted').style('fill',d => color(d))
                d3.selectAll('.highlighted').classed("highlighted",false)
                // Highlights newly selected
                d3.selectAll(`.cell-${i}`).attr('fill','orange').classed("highlighted",true).style('fill','orange')
            }

        }


        /////////////// GRAPH STUFF //////////////////
        this.myGraph
            .onNodeHover(node => {
                // let highlightNodes = node ? [node] : []

                if (that.unif_spars==true){
                    if (node){
                        let i = node;
                        // PROCESSED HIGHLIGHTING
                        // Need to select node with id that is node.cluster
                        let my_data = that.proc_ref.myGraph.graphData();
                        // console.log(my_data.nodes)
                        let da_node = my_data.nodes.filter(l => l.id == i.id); // extract node with correct id
                        // console.log("selected node",da_node)
                        that.proc_ref.myGraph
                            .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': 'black'); 
                        // INFOBOX
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select(`#infobox-graph-processed`).html(this.infoboxRenderInstance(node,null)); 

                    }
                    else{
                        // PROCESSED DE-HIGHLIGHTING
                        that.proc_ref.myGraph
                            .nodeColor( ref_node => 'black');

                        //INFOBOX 
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 0);
                    }

                }
                else{
                    // console.log(node)
                    if (node){
                        let i = node;
                        // console.log(node)
                        // PROCESSED HIGHLIGHTING
                        // Need to select node with id that is node.cluster
                        let my_data = that.proc_ref.myGraph.graphData();
                        // console.log(my_data.nodes)
                        let da_node = my_data.nodes.filter(l => l.id == i.id); // extract node with correct id
                        // console.log("selected node",da_node)
                        that.proc_ref.myGraph
                            .nodeColor( ref_node => da_node.indexOf(ref_node) !== -1 ? '#EA0000': that.proc_ref.color(ref_node.uncertainty_mean));

                        // FULL HIGHLIGHTING
                        // Need to select node with id that is node.cluster
                        let my_full_data = that.full_ref.myGraph.graphData();
                        let da_nodes = my_full_data.nodes.filter(l => l.cluster == i.id); // extract node with correct id
                        that.full_ref.myGraph
                            .nodeColor( ref_node => da_nodes.indexOf(ref_node) !== -1 ? '#EA0000': 'black');

                        // INFOBOX
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 1);
                        d3.select(`#infobox-graph-processed`).html(this.infoboxRenderInstance(node,null));


                        //Row highlighting
                        d3.select(`#row-${i.id}`).transition()
                            .duration(100)
                            .style('opacity',1);

                    }
                    else{
                        // PROCESSED DE-HIGHLIGHTING
                        that.proc_ref.myGraph
                            .nodeColor( ref_node => that.proc_ref.color(ref_node.uncertainty_mean));

                        // FULL DE- HIGHLIGHTING
                        let highlightNodes = []
                        // Need to reset da_node's color to what it was
                        that.full_ref.myGraph
                            .nodeColor(ref_node => ref_node === highlightNodes ? '#EA0000' : 'black')

                        //INFOBOX 
                        d3.select(`#infobox-graph-processed`).transition()
                            .duration(200)
                            .style("opacity", 0);

                        //Row de-highlighting
                        d3.selectAll(`.row-back`).transition()
                            .duration(100)
                            .style('opacity',0);

                    }

                }
                

            })
            .onLinkHover(link => {
                if (link){
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 1);
                    d3.select(`#infobox-graph-processed`).html(this.infoboxRenderLink(link));
                }
                else{
                    d3.select(`#infobox-graph-processed`).transition()
                        .duration(200)
                        .style("opacity", 0);
                }

            })
        
    }

    removeHeatMap(){
        /** Clears existing heat map**/
        
        d3.select("#heatmap").select("svg").remove()


    }

    infoboxRender(value,i){
        let that = this;
        let text = null;
        text = "<p> <b> run number: </b>" + i + " &emsp; <b> node uncertainty value: </b>" + parseFloat(value).toFixed(4) + "</p>";
        // text = text + "<p> node uncertainty value: " + parseFloat(value).toFixed(4) + "</p>";
        return text;

    }

    infoboxRenderSpars(value,i){
        let that = this;
        let text = null;
        text = "<h3> instance number: " + i + "</h3>";
        return text;

    }

    infoboxRenderInstance(node){
        let that = this;
        let text = null;
        text = "<h3> node: " + node.id + "</h3>";
        text = text + "<p> node weight: " + parseFloat(node.weight).toFixed(4) + "</p>";
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
        text = text + "<p> weight: " + parseFloat(link.weight).toFixed(4) + "</p>";
        return text;

    }

}