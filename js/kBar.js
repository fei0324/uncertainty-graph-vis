/**
class for the k cluster slider
*/
class kBar {

	constructor(activeK) {
		
        this.activeK = activeK;
        /** Reference to graph object */
        // this.graph = mapObj; 

		this.drawkBar();
	}

	// updateYear(year) {
    //     this.activeYear = year;

    //     /** Pass active year to map object */
    //     this.map.activeYear = year;
    //     this.map.updateMap();
    //     //Updates state info box with year update
    //     if(this.map.activeState){
    //         d3.select("#mtooltipS").html(this.map.tooltipRender2(this.map.activeState));
    //     }

    //     console.log(this.map.activeState);
    //     console.log(this.map.activeStates);
    //     this.bubbleChart.updateChart(this.activeYear, this.map.activeState, this.map.activeStates);
        
	// }

	/**
	Draw the k bar
	*/
	drawkBar() {

		let that = this;

        //Slider to change to the datasets with correct k 

        let kScale = d3.scaleLinear().domain([2, 8]).range([0, 300]);

        this.kSlider = d3.select('#activeK-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 2)
            .attr('max', 8)
            .attr('step','2')
            .attr('value', this.activeK);

        // d3.select("#activeTime-bar").append("div");


        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(`k-clusters: ${this.activeK}`);

        // sliderText.attr('x', kScale(this.activeK));
        sliderText.attr('x', 150);
        sliderText.attr('y', 20);

        this.kSlider.on('input', function() {

            sliderText.text(`k-clusters: ${this.value}`)
                    // .attr('x', kScale(this.value));

            that.activeK = this.value;
            console.log(this.value)

        });
	}
}