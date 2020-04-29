/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(data,full_ref,proc_ref){
        // Set data variable
        this.data = data;

        //Setting references
        this.full_ref = full_ref;
        this.proc_ref = proc_ref;

        // Creating force graph
        this.myGraph = ForceGraph();

        //Setting width and height of canvas object
        this.LOCATION = document.getElementById('graph-mini')

        // Canvas width and height
        let boundingRect = this.LOCATION.getBoundingClientRect()
        this.WIDTH = boundingRect.width;
        this.HEIGHT = boundingRect.height;

        this.myGraph(this.LOCATION)
                    .width(this.WIDTH)
                    .height(this.HEIGHT)
                    .nodeRelSize(4)
                    .nodeColor(() => "black");

        //Margins for table cells- the bostock way
        this.margin = {top: 0, right: 10, bottom: 0, left: 10};
        this.width = 150 - this.margin.left - this.margin.right;
        this.height = 30 - this.margin.top-this.margin.bottom;

        //Create scales for frequency and percentages
        //Want to set this to width of the svg
        this.freqScale = d3.scaleLinear().range([0,this.width]);
        //Want to set this to height of the svg group
        this.percAxScale = d3.scaleLinear().range([0,this.width]);
        this.percScale = d3.scaleLinear().range([2,this.width/2]);


        // I'm gonna make this an array of objects with keys and sorted values
        this.tableHeaders = [
            // {
            //     'key':"phrase",
            //     'sorted': false
            // },
            {
                'key':"nodes",
                'sorted': false
            },
            // {
            //     'key': "links",
            //     'sorted': false
            // },
            // {
            //     'key': "total",
            //     'sorted': false
            // }
        ];

    }

    createHeatMap(){
        /** Creates heat map **/
        let data = this.data
        // console.log("heatmap data",data)

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
        let mat_values = new Array()
        for (let elem of data_values){
            mat_values = mat_values.concat(elem)
        }
        let orange = d3.interpolateOranges
        let viridis = d3.interpolateViridis
        let blue = d3.interpolateBlues
        let color = d3.scaleSequential(blue).domain(d3.extent(mat_values));
        
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
            .data(function(d,i){return Object.values(d);})
        .enter().append("rect")
            .attr("class", (d,i) => `cell-${i}`)
            .attr("id",(d,i) => `${i}`)
            // .attr("y", function(d,i) {return y(i)})
            .attr("x", (d,i) => x(i))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth()-2)
            .attr("fill", d => color(d))
            .on("mouseover", mouseoverCell)
            .on("mouseout", mouseoutCell)
            .on('click', mouseClick);

        let that = this;

        function mouseoverRow(r,i){
            // console.log("in row",i)
            // console.log(that.proc_ref)


            // PROCESSED HIGHLIGHTING
            // Need to select node with id that is node.cluster
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

        function mouseoutRow(r,i) {

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

        function mouseoverCell(c,i) {

            // Highlight column
            d3.selectAll(`.cell-${i}`).attr('fill','orange')

            // tooltip showing run and value, using graph-orig becasue it's made automatically and not used for anything else
            // INFOBOX
            d3.select(`#infobox-graph-orig`).transition()
                .duration(200)
                .style("opacity", 1);
            d3.select(`#infobox-graph-orig`).html(that.infoboxRender(c,i));

            }

        function mouseoutCell(d,i) {

            // d3.select(this).attr('fill', (d) => color(d))
            // Highlight column
            d3.selectAll(`.cell-${i}`).attr('fill',(d) => color(d))

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

        function mouseClick(c,i){

            // Loading data and plotting graph
            that.myGraph.nodeVisibility(true)
            that.myGraph.linkVisibility(true)
            d3.json('data/small_net.json').then(data => {
                that.myGraph.graphData(data)
            })

            // If already selected it, then clears selection and removes graph
            if (d3.select('.highlighted')._groups[0][0] == this){
                // Selects previously highlighted and changes color back and reclasses it
                d3.selectAll('.highlighted').style('fill',d => color(d))
                d3.selectAll('.highlighted').classed("highlighted",false)
                // clearing graph
                that.myGraph.nodeVisibility(false)
                that.myGraph.linkVisibility(false)
            }
            else {
                // Selects previously highlighted and changes color back and reclasses it
                d3.selectAll('.highlighted').style('fill',d => color(d))
                d3.selectAll('.highlighted').classed("highlighted",false)
                // Highlights newly selected
                d3.selectAll(`.cell-${i}`).attr('fill','orange').classed("highlighted",true).style('fill','orange')
            }
            

        }
        

    }

    removeHeatMap(){
        /** Clears existing heat map**/
        
        d3.select("#heatmap").select("svg").remove()


    }

    infoboxRender(value,i){
        let that = this;
        let text = null;
        text = "<h3> run number: " + i+ "</h3>";
        text = text + "<p> node uncertainty value: " + parseFloat(value).toFixed(4) + "</p>";
        return text;

    }


}