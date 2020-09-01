/**
class for the co-occurrence uncertainty measure slider
*/
class qBar {

	constructor(active,range,id) {
		
        this.active = active;
        this.range = range;
        this.id = id;

		this.drawqBar();
	}

	/**
	Draw the f bar
	*/
	drawqBar() {

        let that = this;
        let step = null;
        // step
        step = 1

        //Slider to change to the datasets with correct k 

        let qScale = d3.scaleLinear().domain([2, 8]).range([0, 300]);

        let myBar =  d3.select('.qBar').append('div').attr('id',`${this.id}`).attr('class','active-qBar')

        this.qSlider = myBar
            .append('div').classed('slider-wrap-q', true)
            .append('input').classed('slider-q', true)
            .attr('type', 'range')
            .attr('min', this.range[0])
            .attr('max', this.range[1])
            .attr('step',step)
            .attr('value', this.active);


        let sliderLabel = d3.select('.slider-wrap-q')
            .append('div').classed('slider-label-q', true)
            .append('svg');

        
        
        let sliderText = sliderLabel.append('text').attr("id","filter-text").text(`run: ${this.active}`);
        
        sliderText.attr('x', 125);
        sliderText.attr('y', 15);

        this.qSlider.on('input', function() {

            sliderText =  sliderText.text(`run: ${this.value}`);
            
    
            that.active = this.value;
            // console.log(this.value)

        });
	}
}