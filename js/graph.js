/** Class for rendering a graph  */

class Graph{
    /**
     * Creates a Graph Object
     *
     * @param data the full dataset - node/link info
     */
    constructor(data) {

        //Stores data
        this.data = data
        console.log("Graph data:",this.data)

        // Creating scales

        //finding max and min of mean
        let avg_array = this.data.links.map( d=> d.average)
        let maxMean = d3.max(avg_array);
        let minMean = d3.min(avg_array);
        let medMean = d3.median(avg_array)
        console.log("max:",maxMean,"min:",minMean,"median:",medMean)

        //Color scale for means
        //Experimenting by making the median the diverging point, if this doesn't work, could change to mean
        //this.color = d3.scaleDiverging([minMean, medMean, maxMean], d3.interpolateRdBu);
        this.color = d3.scaleSequential(d3.interpolatePlasma).domain([minMean,maxMean]);
        // console.log(d3.color(this.color(10)).formatHex())
    
    }

    /**
     * Renders the graph
     * @param 
     */
    drawGraph(){

        const myGraph = ForceGraph();
        let data = this.data;

        // TODO: Create color scale for means, std will be colored as mean with lighter opacity 
        // TODO: See if I can incorporate gaussian blurring
        // TODO: Make uncertainty viz appear on demand to help scale

        // Graph with links that have a width/color based on mean 
        myGraph(document.getElementById('graph'))
            .graphData(data)
            .nodeRelSize(2)
            .nodeColor(() => "black")
            .nodeLabel(node => node.id)
            .linkCanvasObjectMode(() => 'replace')
            .linkCanvasObject((link, ctx) => {
                // This draws the links' uncertainty viz

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
                let colorM = d3.color(this.color(link.average)).copy({opacity: 0.7})
                let colorStd = d3.color(this.color(link.average)).copy({opacity: 0.45});
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
                //ctx.stroke();

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
                ctx.strokeStyle = "white"
                //Shadow effect 
                // ctx.shadowColor = 'rgba(46, 213, 197, 0.6)';
                // ctx.shadowBlur = 100;
                ctx.fill();
                ctx.stroke();

                ctx.restore();


                })
            .zoom(1.5);


    }



}