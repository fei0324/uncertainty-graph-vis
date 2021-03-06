/**
class for the k cluster slider
*/
class kBar {

	constructor(activeK,range,id) {
		
        this.activeK = activeK;
        this.range = range;
        this.id = id;
        /** Reference to graph object */
        // this.graph = mapObj; 

		this.drawkBar();
	}

	/**
	Draw the k bar
	*/
	drawkBar() {

        let that = this;
        let step = null;
        // determines correct step
        if (this.range[0] == 2){
            // this is rectange, so step is 2 
            step = 2
        }
        else if (this.range[0] == 6){
            // lesmes, step = 1
            step = 1
        }
        else if (this.range[0] == 10){
            // celegans, step = 1
            step = 1
        }
        else if (this.range[0] == 0.1){
            // lesmes_spars, step = 1
            step = 0.1
        }
        else if (this.range[0] == 20){
            // email...need to figure out step, step = 1
            step = 1
        }
        else if (this.id == 'unif-spars'){
            step = 0.1
        }
        else{
            step = 1
        }


        //Slider to change to the datasets with correct k 

        let kScale = d3.scaleLinear().domain([2, 8]).range([0, 300]);

        let myBar =  d3.select('.kBar').append('div').attr('id',`${this.id}`).attr('class','active-kBar')

        this.kSlider = myBar
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', this.range[0])
            .attr('max', this.range[1])
            .attr('step',step)
            .attr('value', this.activeK);

        // d3.select("#activeTime-bar").append("div");


        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        
        let sliderText = null;
        if (this.id == 'spars-mis'){
            // Sets special text if it's sparsification
            sliderText = sliderLabel.append('text').attr("id","reduction-text").text(`reduction ratio: ${this.activeK}`);
        }
        else if (this.id == 'unif-spars'){
            // Sets special text if it's sparsification
            sliderText = sliderLabel.append('text').attr("id","reduction-text").text(`reduction ratio: ${this.activeK}`);
        }
        else{
            sliderText = sliderLabel.append('text').attr("id","cluster-text").text(`k-clusters: ${this.activeK}`);

        }
        
        // sliderText.attr('x', kScale(this.activeK));
        sliderText.attr('x',125);
        sliderText.attr('y', 15);

        this.kSlider.on('input', function() {

            if (that.id == 'spars-mis'){
                // Sets special text if it's sparsification
                sliderText =  sliderText.text(`reduction ratio: ${this.value}`);
            }
            else if (that.id == 'unif-spars'){
                // Sets special text if it's sparsification
                sliderText =  sliderText.text(`reduction ratio: ${this.value}`);
            }
            else if (that.id == 'coarse-author'){
                sliderText =  sliderText.text(`k-clusters: ${this.value}`);
            }
            else{
                let email_vals = [20,30,40,41,42,43,44,50];

                if (this.value < 20 || email_vals.includes(parseInt(this.value))){
                    sliderText =  sliderText.text(`k-clusters: ${this.value}`);
                }
                
    
            }
            that.activeK = this.value;

        });
	}
}