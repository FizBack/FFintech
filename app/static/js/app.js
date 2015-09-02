var width = $(window).width(),
    height = $(window).height(),
    goldenNumber = 1.618;
    
var margin = { top: 60, bottom: 60, left: 60, right: 60 };

var FranceFintech = "http://static1.squarespace.com/static/556da4b8e4b0f81335bf7dab/t/55785ab1e4b00fe50a288048/1434355652756/?format=1500w";
var entonnoir = "http://s30.postimg.org/onqkun8qp/basic2_178_filter_512.png";
    
var svg_filtres = d3.select("#filtres").append("svg:svg");
    		
var svg_FF = d3.select("#FF").append("svg")
    .attr("width", 370)
    .attr("height", 100);

function graphiques(data) {

var dateFormat = d3.time.format("%b-%y");
var numberFormat = d3.format('.2f');

data.forEach(function (d) {
  if (d.Round_4 !== 0){
      d.Date_1 = dateFormat.parse(d.Date_1);
      d.Date_2 = dateFormat.parse(d.Date_2);
      d.Date_3 = dateFormat.parse(d.Date_3);
      d.Date_4 = dateFormat.parse(d.Date_4);
      d.Inception = dateFormat.parse(d.Inception);
  } else if(d.Round_3 !== 0) {
      d.Date_1 = dateFormat.parse(d.Date_1);
      d.Date_2 = dateFormat.parse(d.Date_2);
      d.Date_3 = dateFormat.parse(d.Date_3);
      d.Inception = dateFormat.parse(d.Inception);
  } else if(d.Round_2 !== 0) {
      d.Date_1 = dateFormat.parse(d.Date_1);
      d.Date_2 = dateFormat.parse(d.Date_2);
      d.Inception = dateFormat.parse(d.Inception);
  } else if(d.Round_1 !== 0) {
      d.Date_1 = dateFormat.parse(d.Date_1);
      d.Inception = dateFormat.parse(d.Inception);
  } else {
  	  d.Inception = dateFormat.parse(d.Inception);
  }
  });


var businessModelPieChart = dc.pieChart('#businessModelPieChart');
var categoryRowChart = dc.rowChart('#categoryRowChart');
var inceptionBarChart = dc.barChart('#inceptionBarChart');
var totalLeve = dc.numberDisplay('#montant-leve');
// var fundsChart = dc.bubbleChart('#fundsBarChart');
var fundsChart = dc.compositeChart("#fundsBarChart");

var ndx = crossfilter(data);
var all = ndx.groupAll();

var Company = ndx.dimension(function(d){
  return d.Company;
})

var Round_1_Group = Company.group().reduceSum(function (d) { return d.Round_1; });
var Round_2_Group = Company.group().reduceSum(function (d) { return d.Round_2; });
var Round_3_Group = Company.group().reduceSum(function (d) { return d.Round_3; });
var Round_4_Group = Company.group().reduceSum(function (d) { return d.Round_4; });

var yearlyInception = ndx.dimension(function (d) {
      return d3.time.year(d.Inception);
  });
  
var yearlyInceptionGroup = yearlyInception.group();
  
// var totalRaised = ndx.dimension(function (d) {
//       return d.Round_1 + d.Round_2 + d.Round_3 + d.Round_4;
//   });
  
var totalRaisedGroup = ndx.groupAll().reduce( 
          function (p, v) {
              ++p.n;
              p.tot += v.Round_1 + v.Round_2 + v.Round_3 + v.Round_4 ;
              return p;
          },
          function (p, v) {
              --p.n;
              p.tot -= v.Round_1 + v.Round_2 + v.Round_3 + v.Round_4;
              return p;
          },
          function () { return {n:0,tot:0}; }
);

var total = function(d) {
      return d.n ? d.tot : 0;
      };
  
// var lastRaised = ndx.dimension(function (d) {
//   if (d.Round_4 !== 0) {
//       return d3.time.month(d.Date_4);
//   } else if (d.Round_3 !== 0) {
//       return d3.time.month(d.Date_3);
//   } else if (d.Round_2 !== 0) {
//       return d3.time.month(d.Date_2);
//   } else if(d.Round_1 !== 0){
//       return d3.time.month(d.Date_1);
//   } else {
//  	  return new Date(1900, 0, 1);
//   }});

var bubbleGroup = Company.group().reduce(
		//  The first parameter is a transient instance of the reduced object. The second object is the current record
        /* callback for when data is added to the current filter results */
        function (p, v) {
            ++p.count;
            
            p.category = v.category;
            
            if (v.Round_4 !== 0) {
				  p.Round_4 = v.Round_4;
			} 
			
			if (v.Round_3 !== 0) {
				  p.Round_3 = v.Round_3;
			} 
			
			if (v.Round_2 !== 0) {
				  p.Round_2 = v.Round_2;
			}
			
			if (v.Round_1 !== 0){
				  p.Round_1 = v.Round_1;
			};
			
			p.total = p.Round_1 + p.Round_2 + p.Round_3 + p.Round_4;
			
            if (v.Round_4 !== 0) {
				  p.Date_4 = d3.time.month(v.Date_4);
			} 
			
			if (v.Round_3 !== 0) {
				  p.Date_3 = d3.time.month(v.Date_3);
			} 
			
			if (v.Round_2 !== 0) {
				  p.Date_2 = d3.time.month(v.Date_2);
			}
			
			if (v.Round_1 !== 0){
				  p.Date_1 = d3.time.month(v.Date_1);
			};
			
			if (v.Round_4 !== 0) {
      			  p.latest = d3.time.month(v.Date_4);
		    } else if (v.Round_3 !== 0) {
      			  p.latest = d3.time.month(v.Date_3);
		    } else if (v.Round_2 !== 0) {
      			  p.latest = d3.time.month(v.Date_2);
		    } else if(v.Round_1 !== 0){
      			  p.latest = d3.time.month(v.Date_1);
		    } else {
 	  			  p.latest = new Date(1900, 0, 1);
			};
			
			if (v.Round_4 !== 0) {
      			  p.latest_round = v.Round_4;
		    } else if (v.Round_3 !== 0) {
      			  p.latest_round = v.Round_3;
		    } else if (v.Round_2 !== 0) {
      			  p.latest_round = v.Round_2;
		    } else if(v.Round_1 !== 0){
      			  p.latest_round = v.Round_1;
		    } else {
 	  			  p.latest_round = 0;
			};
					
            return p;
        },
        /* callback for when data is removed from the current filter results */
        function (p, v) {
            --p.count;
            p.Round_1 = 0;
            p.Round_2 = 0;
            p.Round_3 = 0;
            p.Round_4 = 0;
            p.latest_round = 0;
            p.Date_1 = new Date(1900, 0, 1);
            p.Date_2 = new Date(1900, 0, 1);
            p.Date_3 = new Date(1900, 0, 1);
            p.Date_4 = new Date(1900, 0, 1);
            p.total = 0;
            p.latest = new Date(1900, 0, 1);
            p.category = "";
            return p;
        },
        /* initialize p */
        function () {
            return {
                count: 0,
                Round_1:0,
                Round_2:0,
                Round_3:0,
                Round_4:0,
                total:0,
                latest_round:0,
                Date_1:new Date(1900, 0, 1),
                Date_2:new Date(1900, 0, 1),
                Date_3:new Date(1900, 0, 1),
                Date_4:new Date(1900, 0, 1),
                latest:new Date(1900, 0, 1),
                category:""
            };
        }
    );
  
var FranceFintechDimension = ndx.dimension(function (d) {
     return d.FF_membership;
  });
  
var FranceFintechDimensionGroup = FranceFintechDimension.group();

var category = ndx.dimension(function (d) {
      return d.Category;
  });

var categoryGroup = category.group();
  
var businessModel = ndx.dimension(function (d) {
     return d.Business_model;
  });

var businessModelGroup = businessModel.group();

var toggle_FF = 0;

var FF_caption = svg_FF.append("text")
        .attr()
        .text("M o d e")
        .attr("class", "text")
        .style("font-weight", "lighter")
        .attr("fill", "white")
        .style("opacity", 0.6)
        .attr("font-size", "18px")
        .attr("x", 140)
        .attr("y", 85);
        
var FF_trigger = svg_FF.append("text")
        .attr()
        .text("O F F")
        .style("font-weight", "bold")
        .attr("class", "text")
        .attr("fill", "white")
        .attr("font-size", "18px")
        .style("opacity", 0.6)
        .attr("x", 210)
        .attr("y", 85);
  
var FF = svg_FF.append("image")
    .attr("x", 0 )
    .attr("y", 0)
    .attr("width", 400)
    .attr("height", 100)
    .style("opacity", 0.6)
    .attr("xlink:href", FranceFintech)
    .attr("class", "image")
    .on("mouseover", function(){
      if (toggle_FF === 0) {
      FF.style("opacity", "1")
      FF_trigger.style("opacity", "1")
      FF_caption.style("opacity", "1")
      }
    })
    .on("mouseout", function(){
      if (toggle_FF === 0) {
      FF.style("opacity", "0.6")
      FF_trigger.style("opacity", "0.6")
      FF_caption.style("opacity", "0.6")
      }
    })
    .on("click", function() { 
      if(toggle_FF === 0) {
      FF.transition().duration(400).style("opacity", "1");
      FF_trigger.transition().duration(400).text("O N");
      FF_caption.transition().duration(400).style("opacity", "1");
      FranceFintechDimension.filterExact("X");
      update()
      dc.redrawAll();
      toggle_FF = 1;
      }
      else if (toggle_FF === 1) {
      FF.transition().duration(400).style("opacity", "0.6");
      FF_caption.transition().duration(400).style("opacity", "0.6");
      FF_trigger.transition().duration(400).text("O F F").style("opacity", "0.6");
      FranceFintechDimension.filterAll();
      update()
      dc.redrawAll();
      toggle_FF = 0;
      }
    });

businessModelPieChart
      .width(210)
      .height(210)
      .radius(103)
      .innerRadius(0)
      .dimension(businessModel)
      .group(businessModelGroup)
      .colors(['#04253e','#073559', '#51718a', '#9baebc'])
      .on("filtered", function (chart, filter) {update();});
      
categoryRowChart
      .width(400)
      .height(260)
      .dimension(category)
      .group(categoryGroup)
      .colors(['#c06054','#c9776d', '#d28e85', '#dba49d', '#e4bbb6', '#edd1ce', '#f6e8e6'])
      .on("filtered", function (chart, filter) {update();});
      
inceptionBarChart
      .width(402)
      .height(360)
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .x(d3.time.scale().domain([new Date(2006, 0, 1), new Date(2015, 6, 6)]))
	  .xUnits(d3.time.years)
      .dimension(yearlyInception)
      .group(yearlyInceptionGroup)
      .on("filtered", function (chart, filter) {update();});
      
totalLeve
	  .group(totalRaisedGroup)
	  .valueAccessor(total);

 
fundsChart
      .width(420)
      .height(380)
//       .elasticY(true)
//       .renderHorizontalGridLines(true)
	  .xUnits(d3.time.month)
      .dimension(Company)
//        .colorAccessor(function (d) {
//            return d.category;
//        })
       .valueAccessor(function (p) {
           return p.value;
 	  })
//       .keyAccessor(function (p) {
//           return p.value.latest;
//       })
//        .radiusValueAccessor(function (p) {
//            return 4;
//        })
      .x(d3.time.scale().domain([new Date(2008, 0, 1), new Date(2015, 6, 6)]))
//      .y(d3.scale.linear().domain([0, 200]))
 //     .r(d3.scale.linear().domain([0, 50]).range([0,100]))
      .compose([
        dc.lineChart(fundsChart).group(Round_1_Group),
        dc.lineChart(fundsChart).group(Round_2_Group),
        dc.lineChart(fundsChart).group(Round_3_Group),
        dc.lineChart(fundsChart).group(Round_4_Group)
       ])
      .on("filtered", function (chart, filter) {update();});
      
$(window).resize(function() {
    update();
});      
   
function update() {
    width_logo = $("#table_logos").parent().width();
    height_logo = $("#table_logos").parent().height();
    var svg_logo = d3.select("#table_logos").append("svg")
    			.attr("width", width_logo)
    			.attr("height", height_logo);
	
	console.log(width_logo);
	
d3.select(".logo_table").remove();

logo_table = svg_logo.append("g").attr("class", "logo_table");

logo_table.selectAll("image")
      .data(Company.bottom(Infinity))
      .enter()
      .append("image")
      .attr("class", "logos")
      .attr("xlink:href", function(d,i){
        return d.Logo;
      })
      .attr("class", "image")
      .attr("x", function(d,i){
        return i % 9 * (width_logo - margin.right - margin.left) / 9 ;
      })
      .attr("y", function(d,i){
        return Math.floor(i/9) % 8 * (height_logo - margin.top - margin.bottom) / 8 ;
      })
      .attr("width", 0)
      .attr("height", 0)
      .on("click", function(){
          init_message.remove();
          informations.remove();
          
          informations = svg.append("g").attr("class", "info");
        
          var startup = d3.select(this)[0][0].__data__;
          
          informations.append("image")
              .attr("width", 200)
              .attr("height", 100)
              .attr("x", width_logo * 2 /1.5)
              .attr("y", height_logo / 2 + 35)
              .attr("xlink:href", startup.Logo)
              .transition()
              .delay(0)
              .duration(500)
              .attr("x", function(d,i){
                return width_logo / 2 + 40;
              })
              .attr("width", 55)
              .attr("height", 40);
       })
    .transition()
    .delay(function(d,i){
      return i * 20;
      })
    .duration(500)
    .attr("width", (width_logo - margin.right - margin.left) / 9 / 1.15)
    .attr("height", (height_logo - margin.top - margin.bottom) / 8 / 1.15);;
}

update();








dc.renderAll();
}

d3.json("/static/data/data.json", function(error, data) {
graphiques(data);
});