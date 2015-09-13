var width = $(window).width(),
    height = $(window).height();
    
function setWidth(width){
	if(width > 992) { return $(window).width() / 3 - 20 }
	else { return $(window).width() - 20}
}
    
var width_logo = 140, //marge de 20 pour la largeur
	height_logo = 60; // 15 pour la hauteur
    
var margin = { top: 0, bottom: 0, left: 0, right: 0 };

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
      d.Date_1 = dateFormat.parse(d.Date_1);
      d.Date_2 = dateFormat.parse(d.Date_2);
      d.Date_3 = dateFormat.parse(d.Date_3);
      d.Date_4 = dateFormat.parse(d.Date_4);
      d.Inception = dateFormat.parse(d.Inception);
  });


businessModelPieChart = dc.pieChart('#businessModelPieChart');
categoryRowChart = dc.rowChart('#categoryRowChart');
inceptionBarChart = dc.barChart('#inceptionBarChart');
totalLeve = dc.numberDisplay('#montant-leve');
fundsChart = dc.barChart("#fundsBarChart");

var ndx = crossfilter(data);
var all = ndx.groupAll();

var Company = ndx.dimension(function(d){
  return d.Company;
})

var yearlyInception = ndx.dimension(function (d) {
      return d3.time.year(d.Inception);
  });
  
var yearlyInceptionGroup = yearlyInception.group();

var total = function(d) {
      return d.n ? d.tot : 0;
      };

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
      update_logo();
      update_funds();
      dc.redrawAll();
      toggle_FF = 1;
      }
      else if (toggle_FF === 1) {
      FF.transition().duration(400).style("opacity", "0.6");
      FF_caption.transition().duration(400).style("opacity", "0.6");
      FF_trigger.transition().duration(400).text("O F F").style("opacity", "0.6");
      FranceFintechDimension.filterAll();
      update_logo();
      update_funds();
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
      .on("filtered", function (chart, filter) {update_logo(); update_funds();});
      
categoryRowChart
      .width(setWidth(width))
      .height(260)
      .dimension(category)
      .group(categoryGroup)
      .colors(['#c06054','#c9776d', '#d28e85', '#dba49d', '#e4bbb6', '#edd1ce', '#f6e8e6'])
      .on("filtered", function (chart, filter) {update_logo(); update_funds();});
      
inceptionBarChart
      .width(setWidth(width))
      .height(360)
      .gap (20)
      .centerBar(true)
      //.margins({right : 10, left : 20, top : 20, bottom : 20})
      .elasticY(true)
      .renderHorizontalGridLines(true)
      .x(d3.time.scale().domain([new Date(2006, 1, 31), new Date(2015, 6, 6)]))
	  .xUnits(d3.time.years)
	  .colors(["#9BAEBC"])
      .dimension(yearlyInception)
      .group(yearlyInceptionGroup)
      .on("filtered", function (chart, filter) {update_logo();      update_funds();})
      .yAxis()
      .tickFormat(function(v) { return Math.round(v) ;})
      .tickValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]);

window.onresize = function() {
width = $(window).width(),
height = $(window).height();

dc.renderAll();
update_logo();
} ;      

	var liste_companies = Company.bottom(Infinity);
	
	var array_results = [];
	
	for(elements = 0 ; elements < liste_companies.length ; elements++) {
		newjson = {} ;
		newjson.company = liste_companies[elements].Company;
		newjson.round = "Seed" ;
		newjson.date = liste_companies[elements].Date_1 ;
		newjson.amount = liste_companies[elements].Round_1 ;
		
		array_results.push(newjson) ;
		
		newjson = {} ;
		newjson.company = liste_companies[elements].Company;
		newjson.round = "Series A" ;
		newjson.date = liste_companies[elements].Date_2 ;
		newjson.amount = liste_companies[elements].Round_2 ;
		
		array_results.push(newjson) ;
		
		newjson = {} ;
		newjson.company = liste_companies[elements].Company;
		newjson.round = "Series B" ;
		newjson.date = liste_companies[elements].Date_3 ;
		newjson.amount = liste_companies[elements].Round_3 ;
		
		array_results.push(newjson) ;
		
		newjson = {} ;
		newjson.company = liste_companies[elements].Company;
		newjson.round = "Series C" ;
		newjson.date = liste_companies[elements].Date_4 ;
		newjson.amount = liste_companies[elements].Round_4 ;
		
		array_results.push(newjson) ;
	}
	
	ndx_2 = crossfilter(array_results);
	
	all_2 = ndx_2.groupAll();

	var company = ndx_2.dimension(function(d) {
		return d.company ;
	});
	
	var date = ndx_2.dimension(function(d) {
		return d3.time.year(d.date) ;
	});
	
	var round = ndx_2.dimension(function(d) {
		return d.round ;
	});
	
	var amount = ndx_2.dimension(function(d) {
		return d.amount ;
	});
	
var totalRaisedGroup = ndx_2.groupAll().reduce( 
          function (p, v) {
              ++p.n;
              p.tot += v.amount;
              return p;
          },
          function (p, v) {
              --p.n;
              p.tot -= v.amount;
              return p;
          },
          function () { return {n:0,tot:0}; }
);

totalLeve
	  .formatNumber(d3.format(".1f"))
	  .group(totalRaisedGroup)
	  .valueAccessor(total);	

trigger = 0;

fundsChart
      .renderHorizontalGridLines(true)
      .brushOn(true)
      .width(setWidth(width))
      .height(380)
      .legend(dc.legend().x(100).y(26).itemHeight(16).gap(21))
	  .dimension(date)
	  .gap(10)
	  .centerBar(true)
	  .group(date.group().reduceSum(function(d) { return d.round === 'Seed' ? d.amount : 0; }), "Seed")
	  .stack(date.group().reduceSum(function(d) { return d.round === 'Series A' ? d.amount : 0; }), "Series A")
	  .stack(date.group().reduceSum(function(d) { return d.round === 'Series B' ? d.amount : 0; }), "Series B")
	  .stack(date.group().reduceSum(function(d) { return d.round === 'Series C' ? d.amount : 0; }), "Series C")
	  .colors( ['#550805', '#A51D0C', '#c06054', '#d28e85'] )
	  .xUnits(d3.time.years)
      .x(d3.time.scale().domain([new Date(2008, 0, 1), new Date(2015, 11, 31)]))
      .on("filtered", function(chart, filter) {
    
	update_funds();
    
    var liste_com = company.bottom(Infinity); 	
    
    console.log(filter);
    
    if (filter != null) {

	var array_com = [];

	for(i = 0; i < liste_com.length; i++) {
		array_com.push(liste_com[i].company);
	}

	Company.filter(function(d) {

	if(array_com.indexOf(d) != -1) {
		return d;
	} });
	
	} else {
	
	Company.filter(null);
	
	}
	
	update_logo();
      	
      });
   
function update_funds() {

 	var liste_companies = Company.bottom(Infinity); 	

	company.filter(null);
	
	var array_companies = [];

	for(i = 0; i < liste_companies.length; i++) {
		array_companies.push(liste_companies[i].Company);
	}
	
	company.filter(function(d) {

	if(array_companies.indexOf(d) != -1) {
		return d;
	} });
	
}

function update_logo() {

	var nb_companies = (Company.bottom(Infinity)).length;
	
	d3.select(".logo_table").remove();
	d3.select("svg_logo").remove();
	$(".svg_img").remove();
	
	var nb_width = Math.floor(width / width_logo);
	var nb_height = Math.ceil(nb_companies / nb_width);
	
	$("div#table_logos").css("transition","height 1.3s");
	$("div#table_logos").css("height",nb_height * height_logo + 20 + "px");

    var svg_logo = d3.select("#table_logos").append("svg")
    			.attr("class", "svg_img")
    			.attr("width", width)
    			.attr("height", nb_height * height_logo + 20);
	
	var logo_table = svg_logo.append("g")
    			.attr("class", "logo_table")
    			.attr("transform", "translate(" + (width - nb_width * width_logo + 20) / 2 +  ",10)");

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
        return i % nb_width * width_logo ;
      })
      .attr("y", function(d,i){
        return Math.floor(i/nb_width) % nb_height * height_logo ;
      })
      .attr("width", 0)
      .attr("height", 0)
      .on("click", function(){
      
      	  var monthNames = ["January", "February", "March", "April", "May", "June",
 			 "July", "August", "September", "October", "November", "December"];
          
          var element = d3.select(this);
          
          $(".modal-company").text("- " + element[0][0].__data__.Company + " -");
          $(".modal-logo").attr("src", element[0][0].__data__.Logo);
          $(".modal-websitelink").attr("href", element[0][0].__data__.Website);
          
          var FFmembership = element[0][0].__data__.FF_membership ? "Yes" : "No" ;
          
          var investors_1 = (element[0][0].__data__.Investors_1 != "Undisclosed" && element[0][0].__data__.Investors_1 != undefined) ? element[0][0].__data__.Investors_1 : "undisclosed investors" ;
          var investors_2 = (element[0][0].__data__.Investors_2 != "Undisclosed" && element[0][0].__data__.Investors_2 != undefined) ? element[0][0].__data__.Investors_2 : "undisclosed investors" ;
          var investors_3 = (element[0][0].__data__.Investors_3 != "Undisclosed" && element[0][0].__data__.Investors_3 != undefined) ? element[0][0].__data__.Investors_3 : "undisclosed investors" ;
          var investors_4 = (element[0][0].__data__.Investors_4 != "Undisclosed" && element[0][0].__data__.Investors_4 != undefined) ? element[0][0].__data__.Investors_4 : "undisclosed investors" ;
          
          $(".modal-FFmembership").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; member : " + FFmembership );
          $(".modal-creation").text("Date of creation : " + monthNames[element[0][0].__data__.Inception.getMonth()] + " " + element[0][0].__data__.Inception.getFullYear());
          $(".modal-CEO").html("CEO : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; " + element[0][0].__data__.CEO);
          $(".modal-linkedin").attr("href", element[0][0].__data__.Linkedin);
          $(".modal-category").text("Category : " + element[0][0].__data__.Category);
          $(".modal-BM").text("Business type : " + element[0][0].__data__.Business_model);
          $(".modal-abstract").text(element[0][0].__data__.Abstract);
          $(".modal-headquarters").text("Headquarters : " + element[0][0].__data__.Headquarters);
          if(element[0][0].__data__.Competition) { $(".modal-competition").text("Competition : " + element[0][0].__data__.Competition) };
          if(element[0][0].__data__.Round_1 != "0") {$(".modal-round1").text("Seed round : €" + element[0][0].__data__.Round_1 + "m led by " + investors_1 + " on " + monthNames[element[0][0].__data__.Date_1.getMonth()] + " " + element[0][0].__data__.Date_1.getFullYear()) };
          if(element[0][0].__data__.Round_2 != "0") {$(".modal-round2").text("Series A : €" + element[0][0].__data__.Round_2 + "m led by " + investors_2 + " on " + monthNames[element[0][0].__data__.Date_2.getMonth()] + " " + element[0][0].__data__.Date_2.getFullYear()) };
		  if(element[0][0].__data__.Round_3 != "0") {$(".modal-round3").text("Series B : €" + element[0][0].__data__.Round_3 + "m led by " + investors_3 + " on " + monthNames[element[0][0].__data__.Date_3.getMonth()] + " " + element[0][0].__data__.Date_3.getFullYear()) };
		  if(element[0][0].__data__.Round_4 != "0") {$(".modal-round4").text("Series C : €" + element[0][0].__data__.Round_4 + "m led by " + investors_4 + " on " + monthNames[element[0][0].__data__.Date_4.getMonth()] + " " + element[0][0].__data__.Date_4.getFullYear()) };
          
          $(".modal-website").html("<a href='" + element[0][0].__data__.Website + "'>Website</a>");
          
          $('#myModal').modal('toggle'); 



       })
    .transition()
    .delay(function(d,i){
      return i * 20;
      })
    .duration(500)
    .attr("width", 120)
    .attr("height", 45);
}

update_logo();

dc.renderAll();
}

d3.json("/static/data/data.json", function(error, data) {
graphiques(data);
});