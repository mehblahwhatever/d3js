
var circle = d3.selectAll("circle");


circle.style("fill", "steelblue");
circle.attr("r", 30);

circle.attr("cx", function() {return Math.random() * 720;});

circle.data([32, 57, 112]);

circle.attr("r", function(d) {return Math.sqrt(d);});

circle.attr("cx", function (d, i) {return i * 100 + 30;});

var svg = d3.select("svg");

var circle = svg.selectAll("circle")
		.data([32, 57, 112, 293]);

var circleEnter = circle.enter().append("circle");

circleEnter.attr("cy", 60);
circleEnter.attr("cx", function(d, i) {return i * 100 + 30;});
circleEnter.attr("r", function (d) {return Math.sqrt(d);});



var circle = svg.selectAll("circle")
		.data([32, 57]);


circle.exit().remove();