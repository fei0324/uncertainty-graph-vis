/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(data){
        // Set data variable
        this.data = data;

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

    createTable(){
        /** Creates table **/

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

    updateTable(){
        /** Updates the table with data **/

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