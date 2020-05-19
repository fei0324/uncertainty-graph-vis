/**
class for the edge filtering slider
*/
class fBar {

	constructor(activeF,range,id) {
		
        this.activeF = activeF;
        this.range = range;
        this.id = id;

		this.drawfBar();
	}

	/**
	Draw the f bar
	*/
	drawfBar() {

        let that = this;
        let step = null;
        // step
        step = 0.05

        //Slider to change to the datasets with correct k 

        let fScale = d3.scaleLinear().domain([2, 8]).range([0, 300]);

        let myBar =  d3.select('.fBar').append('div').attr('id',`${this.id}`).attr('class','active-fBar')

        this.fSlider = myBar
            .append('div').classed('slider-wrap-f', true)
            .append('input').classed('slider-f', true)
            .attr('type', 'range')
            .attr('min', this.range[0])
            .attr('max', this.range[1])
            .attr('step',step)
            .attr('value', this.activeF);


        let sliderLabel = d3.select('.slider-wrap-f')
            .append('div').classed('slider-label-f', true)
            .append('svg');

        
        
        let sliderText = sliderLabel.append('text').text(`edge filter: ${this.activeF}`);
        
        sliderText.attr('x', 100);
        sliderText.attr('y', 20);

        this.fSlider.on('input', function() {

            sliderText =  sliderText.text(`edge filter: ${this.value}`);
            
    
            that.activeF = this.value;
            // console.log(this.value)

        });
	}
}