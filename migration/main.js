
(function() {
var w = 1100,
    h = 760,
    bar_chart_width = 300,
    legend_x_func = d3.scale.linear().range([0,bar_chart_width]).domain([-1,1]),
    bar_order = d3.scale.ordinal();
  

var projection = d3.geo.albers()
    .scale(850)
    .translate([900/1.5, 480/1.55]);
var path = d3.geo.path()
    .projection(projection);


//add dropdown buttons
d3.select('.direction.mg_dropdown').style({'left': 115 + 'px', 'top': 15 + 'px'});  
d3.select('.category.mg_dropdown').style({'left': 190 + 'px', 'top': 15 + 'px'});
 d3.select('.type.mg_dropdown').style({'left': 44 + 'px', 'top': 15 + 'px'});

direction = ["Direction", "Inflow", "Outflow", "Netflow"]
      for (ix in direction) {
        d3.select(".direction.mg_dropdown").insert('option').text(direction[ix]).attr('value', direction[ix])
       // console.log(ix);
      };

var workstatus = ["In labor force, employed civilian", "In labor force, unemployed", "In labor force, in Armed Forces", "Not in labor force"];
var employment = ["Worked 50 to 52 weeks in the past 12 months and usually worked 35 or more hours per week", "Worked 50 to 52 weeks in the past 12 months and usually worked less than 35 hours per week", "Worked 1 to 49 weeks in the past 12 months and usually worked 35 or more hours per week", " Worked 1 to 49 weeks in the past 12 months and usually worked less than 35 hours per week", "Last worked 1 to 5 years ago", "Last worked over 5 years ago or never worked"];
var occupation = ["Management, business, science, and arts occupations", "Service occupations", "Sales and office occupations", "Natural resources, construction, and maintenance occupations", "Production, transportation, and material moving occupations", "Military specific occupations"];
category = ["Category", "All", "Flows by Employment"];
category = category.concat(workstatus);
category = category.concat("Flows by Work Statues");
category = category.concat(employment);
category = category.concat("Flows by Occupation");
category = category.concat(occupation);
      for (ix in category) {
        d3.select(".category.mg_dropdown").insert('option').text(category[ix]).attr('value', category[ix])
      }; 


type = ["Type", "Number", "Rate"]
      for (ix in type) {
        d3.select(".type.mg_dropdown").insert('option').text(type[ix]).attr('value', type[ix])
        //.attr("disabled", "disabled")
        ; }


setDisabledIndex(document.getElementById("direction"), direction[0]);
setDisabledIndex(document.getElementById("type"), type[0]);
for (x in category){
  if (x == 0|| x ==2 || x == 7 || x== 14){
setDisabledIndex(document.getElementById("category"), category[x]);
}
}
//import US map
var svg = d3.select("#div1").insert("svg:svg")
    .attr("width", 1640)
    .attr("height", 760);

var states = svg.append("svg:g")
    .attr("id", "states");





d3.json("us-states.json", function(collection) {
  states.selectAll("path")
      .data(collection.features)
    .enter().append("svg:path")
    .attr("fill", "#fff")
    .attr("stroke", "#ccc")
      .attr("d", path);
     



d3.csv("airports.csv", function(airports) {

d3.csv("new-flights-airport.csv", function(flights) {


// states.append('text')
//         .attr('x', 1030)
//         .attr('y', 24)
//         .style('font-size', 14)
//         .attr("fill", "#3F3F3F")
//        // .style('font-weight', 'bold')
//         .text("Major City ofMSA");

//add some notations
// states.append('text')
//         .attr("class", "header")
//         .attr('x', 1355)
//         .attr('y', 25)
//         .attr("fill", "#3F3F3F")
//        //         .style('font-weight', 'bold')
//         .attr('text-anchor', 'middle')
//         .style('font-size', 16)
//        // .style('font-weight', 'bold')
//         .text("Number of Immigrants");


states.append('text')
.attr("class", "name")
        .attr('x', 920)
        .attr('y', 604)
        .attr("fill", "#3F3F3F")
        .style('font-size', 20)
        .attr('text-anchor', 'end')
        .style('font-weight', 'bold')
        .text("MSAs");

// states.append('text')
//         .attr('x', 235)
//         .attr('y', 24)
//         .attr("fill", "#3F3F3F")
//         .style('font-size', 14)
//        // .style('font-weight', 'bold')
//         .text("Select:");


var short_direction =["nothing", "in", "out", "net"];
var short_category = ["nothing", "all", "nothing", "em1", "em2", "em3", "em4", "nothing", "ws1", "ws2","ws3", "ws4", "ws5", "ws6", "nothing", "oc1", "oc2", "oc3", "oc4", "oc5", "oc6"];

var type_index = 1;
var category_index = 1;
var direction_index = 1;
if ( (short_category[category_index] != "nothing" )&& (short_direction[direction_index] !="nothing" ))
{var data_column = short_category[category_index] + short_direction[direction_index];
}


  var current_type_index = 1,
      current_direction_index = 1,
      current_category_index = 1;


var population_column = (current_type_index==1) ? 'numberpopulation' : 'ratepopulation';

  // var msa_list = [];
  //     airports.forEach(function(value,index,array) {msa_list.push(value.iata)});
  //   //  airports.forEach(function(value,index,array) {current_data.push(value.allin)});
  //     bar_order.domain(msa_list);
  //     bar_order.rangeBands([0,680-18],0.5,0);
  //     d3.select('#mg_bar_chart').attr('transform', 'translate (' + column_offset + ',0)')

//calculate the current column values
var msa_names_list = [],
    msa_value_list = [],
    value_list = [],
    names_list = [],
    id_list = []
    new_id_list = [];

airports.forEach(function(d, i){
names_list.push(d.shortname);
value_list.push(d[data_column]/d[population_column]);
id_list.push(d.iata);
});

bar_order.domain(id_list);
      bar_order.rangeBands([-50,550],0.5,0);

var copy_list = value_list.slice(0);
value_list.sort(compareNumbers);
value_list.reverse();
var indexees = [];
for (var i=0; i<50; i++)
{

  for(var j=0; j<50; j++){
    if (copy_list[j] === value_list[i]){
msa_names_list.push(names_list[j]);
new_id_list.push(id_list[j]);

    }
  }
}
msa_value_list = value_list.slice(0);


var xlocation = 0, max_x = 0;
//xlocation, max_x = getxlocation( airports, flights, data_column);


if (data_column.substring(3) === 'in'){ var column_name = data_column.substring(0, 3)+ 'dto';}
if (data_column.substring(3) === 'out'){ var column_name = data_column.substring(0, 3)+ 'otd';}

var airport_value = [], flight_value = [];

airports.forEach(function(airport){
  //  console.log(airport[data_column]);
airport_value.push(airport[data_column]/airport[population_column]);
})

flights.forEach(function(flight){
 // console.log(flight[column_name]);
flight_value.push(flight[column_name]/flight[population_column]);
})

var range = Math.max.apply(Math, airport_value) ;
//+ Math.max.apply(Math, flight_value);
xlocation = 1085;  length = 240;
//1200+ Math.max.apply(Math, airport_value)/range*300;



data_min = Math.min.apply(Math, msa_value_list);
data_max = Math.max.apply(Math, msa_value_list);
 
 var colors = ["#4FB3CF",  "#FDB924"];

 var color = d3.scale.linear().domain([Math.min.apply(Math, msa_value_list), Math.max.apply(Math, msa_value_list)]).range( [ "#f7f7f7", colors[1]]);
//console.log(range, xlocation);

//console.log(msa_names_list);

//set up bar chart
 var bar_labels = states
 //.select('#bar_labels')
 //.select("#msa_names_column")
      .selectAll("bar_label")
        .data(airports)
      .enter().append("text")
       .attr("class", function(d, i){return "mg_bar " + d.iata;})
          //  .attr("id", function(d, i){return d.iata;})
       .attr("fill", "#3F3F3F")
        .attr("x", 975)
        .attr("y", function(d, i) { 
          return (60 + bar_order(d.iata)); })
        .style("font-size", 10)
        .text(function(d, i) { 
//console.log(i);
          return names_list[i]})
      .on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)})
        .style("cursor", "pointer");




var bar_numbers = states
//.select('#bar_numbers')
 //.select("#msa_names_column")
      .selectAll("bra_number")
        .data(airports)
      .enter().append("text")
           // .attr("id", function(d, i){return d.iata;})
            .attr("class", function(d, i){return "mg_bar " + d.iata;})
       .attr("fill", "#3F3F3F")
        .attr("x", function(d,i){
        return xlocation ;})//1505
        .attr("text-anchor", "start")
        .attr("y", function(d) { 

           return (60 + bar_order(d.iata)); })
        .style("font-size", 10)
        .text("0")      
        .on("click", function(d, i ){triggertransition(d, i, data_column, population_column,xlocation, range, color)})
        .style("cursor", "pointer");



var bar = states
//.select('#bar')
.selectAll("bar")
      .data(airports)
    .enter().append("rect")
        //  .attr("id", function(d, i){return d.iata;})
 .attr("class", function(d, i){return "mg_bar " + d.iata;})
    .attr("stroke", "darkgray")
    .attr("fill", "white")
      .attr("x",  xlocation )
        .attr("y", function(d, i) { 
          return (52 + bar_order(d.iata)); })
      .attr("width", 0)
     .attr("height", 9)
       .on("click", function(d, i ){triggertransition(d, i, data_column, population_column,xlocation, range, color)})
        .style("cursor", "pointer");





  var circles =  states.selectAll("circle")
        .data(airports)
      .enter().append("circle")
              //   .attr("class", "mg_bar")
      .attr("class", function(d, i){return "mg_bar " + d.iata;})
      .style("stroke", "darkgray")
        .attr("cx", function(d, i) { return projection([d.longitude, d.latitude])[0]; })
        .attr("cy", function(d, i) { return projection([d.longitude, d.latitude])[1]; })
        .attr("r", 0)
        .attr("fill", "white")
       // .attr("opacity", 0.8)
        .style("cursor", "pointer")
//         .on("mouseover", function(d ,i ){

// d3.select(this).moveToFront();
// d3.select(this).transition().style("stroke", "red").style("stroke-width", 1);
//         })
//                 .on("mouseout", function(d ,i ){

// d3.select(this).transition().style("stroke", "darkgray").style("stroke-width", 1);
//         })
        .on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)});



//bar_labels.on("click", function(d, i ){triggertransition(d, i, data_column)});
//bar.on("click", function(d, i ){triggertransition(d, i, data_column)});
//bar_numbers.on("click", function(d, i ){triggertransition(d, i, data_column)});


bar_order.domain(new_id_list);

bar_labels.transition().duration(500)
//.text(function(d, i) { return msa_names_list[i]})
 .attr("y", function(d, i) { 
          return (60 + bar_order(d.iata)); });



//install current data

bar_numbers.transition()
.duration(500)
        .attr("x", function(d,i){

        return xlocation+ 5 + (d[data_column]/d[population_column])/range* length;})//1505
        .text(function(d, i) { 
  //msa_value_list.push(d[data_column]);
         // console.log(d[population_column], population_column);
          return toCommas(d[data_column]/d[population_column])})
 .attr("y", function(d, i) { 
         return (60 + bar_order(d.iata)); });



bar.transition().duration(500)
    .attr("fill", function(d, i) { return color(d[data_column]/d[population_column]);})
     // .attr("x", function(d, i) { return xlocation + d[data_column]/range* 300; })
      .attr("y", function(d, i) { 
          return (52 + bar_order(d.iata)); })
      .attr("width", function(d, i) { 
        return (d[data_column]/d[population_column])/range* length; });
    //  .attr("height", 11);



  circles.transition()
        .attr("r", function(d){ return Math.sqrt(d[data_column]/d[population_column])/18;})
        .attr("fill", function(d){ return color(d[data_column]/d[population_column]); });


    // var arc = d3.geo.greatArc()
    //   .source(function(d) { return locationByAirport[d.target]; })
    //   .target(function(d) { return locationByAirport[d.source]; });


 d3.selectAll(".mg_bar")
         .on('mouseover', function(d){

d3.select("circle." + d.iata).moveToFront();
d3.select("circle." + d.iata).transition().style("stroke", "red").style("stroke-width", 2);
d3.selectAll("text." + d.iata).transition().attr("fill", "red").style("stroke", "red").style("stroke-width", 1);

d3.selectAll("rect." + d.iata).transition().style("stroke", "red").style("stroke-width", 2);

d3.selectAll("text.name").transition().text(d.name).attr("fill", "red");
         })
         .on("mouseout", function(d){
d3.select("circle." + d.iata).transition().style("stroke", "darkgrey").style("stroke-width", 1);
d3.selectAll("text." + d.iata).transition().attr("fill", "#3F3F3F").style("stroke", "none");
d3.selectAll("rect." + d.iata).transition().style("stroke",  "darkgrey").style("stroke-width", 1);
d3.selectAll("text.name").transition().text('MSAs').attr("fill", "#3F3F3F");
         });


// interactive with dropdowns
d3.selectAll('.mg_dropdown')
        .on('change', function() {


          var dropdown_kind = d3.select(this).attr('class').split(' ')[0];
         /// console.log(dropdown_kind);
          // Establish category, type
           if (dropdown_kind == 'type') {
             current_type_index = type.indexOf(d3.select(this)[0][0].value);
          } else if (dropdown_kind == 'category') {
            current_category_index = category.indexOf(d3.select(this)[0][0].value);
           // current_level = d3.select(this)[0][0].value.split('_')[1].split('-');
          } else if (dropdown_kind == 'direction') {
            current_direction_index = direction.indexOf(d3.select(this)[0][0].value);
          };


         update(current_type_index, current_direction_index, current_category_index);
          

        });




function update(current_type_index, current_direction_index, current_category_index){

d3.selectAll(".arc").transition().attr("visibility", "hidden");


var data_column = short_category[current_category_index] + short_direction[current_direction_index];
var population_column = (current_type_index==1) ? 'numberpopulation' : 'ratepopulation';



var msa_names_list = [],
    msa_value_list = [],
    value_list = [],
    names_list = [],
    id_list = []
    new_id_list = [];

airports.forEach(function(d, i){
names_list.push(d.shortname);

value_list.push(d[data_column]/d[population_column]);


id_list.push(d.iata);
});

bar_order.domain(id_list);
      bar_order.rangeBands([-50,550],0.5,0);

var copy_list = value_list.slice(0);
value_list.sort(compareNumbers);
value_list.reverse();
var indexees = [];
for (var i=0; i<50; i++)
{

  for(var j=0; j<50; j++){
    if (copy_list[j] === value_list[i]){
msa_names_list.push(names_list[j]);
new_id_list.push(id_list[j]);

    }
  }
}
msa_value_list = value_list.slice(0);


var xlocation = 0, max_x = 0;
//xlocation, max_x = getxlocation( airports, flights, data_column);
 
 var colors = ["#4FB3CF",  "#FDB924"];

 
var airport_value = [], flight_value = [];

airports.forEach(function(airport){
  //  console.log(airport[data_column]);

airport_value.push(airport[data_column]/airport[population_column]);
})

flights.forEach(function(flight){
 // console.log(flight[column_name]);
flight_value.push(flight[column_name]/flight[population_column]);

})

if (data_column.substring(3) === 'in'){ var column_name = data_column.substring(0, 3)+ 'dto';

var color = d3.scale.linear().domain([Math.min.apply(Math, msa_value_list), Math.max.apply(Math, msa_value_list)]).range( [ "#f7f7f7", colors[1]]);
var range = Math.max.apply(Math, airport_value);
xlocation = 1085;
//d3.select("text.header").transition().text("Number of Immigrants")
}
else if (data_column.substring(3) === 'out'){ var column_name = data_column.substring(0, 3)+ 'otd';

var color = d3.scale.linear().domain([Math.min.apply(Math, msa_value_list), Math.max.apply(Math, msa_value_list)]).range( [ "#f7f7f7", colors[0]]);
var range = Math.max.apply(Math, airport_value);
xlocation = 1085;
//d3.select("text.header").transition().text("Number of Emigrants")

}
else{

var column_name = data_column.substring(0, 3)+ 'onet';
var color = d3.scale.linear().domain([Math.min.apply(Math, msa_value_list), 0, Math.max.apply(Math, msa_value_list)]).range( [ colors[0], "#f7f7f7", colors[1]]);

var range = Math.max.apply(Math, airport_value) + Math.abs(Math.min.apply(Math, airport_value));
xlocation = 1110 + Math.abs(Math.min.apply(Math, airport_value))/range*210;

length = 210;
 // d3.select("text.header").transition().text("Number of Migrants")
}





// data_min = Math.min.apply(Math, msa_value_list);
// data_max = Math.max.apply(Math, msa_value_list);

//console.log(range, xlocation);





bar_order.domain(new_id_list);

bar_labels.transition().duration(500)
//.text(function(d, i) { return msa_names_list[i]})
 .attr("y", function(d, i) { 
          return (60 + bar_order(d.iata)); });


//update current data

// bar_numbers.transition()
// .duration(500)
//         .attr("x", function(d,i){
//         return xlocation- 5 - d[data_column]/range* 300;})//1505
//         .text(function(d, i) { 
//   //msa_value_list.push(d[data_column]);
//           return d[data_column]})
  // .attr("y", function(d, i) { 
  //        return (60 + bar_order(d.iata)); });

bar_labels.on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)});
bar.on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)});
bar_numbers.on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)});

// bar.transition().duration(500)
//     .attr("fill", function(d, i) { return color(d[data_column]);})
//       .attr("x", function(d, i) { return xlocation - d[data_column]/range* 300; })
//       .attr("y", function(d, i) { 
//           return (50 + bar_order(d.iata)); })
//       .attr("width", function(d, i) { 
//         return d[data_column]/range* 300; });
            //  .on("click", function(d, i ){triggertransition(d, i, data_column)});
    //  .attr("height", 11);


circles.on("click", function(d, i ){triggertransition(d, i, data_column, population_column, xlocation, range, color)});

  circles.transition()
        .attr("r", function(d){ return (current_type_index == 2) ?  Math.sqrt(Math.abs(d[data_column]/d[population_column]))*2000/18: Math.sqrt(Math.abs(d[data_column]/d[population_column]))/18;})

        .attr("fill", function(d){ return color(d[data_column]/d[population_column]); });
             //   .on("click", function(d, i ){triggertransition(d, i, data_column)});



bar.transition().duration(500)
    .attr("fill", function(d, i) { 
        return color(d[data_column]/d[population_column]);
        //}
    })
      .attr("x", function(d, i) {
if(  d[data_column]>= 0){
 return xlocation ; }
 else{
  return xlocation - Math.abs(d[data_column]/d[population_column])/range* length;
 }
      })
     .attr("width", function(d, i) { 
return Math.abs(d[data_column]/d[population_column])/range* length;
   //   }
      })       
     .attr("y", function(d, i) { 
           return (52 + bar_order(d.iata)); });


// bar number transition
bar_numbers.transition()
.duration(500)
        .attr("x", function(d,i){
if(d[data_column] >= 0){
return xlocation+ 5 + (d[data_column]/d[population_column])/range* length;}
else{
  return xlocation-5 + (d[data_column]/d[population_column])/range* length;
}
       // }
      })
        .text(function(d, i) { 
        return(current_type_index == 2) ? Math.round((d[data_column]/d[population_column])*100000)/100+ '‰' : toCommas(d[data_column]/d[population_column]) ;  
//}
      })
 .attr("text-anchor", 

function(d, i ){
if (d[data_column] >= 0){
  return "start";   }
  else{   return "end"; }
//}    

}
  ) .attr("y", function(d, i) { 
         return (60 + bar_order(d.iata)); });



}





//set up current options

setSelectedIndex(document.getElementById("direction"), direction[direction_index]);
setSelectedIndex(document.getElementById("type"), type[type_index]);
setSelectedIndex(document.getElementById("category"), category[category_index]);




function triggertransition(d, i, data_column, population_column, xlocation, range, color){


//d3.select("text.header").transition().text("Number of Migrants Arrive " + d.name)
var term = d.iata;
current_value_dict = getvaluelist(flights, data_column, population_column, d.iata);
var values = [];
for (ix in current_value_dict){
  values.push(current_value_dict[ix]);
 // console.log(current_value_dict[ix]);
}
//console.log(current_value_dict);
if (data_column.substring(3) === 'in'){

  var column_name = data_column.substring(0, 3)+ 'dto';
var new_color = d3.scale.linear().domain([Math.min.apply(Math, values), Math.max.apply(Math, values)]).range( [ "#f7f7f7", colors[0]]);
//d3.select("text.header").transition().text("Number of Migrants Arrive " + d.name)
}

else if (data_column.substring(3) === 'out'){ var column_name = data_column.substring(0, 3)+ 'otd';

//console.log(data_column);
var new_color = d3.scale.linear().domain([Math.min.apply(Math, values), Math.max.apply(Math, values)]).range( [ "#f7f7f7", colors[1]]);

//d3.select("text.header").transition().text("Number of Emigrants")

}

else {var column_name = data_column.substring(0, 3)+ 'onet';

var new_color = d3.scale.linear().domain([Math.min.apply(Math, values), 0, Math.max.apply(Math, values)]).range( [colors[1], "#f7f7f7", colors[0]]);
//d3.select("text.header").transition().text("Number of Migrants Leave " + d.name)
}


//bar color and width transition
bar.transition().duration(500)
    .attr("fill", function(d, i) { 
    //  console.log(d.iata, term);
      if (d.iata != term){
      return new_color(current_value_dict[d.iata]);}
      else{ return color(d[data_column]/d[population_column]);}
    })
     .attr("x", function(d, i) {
      if  (d.iata != term){
     return  (data_column.substring(3) !== 'net' || current_value_dict[d.iata]>=0) ? xlocation : xlocation + current_value_dict[d.iata]/range* length ;}
     else{
return (data_column.substring(3) !== 'net' || d[data_column]>=0) ? xlocation : xlocation + (d[data_column]/d[population_column])/range* length; 
     }
       })
     .attr("width", function(d, i) { 
            if  (d.iata != term){ 
      return Math.abs(current_value_dict[d.iata])/range* length; }
      else{
return Math.abs(d[data_column]/d[population_column])/range* length;
      }
      });
    // //  .attr("height", 11);


// bar number transition
bar_numbers.transition()
.duration(500)
        .attr("x", function(d,i){
                      if  (d.iata != term){ 

        return  current_value_dict[d.iata]>0 ? xlocation + 5 + current_value_dict[d.iata]/range* length : xlocation - 5 + current_value_dict[d.iata]/range* length;}//1505}
        else{
if (d[data_column]>0) {return xlocation+ 5 + (d[data_column]/d[population_column])/range* length;}
else  {return xlocation - 5 + (d[data_column]/d[population_column])/range* length;}
        }
      })
        .text(function(d, i) { 
          if  (d.iata != term){ 
  //msa_value_list.push(d[data_column]);
          return (current_type_index == 2) ?  Math.round(current_value_dict[d.iata]*100000)/100 + '‰': toCommas(current_value_dict[d.iata]);}
else{
          return(current_type_index == 2) ? Math.round((d[data_column]/d[population_column])*100000)/100+ '‰' : toCommas(d[data_column]/d[population_column]) ;  

}      })
 .attr("text-anchor", 

function(d, i ){
          if  (d.iata != term){ 
  //msa_value_list.push(d[data_column]);
  if ( current_value_dict[d.iata] >= 0) {return "start";} else{ return "end";}
          }
   
if (d[data_column] >= 0){
  return "start";   }
  else{   return "end"; }
}
  );


//circles transition

  circles.transition().duration(500)
        .attr("r", function(d){ 

if  (d.iata != term){ 

return (current_type_index == 2) ? Math.sqrt(Math.abs(current_value_dict[d.iata]))*2000/18 : Math.sqrt(Math.abs(current_value_dict[d.iata]))/18 ;

}
else{ 
          return (current_type_index == 2) ?  Math.sqrt(Math.abs(d[data_column]/d[population_column]))*2000/18: Math.sqrt(Math.abs(d[data_column]/d[population_column]))/18;}
        })
        .attr("fill", function(d){ 
if  (d.iata != term){ 

 return new_color(current_value_dict[d.iata]);
  
}
else{
          return color(d[data_column]/d[population_column]);}
           });


buildArc(airports, flights, current_value_dict, new_color, term, d, data_column, population_column);

//console.log("click");


}




function buildArc(airports, flights, current_value_dict, new_color, term, d, data_column, population_column ){

try{
d3.selectAll(".arc").remove();
}
catch(err){console.log('err');}

//console.log(data_column);

var locationByAirport = {}, links = [];

//if (data_column.indexOf('in') > 0 ){
  //console.log('in');
  var arc = d3.geo.greatArc()
     .source(function(d) { return (d.flag === 'True') ? locationByAirport[d.target] : locationByAirport[d.source]; })
      .target(function(d) { return (d.flag === 'True') ? locationByAirport[d.source] : locationByAirport[d.target]; });
//    }
//else{
 // console.log('out');
//   var arc = d3.geo.greatArc()
//      .source(function(d) { return locationByAirport[d.source]; })
//       .target(function(d) { return locationByAirport[d.target]; });

// }

 
airports.forEach(function(airport){
 var location = [+airport.longitude, +airport.latitude];
        locationByAirport[airport.iata] = location; 
})



flights.forEach(function(flight) {
  // if(flight.origin == term){
  if (data_column.indexOf('in') > 0 ){
    links.push({source: flight.origin, target: flight.destination, flag: 'True'});}
  else if  (data_column.indexOf('out') > 0 ){
    links.push({source: flight.origin, target: flight.destination, flag: 'False'});}
  else if (data_column.indexOf('net') > 0 ){
    var netname = data_column.substring(0, 3)+ 'onet';
    if (flight[netname] >= 0 )
   { links.push({source: flight.origin, target: flight.destination, flag: 'True'});}
 else{
  links.push({source: flight.origin, target: flight.destination, flag: 'False'});
 }
  }
  });



   states.selectAll("path.arc")
         .data(links)
      .enter().append("svg:path")
      .attr("class", "arc")
     /// .attr("id", "newarc")
  //.attr("stroke-width", function(d, i){ //console.log(i);
    //return 5; })
      .attr("stroke", "white")

       .attr("id", function(d){return "arc" + d.source})
        .attr("visibility", "hidden")
        .attr("d", function(d, i) { 
          return path(arc(d)); });


//d3.selectAll("#arcSeat").transition().attr("visibility", "visible");




//arc transition
d3.selectAll(".arc").transition().attr("visibility", "hidden");

d3.selectAll("#arc" + d.iata)
//.transition()
.attr("stroke-width", function(d, i) { //console.log(d,i);

return (current_type_index==2) ? Math.sqrt(Math.abs(current_value_dict[d.target]))*2000/9: Math.sqrt(Math.abs(current_value_dict[d.target]))/9;

})
.attr("stroke", function(d, i){

return new_color(current_value_dict[d.target]);

})

.attr("visibility", "visible")
.call(arctransition);



//.call(arctransition);


// d3.selectAll("#arc" + d.iata).transition()
// .attr("visibility", "visible")
// .call(arctransition);





d3.select("circle." + d.iata).moveToFront();

}


    var arctransition = function arctransition(path){

        path.transition()
            .duration(function(d, i) {  
             
                return 500;
           //   return  (1.0/dashcount[i])*1000000 ;
            })
         //   .delay(function(d, i) { console.log(d);})
            .attrTween("stroke-dasharray", TweenDash)
            .each("end", function(d, i){ 
            //   d3.select(this).call(arctransition);
            });
    };



    var TweenDash = function tweetDash(){
                var len = this.getTotalLength();
               //console.log(this);

         return d3.interpolateString( "0,"+ len, len +","+len);
//interpolate = d3.interpolateString( "0,"+ len, len +","+len);

         
    };



});

});

});


// var instruction = states.append("foreignObject")
//  .attr("x", 235)
//          .attr("y", 590)
// .attr("width", 1000).attr("height", 500).append("xhtml:span")
// .html("<strong><font size = 5>Migration Flows Between Top 50 MSAs 2008-2012 </strong> </font> <br> <br> Brief Instruction <br> New line");



function compareNumbers(a, b) {
  return a - b;
}


// function getxlocation(airport, flight, term){

// if (term.substring(3) === 'in'){ var column_name = term.substring(0, 3)+ 'dto';}
// if (term.substring(3) === 'out'){ var column_name = term.substring(0, 3)+ 'otd';}

// var airport_value = [], flight_value = [];

// airport.forEach(function(airport){
// airport_value.push(airport[term]);
// })

// flight.forEach(function(flight){
// flight_value.push(flight[column_name]);
// })

// // range = Math.max.apply(Math, airport_value) + Math.max.apply(Math, flight_value);
// // location = 1200+ Math.max.apply(Math, airport_value)/range*300;

// // //console.log(range, location);


// }


function getvaluelist(data, term, population_column, id){

var dict = {};

if (term.substring(3) === 'in'){ var column_name = term.substring(0, 3)+ 'dto';}
else if (term.substring(3) === 'out'){ var column_name = term.substring(0, 3)+ 'otd';}
else{ var column_name = term.substring(0, 3)+ 'onet';};

//console.log(column_name);
for (ix in data){

if ( data[ix].origin === id){
dict[data[ix].destination] = data[ix][column_name]/data[ix][population_column];

}
}
return dict;
}


d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};




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