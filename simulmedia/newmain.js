(function() {

//add dropdown buttons
//d3.select('.viewers.nmg_dropdown').style({'left': 225 + 'px', 'top': 15 + 'px'});  
d3.select('.leadinaudience.nmg_dropdown').style({'left': 330 + 'px', 'top': 15 + 'px'});
d3.select('.leadoutaudience.nmg_dropdown').style({'left': 730 + 'px', 'top': 15 + 'px'});
d3.select('.showaudience.nmg_dropdown').style({'left': 530 + 'px', 'top': 15 + 'px'});
d3.select('.networkaudience.mg_dropdown').style({'left': 530 + 'px', 'bottom': 90 + 'px'});
d3.select('.timeshift.mg_dropdown').style({'left': 455 + 'px', 'bottom': 90 + 'px'});
d3.select('.order.mg_dropdown').style({'left': 730 + 'px', 'bottom': 90 + 'px'});

viewers = ["Number Of", "Viewers", "Viewers Percent"];
      for (ix in viewers) {
        d3.select(".viewers.nmg_dropdown").insert('option').text(viewers[ix]).attr('value', viewers[ix]);
       // console.log(ix);
      };

showaudience = ["Show Audience", "Adults 25-54", "A25-54 Viewers of Similar Programming"];
      for (ix in showaudience) {
        d3.select(".showaudience.nmg_dropdown").insert('option').text(showaudience[ix]).attr('value', showaudience[ix]);
       // console.log(ix);
      };

leadinaudience = ["LeadIn Audience", "Adults 25-54", "A25-54 Viewers of Similar Programming"];
      for (ix in leadinaudience) {
        d3.select(".leadinaudience.nmg_dropdown").insert('option').text(leadinaudience[ix]).attr('value', leadinaudience[ix]);
       // console.log(ix);
      };

leadoutaudience = ["LeadOut Audience", "Adults 25-54", "A25-54 Viewers of Similar Programming"];
      for (ix in leadoutaudience) {
        d3.select(".leadoutaudience.nmg_dropdown").insert('option').text(leadoutaudience[ix]).attr('value', leadoutaudience[ix]);
       // console.log(ix);
      };

networkaudience = ["Network Audience", "Adults 25-54", "A25-54 Viewers of Similar Programming", "Households", "Persons"];
      for (ix in networkaudience) {
        d3.select(".networkaudience.mg_dropdown").insert('option').text(networkaudience[ix]).attr('value', networkaudience[ix]);
       // console.log(ix);
      };

timeshift = ["Timeshift", "Live", "Live+3", "Live+7"];
      for (ix in timeshift) {
        d3.select(".timeshift.mg_dropdown").insert('option').text(timeshift[ix]).attr('value', timeshift[ix]);
       // console.log(ix);
      };

orders = ["Number Of", "Impressions", "Unduplicated Reach", "Duplicated Reach", 
			"Total Reach", "Frequency", "Conversion", "Conversion Rate"];
      for (ix in orders) {
        d3.select(".order.mg_dropdown").insert('option').text(orders[ix]).attr('value', orders[ix]);
       // console.log(ix);
      };

setDisabledIndex(document.getElementById("viewers"), viewers[0]);
setDisabledIndex(document.getElementById("leadinaudience"), leadinaudience[0]);
setDisabledIndex(document.getElementById("leadoutaudience"), leadoutaudience[0]);
setDisabledIndex(document.getElementById("showaudience"), showaudience[0]);
setDisabledIndex(document.getElementById("networkaudience"), networkaudience[0]);
setDisabledIndex(document.getElementById("timeshift"), timeshift[0]);
setDisabledIndex(document.getElementById("order"), orders[0]);

//set up svg
var margin = {top: 50, right: 0, bottom: 0, left: 0},
    width = 1100 - margin.left - margin.right,
    height = 1600 - margin.top - margin.bottom;

var bar_chart_width = 900,
    bar_order = d3.scale.ordinal();

var svg = d3.select("#div1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// var x = d3.time.scale().range([0, bar_chart_width]);

// var xAxis = d3.svg.axis().scale(x)
//     .orient("top").ticks(10);

// svg.append("rect")
//     .attr("width", "100%")
//     .attr("height", "100%")
//     .attr("fill", "pink");

// svg.append("g")
//         .attr("class", "x axis")
//         .call(xAxis);

//parse data
d3.csv("data.csv", function(tvdata) {

var viewers_index = 1,
	leadin_index = 1,
	leadout_index = 1,
	show_index = 1,
	network_index = 1,
	timeshift_index = 1,
	order_index = 1;

var short_viewers = ["nothing", "", "p"],
	short_audience = ["nothing", "aviewers", "apviewers"], 
	short_airtime = ["nothing", "a", "ap"],
	short_timeshift = ["nothing", "l", "l3", "l7"],
	short_network_au = ["nothing", "a", "ap", "h", "p"],
	short_order = ["nothing", "impressions", "unduplicated_reach", "duplicated_reach",
	 	"total_reach", "frequency", "conversion", "cv_rate"];

var leadin_values = [],
	show_values = [],
	leadout_values = [],
	network_list = [],
	network_values = [],
    old_network_list = [];

var bar_order = d3.scale.ordinal();

var network_value_col = "s" + short_timeshift[timeshift_index] + short_network_au[network_index]
			+ short_order[order_index],
	leadin_value_col = "in" + short_viewers[viewers_index] + short_audience[leadin_index], 
	leadout_value_col = "out" + short_viewers[viewers_index] + short_audience[leadout_index],
	show_value_cols = [short_viewers[viewers_index] + short_audience[show_index] + "0", 
				short_viewers[viewers_index] + short_audience[show_index] + "1", 
				short_viewers[viewers_index] + short_audience[show_index]+ "2",
				short_viewers[viewers_index] + short_audience[show_index] + "3"];

tvdata.forEach(function(d, i){
	old_network_list.push(d.network);
	network_values.push(d[network_value_col]);
	leadin_values.push(d[leadin_value_col]);

	show_value_cols.forEach(function(n, i){
		show_values.push(d[n]);
	});

	leadout_values.push(d[leadout_value_col]);
});

var all = [];
for (var i = 0; i < old_network_list.length; i++) {
    all.push({ 'network_values': network_values[i], 'old_network_list': old_network_list[i] });
}

all.sort(function(a, b) {
  return - Number(a['network_values']) + Number(b['network_values']);
});

for (var i = 0; i < all.length; i++) {
   network_list.push(all[i]['old_network_list']);
}

bar_order.domain(old_network_list);
bar_order.rangeBands([10, height - 130],0.5,0);

//var color = d3.scale.linear().domain([Math.min.apply(Math, msa_value_list), Math.max.apply(Math, msa_value_list)]).range( [ "#f7f7f7", colors[1]]);
var network_xlocation = 105;

var bar_labels = svg
      .selectAll("bar_label")
        .data(tvdata)
      .enter().append("text")
       .attr("class", function(d, i){return "mg_bar " + d.network;})
        .attr("x", network_xlocation)
        .attr("y", function(d, i) { return (bar_order(d.network)); })
        .style("font-size", 10)
        .text(function(d, i) { return d.network})
      // .on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)})
        .attr("text-anchor", "end")
        .on('mouseover', function(d){
        	d3.selectAll("text").style('font-weight', 'normal');
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style('font-weight', 'bold');
        	d3.selectAll("text.program").transition().text("Program").attr('y', -23);
        	d3.selectAll("text.episode").transition().text("Episode").attr('y', -23);
        	d3.selectAll("rect." + d.network).style("stroke", "black").style("stroke-width", 1);
       
        	var scol = "s" + short_timeshift[timeshift_index] + short_network_au[network_index] + short_order[order_index];
        	var bcol = "b" + short_timeshift[timeshift_index] + short_network_au[network_index] + short_order[order_index];
        	updatebars(d[scol], d[bcol]);
        	network_text.transition().duration(500).text(d.network).style("font-weight", "bold");

        })
        .style("cursor", "pointer");

var bar_xlocation = 145,
	totaltime = 400,
	starthour = 18,
	startminute = 0;

var leadinbar = svg
	.selectAll("leadinbar")
      .data(tvdata)
    .enter().append("rect")
	 .attr("class", function(d, i){return "mg_bar " + d.network;})
    .attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, leadin_values), Math.max.apply(Math, leadin_values)]).range(["#feedde", "#ff7f00"]);
    	return color(d[leadin_value_col]);
    })
      .attr("x",  function(d, i){
      	var start = "in" + short_airtime[leadin_index] +"airtime";
	    return getxlocation(bar_xlocation, d[start], bar_chart_width, totaltime, starthour, startminute)})
        .attr("y", function(d, i) { 
          return bar_order(d.network) - 8; })
      .attr("width", function(d, i) {
      	var duration = "in" + short_airtime[leadin_index] +"duration";
      	return getbarlength(d[duration], bar_chart_width, totaltime);})
     .attr("height", 8)
       // .on("click", function(d, i ){triggertransition(d, i, data_column, population_column,xlocation, range, color)})
      .on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
			d3.selectAll("text").style('font-weight', 'normal');        	
			var programcol = "in" + short_airtime[leadin_index] +"program";
        	var episodecol = "in" + short_airtime[leadin_index] +"episode";
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        })
        .style("cursor", "pointer");


var leadoutbar = svg
	.selectAll("leadoutbar")
      .data(tvdata)
    .enter().append("rect")
	 .attr("class", function(d, i){return "mg_bar " + d.network;})
    .attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, leadout_values), Math.max.apply(Math, leadout_values)]).range(["#f2f0f7", "#984ea3"]);
    	return color(d[leadout_value_col]);
    })
      .attr("x",  function(d, i){
      	var start = "out" + short_airtime[leadout_index] +"airtime";
	    return getxlocation(bar_xlocation, d[start], bar_chart_width, totaltime, starthour, startminute)})
        .attr("y", function(d, i) { 
          return bar_order(d.network) - 8; })
      .attr("width", function(d, i) {
      	var duration = "out" + short_airtime[leadout_index] +"duration";
      	return getbarlength(d[duration], bar_chart_width, totaltime);})
     .attr("height", 8)
           .on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');
        	var programcol = "out" + short_airtime[leadout_index] +"program";
        	var episodecol = "out" + short_airtime[leadout_index] +"episode";
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');

        })
        .style("cursor", "pointer");

var showbars = ["show0bar", "show1bar", "show2bar", "show3bar"];
var programs = ["program0", "program1", "program2", "program3"];
var episodes = ["episode0", "episode1", "episode2", "episode3"];

for (j = 0; j < 4; j++) { 

    showbars[j] = svg
	.selectAll("show" + j.toString() +"bar")
      .data(tvdata)
    .enter().append("rect")
	 .attr("class", function(d, i){return "mg_bar " + d.network;})
    .attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, show_values), Math.max.apply(Math, show_values)]).range(["#edf8e9", "#4daf4a"]);
    	return color(d[short_viewers[viewers_index] + short_audience[show_index] + j.toString()]);
    })
      .attr("x",  function(d, i){
      	var start = "airtime" + j.toString();
	    return getshowxlocation(bar_xlocation, d[start], bar_chart_width, totaltime, starthour, startminute);})
        .attr("y", function(d, i) { 
          return bar_order(d.network) - 8; })
      .attr("width", function(d, i) {
      	var duration = "duration" + j.toString();
      	return getbarlength(d[duration], bar_chart_width, totaltime);})
     .attr("height", 8)
           .on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');
        })
        .style("cursor", "pointer");

}

showbars[0].on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');        	
        	var programcol = programs[0];
        	var episodecol = episodes[0];
        //	console.log(programcol, episodecol);
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        })

showbars[1].on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');        	
        	var programcol = programs[1];
        	var episodecol = episodes[1];
        	//console.log(programcol, episodecol);
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        })

showbars[2].on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');        	
        	var programcol = programs[2];
        	var episodecol = episodes[2];
        //	console.log(programcol, episodecol);
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        })

showbars[3].on('mouseover', function(d){
        	d3.selectAll("rect").style("stroke", "black").style("stroke-width", 0);
        	d3.select(this).style("stroke", "black").style("stroke-width", 1);
        	d3.selectAll("text").style('font-weight', 'normal');        	
        	var programcol = programs[3];
        	var episodecol = episodes[3];
        //	console.log(programcol, episodecol);
        	d3.selectAll("text.program").transition().text(d[programcol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        	d3.selectAll("text.episode").transition().text(d[episodecol]).attr('y', bar_order(d.network)).style('font-weight', 'bold');
        })


svg.append('text')
.attr("class", "program")
        .attr('x', 135)
        .attr('y', -23)
        .style('font-size', 10)
        .attr('text-anchor', 'start')
        .text("Program");

svg.append('text')
.attr("class", "episode")
        .attr('x', 1035)
        .attr('y', -23)
        .style('font-size', 10)
        .attr('text-anchor', 'end')
        .text("Episode");

svg.append('text')
.attr("class", "simulmedia")
        .attr('x', 105)
        .attr('y', 1480 +5)
        .style('font-size', 10)
        .attr('text-anchor', 'end')
        .text("Simulmedia");

svg.append('text')
.attr("class", "base")
        .attr('x', 105)
        .attr('y', 1500)
        .style('font-size', 10)
        .attr('text-anchor', 'end')
        .text("Base");


var simu_bar = svg
	.append("rect")
    .attr("fill", "#377eb8")
      .attr("x",  135)
        .attr("y", 1480 - 8 + 5)
              .attr("width", 0 )
     .attr("height", 8);

var simu_text= svg
	.append("text")
    .text("")
      .attr("x",  135 + 900 + 5)
        .attr("y", 1480 + 5);


var base_bar = svg
	.append("rect")
    .attr("fill", "#e41a1c")
      .attr("x",  135)
        .attr("y", 1500 - 8)
              .attr("width", 0)
     .attr("height", 8);

var base_text= svg
	.append("text")
    .text("")
      .attr("x",  135 + 900 + 5)
        .attr("y", 1500);
 
var network_text = svg
	.append("text")
    .text("NETWORK")
            .attr('text-anchor', 'end')
      .attr("x",  105)
        .attr("y", 1455);


bar_order.domain(network_list);
bar_labels.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
leadinbar.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
leadoutbar.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
for (j = 0; j < 4; j++) { 
	showbars[j].transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
}



d3.selectAll('.nmg_dropdown')
        .on('change', function() {


          var dropdown_kind = d3.select(this).attr('class').split(' ')[0];
         /// console.log(dropdown_kind);
          // Establish category, type
           if (dropdown_kind == 'viewers') {
             viewers_index = viewers.indexOf(d3.select(this)[0][0].value);
          } else if (dropdown_kind == 'leadinaudience') {
            leadin_index = leadinaudience.indexOf(d3.select(this)[0][0].value);
           // current_level = d3.select(this)[0][0].value.split('_')[1].split('-');
          } else if (dropdown_kind == 'leadoutaudience') {
            leadout_index = leadoutaudience.indexOf(d3.select(this)[0][0].value);
          } else if (dropdown_kind == 'showaudience') {
            show_index = showaudience.indexOf(d3.select(this)[0][0].value);
          };

         updatecolor(viewers_index, leadin_index, leadout_index, show_index);

        });

d3.selectAll('.mg_dropdown')
        .on('change', function() {


          var dropdown_kind = d3.select(this).attr('class').split(' ')[0];
         /// console.log(dropdown_kind);
          // Establish category, type
           if (dropdown_kind == 'networkaudience') {
             network_index = networkaudience.indexOf(d3.select(this)[0][0].value);
          } else if (dropdown_kind == 'timeshift') {
            timeshift_index = timeshift.indexOf(d3.select(this)[0][0].value);
           // current_level = d3.select(this)[0][0].value.split('_')[1].split('-');
          } else if (dropdown_kind == 'order') {
            order_index = orders.indexOf(d3.select(this)[0][0].value);
          };

         updatelocation(network_index, timeshift_index, order_index);

        });





function updatecolor(viewers_index, leadin_index, leadout_index, show_index){

var leadin_values = [],
	show_values = [],
	leadout_values = [];


	leadin_value_col = "in" + short_viewers[viewers_index] + short_audience[leadin_index];
	leadout_value_col = "out" + short_viewers[viewers_index] + short_audience[leadout_index];
	show_value_cols = [short_viewers[viewers_index] + short_audience[show_index] + "0", 
				short_viewers[viewers_index] + short_audience[show_index] + "1", 
				short_viewers[viewers_index] + short_audience[show_index]+ "2",
				short_viewers[viewers_index] + short_audience[show_index] + "3"];

tvdata.forEach(function(d, i){
	leadin_values.push(d[leadin_value_col]);

	show_value_cols.forEach(function(n, i){
		show_values.push(d[n]);
	});

	leadout_values.push(d[leadout_value_col]);
});

leadinbar.transition().duration(500).attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, leadin_values), Math.max.apply(Math, leadin_values)]).range(["#feedde", "#ff7f00"]);
    	return color(d[leadin_value_col]);
    });

leadoutbar.transition().duration(500).attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, leadout_values), Math.max.apply(Math, leadout_values)]).range(["#f2f0f7", "#984ea3"]);
    	return color(d[leadout_value_col]);
    })

for (j = 0; j < 4; j++) { 
showbars[j].transition().duration(500).attr("fill", function(d, i){
    	var color = d3.scale.linear().domain([Math.min.apply(Math, show_values), Math.max.apply(Math, show_values)]).range(["#edf8e9", "#4daf4a"]);
    	return color(d[short_viewers[viewers_index] + short_audience[show_index] + j.toString()]);
    })
}

}

function updatelocation(network_index, timeshift_index, order_index){

old_network_list = [];
network_list = [];
network_values = [];

network_value_col = "s" + short_timeshift[timeshift_index] + short_network_au[network_index]
			+ short_order[order_index];

// console.log(network_value_col);

tvdata.forEach(function(d, i){
	old_network_list.push(d.network);
	network_values.push(d[network_value_col]);
});

var all = [];
for (var i = 0; i < old_network_list.length; i++) {
    all.push({ 'network_values': network_values[i], 'old_network_list': old_network_list[i] });
}

all.sort(function(a, b) {
  return - Number(a['network_values']) + Number(b['network_values']);
});

for (var i = 0; i < all.length; i++) {
   network_list.push(all[i]['old_network_list']);
}


bar_order.domain(old_network_list);
bar_order.rangeBands([10, height - 130],0.5,0);

// console.log(network_values);
// console.log(network_list);


bar_order.domain(network_list);
bar_labels.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
leadinbar.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
leadoutbar.transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
for (j = 0; j < 4; j++) { 
	showbars[j].transition().duration(500).attr("y", function(d, i) { 
          return (bar_order(d.network)); });
}

network_text.transition().duration(500).text("NETWORK").style("font-weight", "normal");

simu_bar.transition().duration(500).attr("width", 0);
base_bar.transition().duration(500).attr("width", 0);
simu_text.transition().duration(500).attr("x", 0).text("");
base_text.transition().duration(500).attr("x", 0).text("");

}



function updatebars(svalue, bvalue){

var max = Math.max(svalue, bvalue);

if(max != 0){
	
simu_bar.transition().duration(500).attr("width", svalue/max * 800);
base_bar.transition().duration(500).attr("width", bvalue/max * 800);
simu_text.transition().duration(500).attr("x", svalue/max * 800 + 140).text(toCommas(svalue));
base_text.transition().duration(500).attr("x", bvalue/max * 800 + 140).text(toCommas(bvalue));

}
else{

simu_bar.transition().duration(500).attr("width", 0)
base_bar.transition().duration(500).attr("width", 0);
simu_text.transition().duration(500).attr("x", svalue/max * 800 + 140).text("");
base_text.transition().duration(500).attr("x", bvalue/max * 800 + 140).text("");

}


}

});




function getxlocation(xlocation, start, width, totaltime, starthour, startminute){

var format = d3.time.format("%I:%M:%S %p");
var timestamp = format.parse(start);

if(timestamp != null)
{
return ((timestamp.getHours() - starthour)*60 + timestamp.getMinutes() - startminute)/totaltime*width+ xlocation;
}

};

function getshowxlocation(xlocation, start, width, totaltime, starthour, startminute){

var format = d3.time.format("%Y-%m-%d %I:%M:%S");
var timestamp = format.parse(start);

if(timestamp != null)
{
return ((timestamp.getHours() - starthour)*60 + timestamp.getMinutes() - startminute)/totaltime*width+ xlocation;
}

};



function getbarlength(duration, width, totaltime){

return (duration/totaltime)*width;

}


function setDisabledIndex(s, valsearch)
{
// Loop through all the items in drop down list
for (i = 0; i< s.options.length; i++)
{ 
if (s.options[i].value == valsearch)
{
// Item is found. Set its property and exit
s.options[i].disabled = true;
//s.options[i].style.color = 'red';

break;
}
}
return;
}


function setSelectedIndex(s, valsearch)
{
// Loop through all the items in drop down list
for (i = 0; i< s.options.length; i++)
{ 
if (s.options[i].value == valsearch)
{
// Item is found. Set its property and exit
s.options[i].selected = true;

break;
}
}
return;
}


function toCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


})();