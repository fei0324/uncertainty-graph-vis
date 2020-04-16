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
        console.log("heatmap data",data)

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
        let color = d3.scaleSequential(orange).domain(d3.extent(mat_values));
        
        // Make rows
        let row = svg.selectAll(".row")
            .data(data)
        .enter().append("g")
            .attr("class", "row")
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; })
            .on("mouseover", (d,i) => mouseoverRow(d,i))
            .on("mouseout", (d,i) => mouseoutRow(d,i));



        // Make columns
        let column = svg.selectAll(".column")
            .data(data.columns)
        .enter().append("g")
            .attr("class", "column")
            .attr("transform", function(d, i) { return "translate(" + x(i) + ")rotate(-90)"; });

        // let squares = row.selectAll(".cell");
        // // Need to have better data structure here....
        // let count = 0;
        // for (const elem of data){

        //     console.log("for loop",elem)
        //     squares
        //         .data(elem)
        //     .enter().append("rect")
        //         .attr("class", "cell")
        //         .attr("y", function(d,i) {return y(i)})
        //         .attr("x", x(count))
        //         .attr("width", x.bandwidth())
        //         .attr("height", y.bandwidth());
        //         // .style("fill-opacity", d => opacityScale(d.z)).style("fill", d => {
        //         //     return nodes[d.x].group == nodes[d.y].group ? colorScale(nodes[d.x].group) : "grey";
        //         // });
        //         // .on("mouseover", mouseover)
        //         // .on("mouseout", mouseout);
        //     count++;
        //     console.log(count)
        // }

        let squares = row.selectAll(".cell")
            .data(function(d,i){return Object.values(d);})
        .enter().append("rect")
            .attr("class", "cell")
            // .attr("y", function(d,i) {return y(i)})
            .attr("x", (d,i) => x(i))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth()-2)
            .style("fill", d => color(d))
            .on("mouseover", mouseoverCell);
            // .on("mouseout", mouseout);

        let that = this;

        function mouseoverRow(r,i){
            console.log("in row",i)
            console.log(that.proc_ref)


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

            
        }

        function mouseoverCell(p) {
            // console.log(p)
            // console.log(that.proc_ref)
            // d3.selectAll(".row text").classed("active", function(d, i) { return i == p.y; });
            // d3.selectAll(".column text").classed("active", function(d, i) { return i == p.x; });
            }
        
        


       


        

        // //Updating scale domains

        // //Finding domain of rect color - might need to tweak this
        // let nCat = this.data.map((d) => {
        //     return d.category
        // });
        // //console.log("nCat: ",nCat);

        // //Function that gives only the distinct elements in an array
        // const unique = (value, index, self) => {
        //     return self.indexOf(value) === index
        // };
        // this.uniqueCats = nCat.filter(unique);
        // //console.log("unique categories: ",uniqueCats);

        // //Setting domains
        // //want frequency from 0 to 100
        // this.freqScale = this.freqScale.domain([0,1]);
        // //setting from -100 to 100
        // this.percAxScale = this.percAxScale.domain([-100,100]);
        // this.percScale = this.percScale.domain([0,100]);
        // //Color scale for frequency rect based on different categories
        // this.rectScale = d3.scaleOrdinal(d3.schemeSet3);

        // // Create the axes

        // //Frequency
        // const freqAxisGroup = d3.select("#freqHeader").append('svg')
        //     .attr("width", this.width+this.margin.right+this.margin.left)
        //     .attr("height",this.height)
        //     .attr("transform","translate(0,18)")
        //     .append('g')
        //     .classed("axis",true)
        //     .attr("id","f-axis")
        //     .attr('transform', `translate(${this.margin.left}, 20)`);

        // let fAxis = d3.axisTop(this.freqScale).ticks(3);

        // d3.select("#f-axis")
        //     .call(fAxis);

        // //Percentages
        // const percAxisGroup = d3.select("#percHeader").append('svg')
        //     .attr("width", this.width+this.margin.right+this.margin.left)
        //     .attr("height",this.height)
        //     .attr("transform","translate(0,18)")
        //     .append('g')
        //     .classed("axis",true)
        //     .attr("id","p-axis")
        //     .attr('transform', `translate(${this.margin.left}, 20)`);

        // let formatter = d3.format("0"); //Function to remove negative signs
        // let pAxis = d3.axisTop(this.percAxScale)
        //     .ticks(5)
        //     .tickFormat(function (d){
        //         if (d<0) d = -d;
        //         return formatter(d);
        //     }); //Formats tick values

        // d3.select("#p-axis")
        //     .call(pAxis);

        // //Sorts along table headers

        // // Binding headers column data to pre-existing html headers
        // let headers = d3.select("thead").select("tr").selectAll("div")
        //     .data(this.tableHeaders);
        // //console.log("headers selection: ",headers);

        // //set onclick event with sorted functions
        // //Why does this work??
        // headers
        //     .on("click", (d, i) => {

        //         //phrases
        //         if (i == 0) {
        //             if (d.sorted === false) {
        //                 let newData = this.data.sort((a, b) => {
        //                     return a.phrase > b.phrase ? -1 : 1;
        //                 });
        //                 //console.log(newData);
        //                 d.sorted = true;
        //                 this.updateTable(newData);
        //             } else {
        //                 let newData = this.data.sort((a, b) => {
        //                     return a.phrase < b.phrase ? -1 : 1;
        //                 });
        //                 d.sorted = false;
        //                 this.updateTable(newData);
        //             }
        //         }

        //         //frequency
        //         if (i == 1) {
        //             if (d.sorted === false) {
        //                 let newData = this.data.sort((a, b) => {
        //                     return parseInt(a.total) > parseInt(b.total) ? -1 : 1;
        //                 });
        //                 d.sorted = true;
        //                 this.updateTable(newData);
        //             } else {
        //                 let newData = this.data.sort((a, b) => {
        //                     return parseInt(a.total) < parseInt(b.total) ? -1 : 1;
        //                 });
        //                 d.sorted = false;
        //                 this.updateTable(newData);
        //             }
        //         }

        //         //Percentages
        //         if (i == 2) {
        //             if (d.sorted === false) {
        //                 let newData = this.data.sort((a, b) => {
        //                     return (parseInt(a.percent_of_d_speeches) + parseInt(a.percent_of_r_speeches)) > (parseInt(b.percent_of_d_speeches) + parseInt(b.percent_of_r_speeches)) ? -1 : 1;
        //                 });
        //                 d.sorted = true;
        //                 this.updateTable(newData);
        //             } else {
        //                 let newData = this.data.sort((a, b) => {
        //                     return (parseInt(a.percent_of_d_speeches) + parseInt(a.percent_of_r_speeches)) < (parseInt(b.percent_of_d_speeches) + parseInt(b.percent_of_r_speeches)) ? -1 : 1;
        //                 });
        //                 d.sorted = false;
        //                 this.updateTable(newData);
        //             }
        //         }

        //         //Total
        //         if (i == 3) {
        //             if (d.sorted === false) {
        //                 let newData = this.data.sort((a, b) => {
        //                     return parseInt(a.total) > parseInt(b.total) ? -1 : 1;
        //                 });
        //                 d.sorted = true;
        //                 this.updateTable(newData);
        //             } else {
        //                 let newData = this.data.sort((a, b) => {
        //                     return parseInt(a.total) < parseInt(b.total) ? -1 : 1;
        //                 });
        //                 d.sorted = false;
        //                 this.updateTable(newData);
        //             }
        //         }

        //     });

    }

    removeHeatMap(){
        /** Clears existing heat map**/
        
        d3.select("#heatmap").select("svg").remove()

        
        









    //     //this.data = this.data.slice(0,25);
    //     //Create table rows
    //     let rows = d3.select("tbody").selectAll('tr').data(this.data);

    //     //Enter selection
    //     let rowsE = rows.enter().append('tr');

    //     //Appending and initializing table headers + table cells
    //     rowsE.append("th").append("text");
    //     rowsE.append("td").classed("freqR",true).append("svg").append("rect").classed("freqRect",true);
    //     let a = rowsE.append("td").classed("percR",true).append("svg");
    //     a.append("rect").classed("demRect",true);
    //     a.append("rect").classed("repRect",true);
    //     rowsE.append("td").classed("totalR",true).append("text");


    //     //Handle exits
    //     rows.exit().remove();

    //     //Merge
    //     rows = rows.merge(rowsE);

    //     //Update

    //     //Header
    //     rows.select("text")
    //         .html(d => d.phrase);

    //     //frequency
    //     let freqsR = rows.select(".freqR").select("svg")
    //         .attr("width",this.width+this.margin.left+this.margin.right)
    //         .attr("height",this.height+this.margin.top+this.margin.bottom)
    //         .attr("transform",`translate(0,${this.margin.top*2})`);

    //     freqsR.select(".freqRect")
    //         .attr("y",this.margin.top)
    //         .attr("x",this.margin.left)
    //         .attr("width",d => this.freqScale((d.total/50)))
    //         .attr("height",this.height)
    //         .attr("fill",d => this.rectScale(d.category));

    //     //Percentages
    //     let percR = rows.select(".percR").select("svg")
    //         .attr("width",this.width+this.margin.left+this.margin.right)
    //         .attr("height",this.height+this.margin.top+this.margin.bottom)
    //         .attr("transform",`translate(0,${this.margin.top*2})`);

    //     //Dem side
    //     percR.select(".demRect")
    //         .attr("y",this.margin.top)
    //         .attr("x",d => (this.width+this.margin.left+this.margin.right)/2 - this.percScale(parseInt(d.percent_of_d_speeches)))
    //         .attr("fill","#61a3e3")
    //         .attr("width",d => this.percScale(parseInt(d.percent_of_d_speeches)))
    //         .attr("height",this.height);

    //     //Rep side
    //     percR.select(".repRect")
    //         .attr("y",this.margin.top)
    //         .attr("x",d => (this.width+this.margin.left+this.margin.right)/2)
    //         .attr("fill","#a82e2e")
    //         .attr("width",d => this.percScale(parseInt(d.percent_of_r_speeches)))
    //         .attr("height",this.height);

    //     //Total
    //     rows.select(".totalR")
    //         .html((d) => d.total);



    }


}