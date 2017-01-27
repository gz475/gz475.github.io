(function() {


d3.json("data.json", function(data) {
	
	var sale_data = data[0],
		sale_location = sale_data['location'],
		sale_date = sale_data['date'],
		sale_currency = sale_data['currency'],
		sale_name = sale_data['name'],
		lots = sale_data['lots'];

	var price_text = d3.select("#price-number");
	var performance_text = d3.select("#performance-number");
	var distribution_text = d3.select("#distribution-number");
	var sale_text = d3.select("#sale-number");
	var flow_text = d3.select("#flow-number");


	d3.select('#charts').select('h1').html(sale_name + ', ' + sale_location + ', ' + sale_date);

	var height = 230, leftwidth = 450, rightwidth = 820, width = 1300;

	var price_svg = d3.select("#price-chart").append("svg")
    	.attr("width", leftwidth)
    	.attr("height", height);

	var performance_svg = d3.select("#performance-chart").append("svg")
    	.attr("width", leftwidth)
    	.attr("height", height);

    var distribution_svg = d3.select("#distribution-chart").append("svg")
    	.attr("width", rightwidth)
    	.attr("height", height);

    var sale_svg = d3.select("#sale-chart").append("svg")
    	.attr("width", rightwidth)
    	.attr("height", height);

    var flow_svg = d3.select("#flow-chart").append("svg")
    	.attr("width", width)
    	.attr("height", height);

    var price_margin = {top: 30, right: 0, bottom: 50, left: 40},
    	price_width = leftwidth - price_margin.left - price_margin.right,
    	price_height = height - price_margin.top - price_margin.bottom;

    var performance_margin = {top: 30, right: 0, bottom: 50, left: 40},
    	performance_width = leftwidth - performance_margin.left - performance_margin.right,
    	performance_height = height - performance_margin.top - performance_margin.bottom;

    var distribution_margin = {top: 30, right: 0, bottom: 50, left: 40},
    	distribution_width = rightwidth - distribution_margin.left - distribution_margin.right,
    	distribution_height = height - distribution_margin.top - distribution_margin.bottom;

    var sale_margin = {top: 30, right: 80, bottom: 50, left: 40},
    	sale_width = rightwidth - sale_margin.left - sale_margin.right,
    	sale_height = height - sale_margin.top - sale_margin.bottom;

    var flow_margin = {top: 30, right: 30, bottom: 50, left: 80},
    	flow_width = width - flow_margin.left - flow_margin.right,
    	flow_height = height - flow_margin.top - flow_margin.bottom;

    var price_focus = price_svg.append("g")
    	.attr("transform", "translate(" + price_margin.left + "," + price_margin.top + ")");

    var performance_focus = performance_svg.append("g")
    	.attr("transform", "translate(" + performance_margin.left + "," + performance_margin.top + ")");

    var distribution_focus = distribution_svg.append("g")
    	.attr("transform", "translate(" + distribution_margin.left + "," + distribution_margin.top + ")");

    var sale_focus = sale_svg.append("g")
    	.attr("transform", "translate(" + sale_margin.left + "," + sale_margin.top + ")");

    var flow_focus = flow_svg.append("g")
    	.attr("transform", "translate(" + flow_margin.left + "," + flow_margin.top + ")");
	
	var sale_status = [];

	for (var i = 0, len = lots.length; i < len; i++) {
		sale_status.push(lots[i]['status']);
	}

	var status_res = getUnique(sale_status);

	var performance_res = getPerformance(lots);

		for (var i = 0, len = performance_res.length; i < len; i++) {
  		performance_res[i]['value'] = performance_res[i]['value']/parseFloat(lots.length);
	}


	var distribution_res = getDistribution(lots);
	var sale_res = getSale(lots);
	sale_res[0]['value'] = sale_res[0]['value']/parseFloat(lots.length);
	sale_res[1]['value'] = sale_res[1]['value']/parseFloat(lots.length);
	var flow_res = getFlow(lots);

	console.log(flow_res);

	var price_x = d3.scale.ordinal()
    	.rangeRoundBands([0, price_width], .1);
    var performance_x = d3.scale.ordinal()
    	.rangeRoundBands([0, performance_width], .1);
    var distribution_x = d3.scale.ordinal()
    	.rangeRoundBands([0, distribution_width], .1);
    var sale_x_1 = d3.scale.ordinal()
    	.rangeRoundBands([0, (sale_width/5)*2], .1);
    var sale_x_2 = d3.scale.ordinal()
    	.rangeRoundBands([(sale_width/5)*2, sale_width], .1);
	var flow_x = d3.scale.linear()
    	.range([0, flow_width]);


	var price_y = d3.scale.linear()
    	.range([price_height, 0]);
	var performance_y = d3.scale.linear()
    	.range([performance_height, 0]);
	var distribution_y = d3.scale.linear()
    	.range([distribution_height, 0]);
	var sale_y_1 = d3.scale.linear()
    	.range([sale_height, 0]);
	var sale_y_2 = d3.scale.linear()
    	.range([sale_height, 0]);
	var flow_y = d3.scale.linear()
    	.range([flow_height, 0]);


	var price_xAxis = d3.svg.axis()
    	.scale(price_x)
    	.orient("bottom");
   	var performance_xAxis = d3.svg.axis()
    	.scale(performance_x)
    	.orient("bottom");
   	var distribution_xAxis = d3.svg.axis()
    	.scale(distribution_x)
    	.orient("bottom");
   	var sale_xAxis_1 = d3.svg.axis()
    	.scale(sale_x_1)
    	.orient("bottom");
   	var sale_xAxis_2 = d3.svg.axis()
    	.scale(sale_x_2)
    	.orient("bottom");
    var flow_xAxis = d3.svg.axis()
    	.scale(flow_x)
    	.orient("bottom");

	var price_yAxis = d3.svg.axis()
    	.scale(price_y)
    	.orient("left")
    	.ticks(5, "%");
	var performance_yAxis = d3.svg.axis()
    	.scale(performance_y)
    	.orient("left")
    	.ticks(5, "%");
	var distribution_yAxis = d3.svg.axis()
    	.scale(distribution_y)
    	.orient("left")
    	.ticks(5, "");
	var sale_yAxis_1 = d3.svg.axis()
    	.scale(sale_y_1)
    	.orient("left")
    	.ticks(5, "%");
	var sale_yAxis_2 = d3.svg.axis()
    	.scale(sale_y_2)
    	.orient("right")
    	.ticks(5, "");
	var flow_yAxis = d3.svg.axis()
    	.scale(flow_y)
    	.orient("left");


	price_x.domain(status_res.map(function(d) { return d.status; }));
	price_y.domain([0, d3.max(status_res, function(d) { return d.value; })]);
	performance_x.domain(performance_res.map(function(d) { return d.status; }));
	performance_y.domain([0, d3.max(performance_res, function(d) { return d.value; })]);
	distribution_x.domain(distribution_res.map(function(d) { return d.status; }));
	distribution_y.domain([0, d3.max(distribution_res, function(d) { return d.value; })]);
	sale_x_1.domain(sale_res.slice(0, 2).map(function(d) { return d.status; }));
	sale_y_1.domain([0, d3.max(sale_res.slice(0, 2), function(d) { return d.value; })]);
	sale_x_2.domain(sale_res.slice(2, 5).map(function(d) { return d.status; }));
	sale_y_2.domain([0, d3.max(sale_res.slice(2, 5), function(d) { return d.value; })]);
	flow_x.domain([1, lots.length]);
	flow_y.domain([0, Math.max(d3.max(flow_res[0], function(d) { return d.value; }), d3.max(flow_res[1], function(d) { return d.value; }), d3.max(flow_res[2], function(d) { return d.value; }))]);


	var performance_bar = performance_focus.selectAll("bar")
      .data(performance_res)
    .enter().append("rect")
      .attr("x",  function(d) {return performance_x(d.status)})
        .attr("y", function(d, i) { 
          return performance_y(d.value) })
      .attr("width",  performance_x.rangeBand())
     .attr("height", function(d) { return performance_height - performance_y(d.value)})
        .style("cursor", "pointer")
              .on('mouseover', function(d){
        performance_text.transition().duration(750).text( parseInt(d.value*100) + '%');
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          performance_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });


  performance_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + performance_height + ")")
      .call(performance_xAxis);


  performance_focus.append("g")
      .attr("class", "y axis")
      .call(performance_yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

	var price_bar = price_focus.selectAll("bar")
      .data(status_res)
    .enter().append("rect")
      .attr("x",  function(d) {return price_x(d.status)})
        .attr("y", function(d, i) { 
          return price_y(d.value) })
      .attr("width",  price_x.rangeBand())
     .attr("height", function(d) { return price_height - price_y(d.value)})
        .style("cursor", "pointer")
              .on('mouseover', function(d){

        price_text.transition().duration(750).text( parseInt(d.value*100) + '%');
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          price_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });


  price_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + price_height + ")")
      .call(price_xAxis);


  price_focus.append("g")
      .attr("class", "y axis")
      .call(price_yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");


	var distribution_bar = distribution_focus.selectAll("bar")
      .data(distribution_res)
    .enter().append("rect")
      .attr("x",  function(d) {return distribution_x(d.status)})
        .attr("y", function(d, i) { 
          return distribution_y(d.value) })
      .attr("width",  distribution_x.rangeBand())
     .attr("height", function(d) { return distribution_height - distribution_y(d.value)})
        .style("cursor", "pointer")
              .on('mouseover', function(d){

        distribution_text.transition().duration(750).text( d.value);
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          distribution_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });


  distribution_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + distribution_height + ")")
      .call(distribution_xAxis)
    .append("text")
      // .attr("transform", "rotate(-90)")
      .attr("y", 3)
      .attr("x", distribution_width - 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text('M ' + sale_currency);

  distribution_focus.append("g")
      .attr("class", "y axis")
      .call(distribution_yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text();

	var sale_bar_1 = sale_focus.selectAll("bar")
      .data(sale_res.slice(0, 2))
    .enter().append("rect")
      .attr("x",  function(d) {return sale_x_1(d.status)})
        .attr("y", function(d, i) { 
          return sale_y_1(d.value) })
      .attr("width",  sale_x_1.rangeBand())
     .attr("height", function(d) { return sale_height - sale_y_1(d.value)})
        .style("cursor", "pointer")
              .on('mouseover', function(d){

        sale_text.transition().duration(750).text( parseInt(d.value*100) + '%');
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          sale_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });


  sale_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + sale_height + ")")
      .call(sale_xAxis_1);


  sale_focus.append("g")
      .attr("class", "y axis")
      .call(sale_yAxis_1)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");


	var sale_bar_2 = sale_focus.selectAll("bar")
      .data(sale_res.slice(2, 5))
    .enter().append("rect")
      .attr("x",  function(d) {return sale_x_2(d.status)})
        .attr("y", function(d, i) { 
          return sale_y_2(d.value) })
      .attr("width",  sale_x_2.rangeBand())
     .attr("height", function(d) { return sale_height - sale_y_2(d.value)})
        .style("cursor", "pointer")
              .on('mouseover', function(d){

        sale_text.transition().duration(750).text( d.value);
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          sale_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });


  sale_focus.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + sale_height + ")")
      .call(sale_xAxis_2);


  sale_focus.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + sale_width + ",0)")
      .call(sale_yAxis_2)
    .append("text")
      .attr("transform", "translate(20, -20)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(sale_currency);



var line = d3.svg.line()
    .x(function(d) { return flow_x(d.index); })
    .y(function(d) { return flow_y(d.value); });


  flow_focus.append("path")
      .datum(flow_res[0])
      .attr("class", "line")
      .attr('stroke', '#66c2a5')
      .attr("d", line);

  flow_focus.append("g")
      .attr("class", "xx axis")
      .attr("transform", "translate(0," + flow_height + ")")
      .call(flow_xAxis);

  flow_focus.append("g")
      .attr("class", "y axis")
      .call(flow_yAxis)

  flow_focus.append("path")
      .datum(flow_res[1])
      .attr("class", "line")
      .attr('stroke', '#fc8d62')
      .attr("d", line);

  flow_focus.append("path")
      .datum(flow_res[2])
      .attr("class", "line")
      .attr('stroke', '#8da0cb')
      .attr("d", line);

    flow_focus.selectAll("dot")
        .data(flow_res[2])
      .enter().append("circle")
      .filter(function(d) { return d.value > 0 })
        .style("fill", "#08519c")
        .attr("r", 3.5)
        .attr("cx", function(d) { return flow_x(d.index); })
        .attr("cy", function(d) { return flow_y(d.value); })
         .on('mouseover', function(d, i){

        flow_text.transition().duration(750).text( 'Lot Number: ' + lots[i]['lot_number'] + ', ' +' Low Estimate: ' +flow_res[0][i]['value'] + ", " +' High Estimate: ' +flow_res[1][i]['value']+ ", " + ' Price: ' + d.value);
        d3.select(this).transition().style("stroke", '#08306b').style("stroke-width", 1);
      })
              .on('mouseout', function(d){
          flow_text.transition().duration(750).text('');
          d3.select(this).transition().style("stroke-width", 0);

      });

});


function getUnique(arr){

	var counts = {}, 
		numbers = [],
		res = [],
		sum = 0;

	for(var i = 0; i< arr.length; i++) {
   	 	var num = arr[i];
    	counts[num] = counts[num] ? counts[num]+1 : 1;
	}

	var terms = Object.keys(counts);

	for (var i = 0, len = terms.length; i < len; i++) {
		
		var val = {};
		val['status'] = terms[i];
		val['value'] = counts[terms[i]];
		sum += counts[terms[i]];
		res.push(val);
	}

	for (var i = 0, len = res.length; i < len; i++) {
  		res[i]['value'] = res[i]['value']/parseFloat(sum);
	}

	return res;

}


function getPerformance(lots){

	var res = [], values = {};
	var bins = ['Above High Estimate', 'Within Estimate', 'Below Low Estimate'];

	for (var i = 0, len = bins.length; i < len; i++) {

		values[bins[i]] = 0;
	}

	// console.log(values);

	for (var i = 0, len = lots.length; i < len; i++) {
		
		if (lots[i]['price'] !== '' && lots[i]['estimate_high'] !== '' && lots[i]['price'] >  lots[i]['estimate_high']){
			values['Above High Estimate']  += 1;
		} 

		if(lots[i]['price'] !== '' && lots[i]['estimate_low'] !== '' && lots[i]['price'] <  lots[i]['estimate_low']){
			values['Below Low Estimate'] += 1;
		} 

		if (lots[i]['price'] !== '' && lots[i]['estimate_low'] !== '' && lots[i]['estimate_high'] !== '' && lots[i]['price'] >=  lots[i]['estimate_low'] && lots[i]['price'] <=  lots[i]['estimate_high']){
			values['Within Estimate'] += 1;
		}
	}

	var terms = Object.keys(values), sum = 0;

	for (var i = 0, len = terms.length; i < len; i++) {
		
		var val = {};
		val['status'] = terms[i];
		val['value'] = values[terms[i]];
		sum += values[terms[i]];
		res.push(val);
	}

	return res;

}

function getDistribution(lots){

	var res = [0, 0, 0, 0, 0, 0, 0, 0];
	var bins = [0, 100000, 250000, 500000, 1000000, 5000000, 10000000, 15000000];
	var result = [];

	for (var i = 0, len = lots.length; i < len; i++) {
		if (lots[i]['price'] !== '' ){
			for (var j = bins.length - 1, le = 0; j >= le; j--){
				if (lots[i]['price'] > bins[j]){
					res[j] += 1;
					break;
				}
			}
		}
	}

	var terms = ['< 0.1', '0.1 - 0.25', '0.25 - 0.5', '0.5 - 1', '1 - 5', '5 - 10', '10 - 15', '> 15'];

	for (var i = 0, len = terms.length; i < len; i++) {
		
		var val = {};
		val['status'] = terms[i];
		val['value'] = res[i];
		result.push(val);
	}

	return result;

}

function getSale(lots){

	var approved = 0,
		image = 0,
		low_total = 0,
		high_total = 0,
		price_total = 0;
	var result = [];

	for (var i = 0, len = lots.length; i < len; i++) {

		if (lots[i]['approved']){ approved += 1}
		if (lots[i]['image']){ image += 1}
		if (lots[i]['estimate_low'] !== ''){ low_total += lots[i]['estimate_low']}
		if (lots[i]['estimate_high'] !== ''){ high_total += lots[i]['estimate_high']}
		if (lots[i]['price'] !== ''){ price_total += lots[i]['price']}

	}
	
	var terms = ['Approved', 'Images', 'Low Estimate', 'High Estimate', 'Price'];
	var res = [approved, image, low_total, high_total, price_total];

	for (var i = 0, len = terms.length; i < len; i++) {
		
		var val = {};
		val['status'] = terms[i];
		val['value'] = res[i];
		result.push(val);
	}

	return result;

}

function getFlow(lots){

	var low_estimate = [],
		high_estimate = [],
		price = [];

	for (var i = 0, len = lots.length; i < len; i++) {


		if (lots[i]['estimate_low'] !== '')
			{ 
				var term = {};
				term['index'] = i + 1;
				term['value'] = lots[i]['estimate_low'];
				low_estimate.push(term)}
		else{

				var term = {};
				term['index'] = i + 1;
				term['value'] = 0;
			low_estimate.push(term);
		}

		if (lots[i]['estimate_high'] !== '')
			{ 

				var term = {};
				term['index'] = i + 1;
				term['value'] = lots[i]['estimate_high'];
				high_estimate.push(term)}
		else{

				var term = {};
				term['index'] = i + 1;
			term['value'] = 0;
			high_estimate.push(term);			
		}

		if (lots[i]['price'] !== ''){ 

				var term = {};
				term['index'] = i + 1;
				term['value'] = lots[i]['price'];
			price.push(term)}
		else{

				var term = {};
				term['index'] = i + 1;
			term['value'] = 0;
			price.push(term);
		}
	}

	return [low_estimate, high_estimate, price];

}

})();