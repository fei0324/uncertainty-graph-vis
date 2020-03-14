d3.json('data/small_net.json').then(data => {
    console.log(data)

	const Graph = ForceGraph();

    // Graph(document.getElementById('graph'))
    //     .graphData(data)
    //     .nodeRelSize(2)
    //     .nodeColor(() => "black")
    //     .nodeLabel(node => node.id)
    //     .linkWidth(1)
    //     .linkColor(() => "#4E4E54")
    //     .linkWidth(link => link.average)
    //     .zoom(1.5);

    // TODO: Create color scale for means, std will be colored as mean with lighter opacity 
    // TODO: See if I can encorporate fegaussianblur 
    // TODO: Make uncertainty viz appear on demand to help scale

    // Graph with links that have a width/color based on mean and bluriness based on std
    Graph(document.getElementById('graph'))
        .graphData(data)
        .nodeRelSize(2)
        .nodeColor(() => "black")
        .nodeLabel(node => node.id)
        .linkCanvasObjectMode(() => 'replace')
        .linkCanvasObject((link, ctx) => {

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
            //const mean_val = link.average * mean_scaling;
            const mean_val = link.value * scaling;
            const std_val = 5 * scaling;
            let x_prime = Math.sin(textAngle)*mean_val;
            let y_prime = Math.cos(textAngle)*mean_val;
            let xs_prime = Math.sin(textAngle)*(mean_val+std_val);
            let ys_prime = Math.cos(textAngle)*(mean_val+std_val);

            // Calculating points that are in from the edges
            xe_prime = Math.cos(edgeAngle)*PATH_NODE_MARGIN;
            ye_prime = Math.sin(edgeAngle)*PATH_NODE_MARGIN;

            //line data for the mean shape
            mean_data = [
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

            std_data = [
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


            // draw text label (with background rect)
            ctx.save();

            //Line for mean
            const line = d3.line()
                .curve(d3.curveBasisClosed); //good one
               // .curve(d3.curveCardinalClosed.tension(1)); //adjusting tension is cool
                //.curve(d3.curveCatmullRomClosed.alpha(0.5));
            line.context(ctx); // for canvas
            ctx.beginPath();
            line(mean_data);
            //line([[1, 3], [2, 7], [3, 2], [5, 2]]);
            ctx.lineWidth = 0.1
            //ctx.fill();
            ctx.stroke();

            //Line for first std dev
            const line2 = d3.line()
                .curve(d3.curveBasisClosed); //good one
                //.curve(d3.curveCardinalClosed.tension(0)); //adjusting tension is cool
                //.curve(d3.curveCatmullRomClosed.alpha(0.5));
            line2.context(ctx); // for canvas
            ctx.beginPath();
            line(std_data);
            //line([[1, 3], [2, 7], [3, 2], [5, 2]]);
            ctx.lineWidth = 0.1
            //ctx.fill();
            ctx.stroke();

            ctx.restore();



        })
        // .linkColor(() => "#4E4E54")
        // .linkWidth(link => link.average)
        .zoom(1.5);
});