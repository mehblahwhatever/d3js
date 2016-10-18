# [Let's Make a Bar Chart](https://bost.ocks.org/mike/bar/)

Say you have a little data, an array of numbers:

```javascript
var data = [4, 8, 15, 16, 23, 42];
```

A bar chart is a simple yet perceptually-accurate way to visualize such data. This introductory tutorial covers how to make a bar chart using the D3 JavaScript library. First we'll make a bare-bones version in HTML, then a more complete chart in Scalable Vector Graphics (SVG), and lastly animated transitions between views.

This tutorial assumes you know a little about web development: how to edit a web page and view it in your browser, how to load the D3 library, and the like. You might find it convenient to fork this [CodePen template](http://codepen.io/mbostock/pen/Jaemg) to get started.

## Selecting an Element

In vanilla JavaScript, you typically deal with elements one at a time. For example, to create a div element, set its contents, and then append it to the body:

```javascript
var div = document.createElement("div");
div.innerHTML = "Hello, world!";
document.body.appendChild(div);
```

With D3 (as with jQuery and other libraries), you instead handle groups of related elements called *selections.* Working with elements *en masse* gives selections their power; you can manipulate a single element or many of them without substantially restructuring your code. Although this may seem like a small change, eliminating loops and other control flow can make your code much cleaner.

A selection can be created in myriad ways. Most often you create one by querying a *selector,* which is a special string that identifies desired elements by property, say by name or class ("div" or ".foo", respectively). While you can create a selection for a single element:

```javascript
var body = d3.select("body");
var div = body.append("div");
div.html("Hello, world!");
```

You can just as easily perform the same operation on many elements:

```javascript
var section = d3.selectAll("section");
var div = section.append("div");
div.html("Hello, world!");
```

## Chaining Methods

Another convenience of selections is *method chaining*: selection methods, such as selection.attr, return the current selection. This lets you easily apply multiple operations to                   telements. To set the text color and background color of the body without method chaining, you'd say:

```javascript
var body = d3.select("body");
body.style("color", "black");
body.style("background-color", "white");
```

"Body, body, body!" Compare this to method chaining, where the repitition is eliminated:

```javascript
d3.select("body")
		.style("color", "black")
		.style("background-color", "white");
```

Note we didn't even need a var for the selected body element. After applying any operations, the selection can be discarded. Method chaining lets you write shorter code (and waste less time fretting over variable names).

There is a gotcha with method chaining, however: while most operations return the same selection, some methods return a new one! For example, selection.append returns a new selection containing new elements. This conveniently allows you to chain operations into the new elements

```javascript
d3.selectAll("section")
		.attr("class", "special")
	.append("div")
		.html("Hello, world!");
```

*The recommended indentation pattern for method chaining is four spaces for methods that preserve the current selection and two spaces for methods that change the selection.*

Since method chaining can only be used to descend into the document hierarchy, use var to keep references to selections and go back up.

```javascript
var section = d3.selectAll("section");

section.append("div")
		.html("First!");

section.append("div")
		.html("Second.");
```

## Coding a Chart, Manually

Now consider how you might create a bar chart *without* JavaScript. After all, there are only six numbers in this trivial data set, so it's not hard to write a few div elements by hand, set their width as a multiple of the data, and be done with it.

```html
<!DOCTYPE html>
<style>

	.chart div {
		font: 10px sans-serif;
		background-color: steelblue;
		text-align: right;
		padding: 3px;
		margin: 1px;	
		color: white;
	}

</style>

<div class="chart">
	<div style="width: 40px;">4</div>
	<div style="width: 80px;">8</div>
	<div style="width: 150px;">15</div>
	<div style="width: 160px;">16</div>
	<div style="width: 230px;">23</div>
	<div style="width: 420px;">42</div>
</div>
```

This chart has one div for a container, and one child div for each bar. The child divs have a blue background color and a white foreground color, giving the appearance of bars wtih right-aligned value labels. You could simplify this implementation even further by removing the containing chart div. But more commonly your page will contain content in addition to the chart, so having a chart container lets you position and style the chart without affecting the rest of the page.

## Coding a Chart, Automatically

Of course hard-coding is impractical for most datasets, and the point of this tutorial is to teach you how to create charts from data automatically. So let's create the identical structure using D3, starting with an empty page that contains only a div of class "chart". The following script selects the chart container and then appends a child div for each bar with the desired width:

```javascript
d3.select(".chart")
	.selectAll("div")
		.data(data)
		.enter()
	.append("div")
		.style("width", function (d) {return d * 10 + "px";})
		.text(function (d) {return d;});
```

Although partly familiar, this code introduces an important new concept -- the *data join*. Let's break it down, rewriting the concise code in long form, to see how it works.

First, we select the chart container using a class selector.

```javascript
var chart = d3.select(".chart");
```

Next we initialize the data join by defining the selection to which we will join data.

```javascript
var bar = chart.selectAll("div");
```

The data join is a general pattern that can be used to create, update or destroy elements whenever data changes. It might feel odd, but the benefit of this approach is taht you only have to learn and use a single pattern to manipulate the page. So whether you're building a static chart or a dynamic one with fluid transitions and object constancy, your code remains roughly the same. Think of the initial selection as declaring the elements you *want* to exist.

Next we join the data (defined previously) to the selection using selection.data.

```javascript
var barUpdate = bar.data(data);
```

*The data operator returns the update selection. The enter and exit selections hang off the update selection, so you can ignore them if you don't need to add or remove elements.*

Since we know the selection is empty, the returned *update* and *exit* selections are also empty, and we need only handle the *enter* selection which represents new data for which there was no existing element. We instantiate these missing elements by appending to the enter selection.

```javascript
var barEnter = barUpdate.enter().append("div");
```

Now we set the width of each new bar as a multiple of the associated data value, d.

```javascript
barEnter.style("width", function(d) {return d * 10 + "px"; });
```

Because these elements were created with the data join, each bar is already bound to data. We set the dimensions of each bar based on its data by passing a funciton to compute the width style property.

Lastly, we use a function to set the text content of each bar, and produce a label.

```javascript
barEnter.text(function(d) {return d;});
```

*When formatting numbers for text labels, you may want to use d3.format for rounding and grouping to improve readablity.*

D3's selection operators such as attr, style, and property, allow you to specify the value either as a constant (the same for all selected elements) or a function (computed separately for each element). If the value of a particular attribute should be based ont eh element's associated data, then use a function to compute it; otherwise, if it's the same for all the elements, then a string or number suffices.

## Scaling to Fit

One weakness of the code above is the magic number 10, which is used to scale the data value to the appropriate pixel width. This number depends on the domain fo the data (the minimum and maximum value, 0 and 42, respectively), and the desired width of the chart (420), but of course these dependencies are only implicit in the value 10.

We can make these dependencies explicit and eliminate the amgic number by using a linear scale. D3's scales specify a mapping from data space (*domain*) to display space (*range*):

```javascript
var x = d3.scale.linear()
		.domain([0, d3.max(data)])
		.range([0, 420])
```

* D3's scales can also be used to interpolate many other types of display-space values, such as paths, color spaces and geometric transforms.*

Although x here looks like an object, it is also a function that returns the scaled display value in the range for a given data value in the domain. For example, an input value of 4 returns 40, and an input value of 16 returns 160. To use the new scale, simply replace the hard-coded multiplication by calling the scale function:

```javascript
d3.select(".chart")
	.selectAll("div")
		.data(data)
		.enter()
	.append("div")
		.style("width", function (d) {return x(d) + "px";})
		.text(function (d) { return d;});
```

## Introducing SVG

Whereas HTML is largely limited to rectangular shapes, SVG supports powerful drawing primitives like Bezier curves, gradients, clippling and masks. We won't need all of SVG's extensive featur set for a lowly bar chart, but learning SVG is a worthwhile addition to your visual lexicon when it comes to designing visualizations.

Like anything, this richness necessarily comes at a cost. The large SVG specification may be intimidating, but remember that you don't need to master every feature to get started. Browsing examples is an enjoyable way to pick up new techniques.

*You can export SVG directly from desktop applications such as Adobe Illustrator, which allows hybrid approaches that combine hand-drawn shapes with data.*

And despite obvious differences, SVG and HTML share many similarities. You can write SVG markup and embed it directly in a web page (provided you use ```<!DOCTYPE html>```). You can inspect SVG elements in your browser's developer tools. And SVG elements can be styled with CSS, albeit using different property names like fill instead of background-color. However, unlike HTML, SVG elements must be positioned relative to the top-left corner of the container; SVG does not wupport flow layour or even text wrapping.

## Coding a Chart, Manually

Before we construct the new chart using JavaScript, let's revisit the static specification in SVG.

```html
<!DOCTYPE html>
<style>
	
	.chart rect {
		fill: steelblue;
	}

	.chart text {
		fill: white;
		font: 10px sans-serif;
		text-anchor: end;
	}

</style>
<svg class="chart" width="420" height="120">
	<g transform="translate(0,0)">
		<rect width="40" height+"19"></rect>
		<text x = "37" y = "9.5" dy = ".35em">4</text>
	</g>
	<g transform="translate(0,20)">
		<rect width="80" height="19"></rect>
		<text x="77" y="9.5" dy=".35em">8</text>
	</g>
	<g transform="translate(0,40)">
		<rect width="150" height="19"></rect>
		<text x="147" y="9.5" dy=".35em">15</text>
	</g>
	<g transform="translate(0,60)">
		<rect width="160" height="19"></rect>
		<text x="157" y="9.5" dy=".35em">16</text>
	</g>
	<g transform="translate(0,80)">
		<rect width="230" height="19"></rect>
		<text x="227" y="9.5" dy=".35em">23</text>
	</g>
	<g transform="translate(0,100)">
		<rect width="420" height="19"></rect>
		<text x="417" y="9.5" dy=".35em">42</text>
	</g>
</svg>
```

As before, a stylesheet applies colors and other aesthetic properties to the SVG elements. But unlike the div elements that were implicitly positioned using flow layout, the SVG elements must be absolutely positioned with hard-coded translations relative to the origin.

A common point of confusion in SVG is distiguishing between the properties taht must be specified as attributes and properties that can be set as styles. The full list of styleing properties is documented in the specification, but a quick rule of thumb is that geometry (such as the width of a rect element) must be specified as attributes, while aesthetics (such as fill color) can be specified as styles. While you can use attributes for anything, I recommend you prefer styles for aesthetics; this ensures any inline styles play nicely with cascading stylesheets.

SVG requires text to be placed explicitly in text elements. Since text elements do not support padding or margins, the text position must be offset by three pixels from the end of the bar, while the dy offset is used to center the text vertically.

Despite its very different specification, the resulting chart is identical to the previous one.

## Coding a Chart, Automatically

Next let's construct the chart using D3. By now, parts of this code should look familiar:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<style>
	
	.chart rect {
		fill: steelblue;
	}

	.chart text {
		fill: white;
		font: 10px sans-serif;
		text-anchor: end;
	}

</style>
<svg class="chart"></svg>
<script type="text/javascript" src="http://d3js.org/d3.v3.min.js"></script>
<script>
	
	var data = [4, 8, 15, 16, 23, 42];

	var width = 420,
			barHeight = 20;

	var x = d3.scale.linear()
			.domain([0, d3.max(data)])
			.range([0, width]);

	var chart = d3.select(".chart")
			.attr("width", width)
			.attr("height", barHeight * data.length);

	var bar = chart.selectAll("g")
			.data(data)
			.enter()
		.append("g")
			.attr("transform", function (d, i) {return "translate(0, " + i * barHeight + ")";});

	bar.append("rect")
			.attr("width", x)
			.attr("height", barHeight - 1);

	bar.append("text")
			.attr("x", function (d) {return x(d) - 3;})
			.attr("y", barHeight / 2)
			.attr("dy", ".35em")
			.text(function (d) {return d;});

</script>
```

We set the svg element's size in JavaScript so that we can compute the height based on the size of the dataset (data.length). This way, the size is based on the height of each bar rather than the overall height of the chart, and we ensure adequate room for labels.

Each bar consists of a g element which in turn contains a rect and a text. We use a data join (an enter selection) to create a g element for each data point. We then translate the g element vertically, creating a local origin for positioning the bar and its associated label.

Since there is exactly one rect and one text element per g element, we can append these elements directly to the g, without needing additional data joins. Data joins are only needed when creating a *variable* number of children based on data; here we are appending just *one* child per parent. The appended rects and texts inherit data from their parent g element, and thus we can use data to compute the bar width and label position.

## Loading Data

Let's make this chart more realistic by extracting the dataset into a separate file. An external data file separates the chart implementation from its data, making it easier to reuse the implementation on multiple datasets or even live data that changes over time.

Tab-separated values (TSV) is a convenient tabular data format. This format can be exported from Microsoft Excel and other spreadsheet programs, or authored by hand in a text editor. Each line represents a table row, where each row consists of multiple columns separated by tabs. The first line is the header row and specifies the column names. Whereas before our dataset was a simple array of numbers, now we'll add a descriptive name column. Our data file now looks like this:

```tsv
name 	value
Locke 	4
Reyes 	8
Ford 	15
Jarrah 	16
Shepard 	23
Kwon 	42
```

*When authoring by hand, note that delimiters (tabs for TSV and commas for CSV), newlines and double quotes must be escaped with double quotes!*

To use this data in a web browser, we need to download the file from a web server and then parse it, which converts the text of the file into usable JavaScript objects. Fortunately, these two tasks can be performed by a single function, d3.tsv.

Loading data introduces a new complexity: downloads are *asynchronous*. When you call d3.tsv, it returns immediately while the file downloads in the background. At some point in the future when the download finishes, your callback function is invoked with the new data, or an error if the download failed. In effect your code is evaluated out of order:

```javascript
// 1. Code here runs first, before the download starts

d3.tsv("data.tsv", function (error, data) {
	// 3. Code here runs last, after the download finishes.
});

// 2. Code here runs second, while the file is downloading.
```

Thus we need to separate the chart implementation into two phases. First, we initialize as much as we can wehn the page loads and before the data is available. It's good to set the chart size when the page loads, so that the page does not reflow after the data downloads. Second, we complete the remainder of the chart inside the callback function.

Restructuring the code:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<style>

.chart rect {
	fill: steelblue;
}

.chart text {
	fill: white;
	font: 10px sans-serif;
	text-anchor: end;
}

</style>
<svg class="chart"></svg>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var width = 420,
		barHeight = 20;

var x = d3.scale.linear()
		.range([0, width]);

var chart = d3.select(".chart")
		.attr("width", width);

d3.tsv("data.tsv", type, function (error, data) {
	x.domain([0, d3.max(data, function (d) {return d.value;})]);

	chart.attr("height",  barHeight * data.length);

	var bar = chart.selectAll("g")
			.data(data)
		.enter().append("g")
			.attr("transform", function (d, i) {return "translate(0, " + i * barHeight + ")";});

	bar.append("rect")
			.attr("width", function (d) { return x(d.value); })
			.attr("height", barHeight - 1);

	bar.append("text")
			.attr("x", function (d) {return x(d.value) - 3; })
			.attr("y", barHeight / 2)
			.attr("dy", ".35em")
			.attr(function (d) {return d.value;});
});

function type (d) {
	d.value = +d.value; // coerce to number
	return d;
} 

</script>
```

So, what changed? Although we declared the x-scale in the same place as before, we can't define the domain until the data is loaded, because the domain depends on the maximum value. Thus, the domain is set inside the callback function. Likewise, although the width of the chart can be set statically, the height of the chart depends on the number of bars and thus must be set in the callback function.

Now that our dataset contains both names and values, we must refer to the value as d.value rather than d; each point is an object rather than a number. The equivalent representation in JavaScript would look like this:

```javascript
var data = [
	{name: "Locke", value: 4},
	{name: "Reyes", value: 8},
	{name: "Ford", value: 15},
	{name: "Jarrah", value: 16},
	{name: "Shephard", value: 23},
	{name: "Kwon", value: 42}
];
```

Any place in the onld chart implementation we referred to d must now refer to d.value. In particular, whereas before we could pass the scale x to comput the width of the bar, we must now specify a function that passes the data value to the scale: ```function (d) { return x(d.value); }```. Likewise, when computing the maximum value from our dataset, we must pass an accessor function to d3.max that tells it how to evaluate each data point.

Here's one more gotcha with external data: types! The name column contains strings while the value column contains numbers. Unfortunately, d3.tsv isn't smart enough to detect and convert types automatically. Instead, we specify a type function that is passed as the second argument to d3.tsv. This type conversion function can modify the data object representing each row, modifying or converting it to a more suitable representation.

```javascript
function type (d) {
	d.value = +d.value; // coerce to number
	return d;
}
```

*The type conversion function can also return null, in which case the row will be ignored. This is useful for filtering datasets on the client.*

Type conversion isn't strictly required, but it's an awfully good idea. By default, all columns in TSV and CSV files are strings. If you forget to convert strings to numbers, then JavaScript may not do what you expect, say returning "12" for "1" + "2" rather than 3. Similarly, if you sort strings rather than numbers, the lexicographic behavior of d3.max may surprise you!

## Rotating into Columns

Rotating a bar chart into a column chart largely involves swapping *x* with *y*. However, a number of smaller incidental changes are also required. This is the cost of working directly with SVG rather than using a high-level visualization grammar like ggplot2. On the other hand, SVG offers greater customizability; and SVG is a web standard, so we can use the browser's developer tools like the element inspector, and use SVG for things beyond visualization.

When renaming the x scale to the y scale, the range becomes [height, 0] rather than [0, width]. This is because the origin of SVG's coordinate system is in the top-left corner. We want the zero-value to be positioned at the bottom of the chart, rather than at the top. Likewise this means that we need to position the bar rects by setting the "y" and "height" attributes, whereas before we only needed to set "width". (The default value of the "x" attribute is zero, and the old bars were left-aligned.)

We previously multiplied the var barHeight by the index of each data point (0, 1, 2, ...) to produce fixed-height bars. The resulting chart's height thus depended on the size of teh dataset. But here the opposite behavior is desired: the chart width is fixed and the bar width is variable. So rather than fix the barHeight, now we compute the barWidth by dividing the available chart width by the size of the dataset, data.length.

Lastly, the bar labels must be positioned differently for columns rather than bars, centered just below the top of the column. The new "dy" attribute value of ".75em" anchors the label at approximately the text's cap height rather than the baseline.

```html
<!DOCTYPE html>
<meta charset="utf-8">
<style>

.chart rect {
	fill: steelblue;
}

.chart text {
	fill: white;
	font: 10px sans-serif;
	text-anchor: middle;
}

</style>
<svg class="chart"></svg>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var width = 960,
		height = 500;

var y = d3.scale.linear()
		.range([height, 0]);

var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height);

d3.tsv("data.tsv", type, function (error, data) {
	if(error) {
		console.error(error);
		return;
	}

	y.domain([0, d3.max(data, function (d) {return d.value;})]);

	var barWidth = width / data.length;

	var bar = chart.selectAll("g")
			.data(data)
		.enter().append("g")
			.attr("transform", function (d, i) {return "translate(" + i * barWidth + ", 0)";});

	bar.append("rect")
			.attr("y", function (d) {return y(d.value);})
			.attr("height", function (d) {return height - y(d.value);})
			.attr("width", barWidth - 1);

	bar.append("text")
			.attr("x", barWidth / 2)
			.attr("y", function (d) {return y(d.value) + 3;})
			.attr("dy", ".75em")
			.text(function (d) {return d.value;});
});

function type (d) {
	d.value = +d.value; // coerce to number
	return d;
}

</script>
```

## Encoding Ordinal Data

Unlike *quantitative* values that can be compared numerically, subtracted or divided, *ordinal* values are compared by rank. Letters are ordinal; in the alphabet, A occurs before B, and B before C. Whereas D3's linear, pow and log scales serve to encode quantitative data, ordinal scales encode ordinal data. We can thus use an ordinal scale to simplify the positioning of bars by letter.

In its most explicit form, an ordinal scale is a mapping from a discrete set of data values (such as names) to a corresponding discrete set of display values (such as pixel positions). Like quantitative scales these sets are called the *domain* and *range*, respectively.

```javascript
var x = d3.scale.ordinal()
		.domain(["A", "B", "C", "D", "E", "F"])
		.range([0, 1, 2, 3, 4, 5]);
```

*To keep this example code short, only the first six letters of the alphabet are shown. In the full code below, we'll compute the scale's domain from the data and it will include every letter.*

The result of x("A") is 0, x("B") is 1, and so on. In specifying the domain and range, all that matters is the order of values: element *i* in the domain is mapped to element *i* in the range.

It would be tedious to enumerate the positions of each bar by hand, so instead we can convert a continuous range into a discrete set of values using rangeBands or rangePoints. The rangeBands method computes range values so as to divide the chart area into evenly-spaced, evenly-sized bands, as in a bar chart. This similar rangePoints method computes evenly-spaced range values as in a scatterplot. For example:

```javascript
var x = d3.scale.ordinal()
		.domain(["A", "B", "C", "D", "E", "F"])
		.rangeBands([0, width]);
```

*The full range can be retrieved for inspection with x.range().* 

If width is 960, x("A") is now 0 and x("B") is 160, and so on. These positions serve as the left edge of each bar, while x.rangeBand() returns the width of each bar. But rangeBands can also add padding between bars with an optional third argument, and the rangeRoundBands variant will comput positions that snap to exact pixel boundaries for crisp edges. Compare:

```javascript
var x = d3.scale.ordinal()
		.domain(["A", "B", "C", "D", "E", "F"])
		.rangeBoundBands([0, width], .1);
```

Now x("A") is 17 and each bar is 141 pixels wide. And, rather than hard-code the letters in our domain, we can compute them from data using array.map and array.sort. All together:

```javascript
<!DOCTYPE html>
<meta charset="utf-8">
<style>

.chart rect {
	fill: steelblue;
}

.chart text {
	fill: white;
	font: 10px sans-serif;
	text-anchor: middle;
}

</style>
<svg class="chart"></svg>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var width = 960,
		height = 500;

var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
		.range([height, 0]);

var chart = d3.select(".chart")
		.attr("width", width)
		.attr("height", height);

d3.tsv("data.tsv", type, function (error, data) {
	if(error){
		console.error(error);
		return;
	}

	x.domain(data.map(function (d) {return d.name;}));
	y.domain([0, d3.max(data, function (d) {return d.value})]);

	var bar = chart.selectAll("g")
			.data(data)
		.enter().append("g")
			.attr("transform", function (d) {return "translate(" + x(d.name) + ",0)";});

	bar.append("rect")
			.attr("y", function (d) {return y(d.value);})
			.attr("height", function (d) {return height - y(d.value);})
			.attr("width", x.rangeBand());

	bar.append("text")
			.attr("x", x.rangeBand() / 2)
			.attr("y", function (d) { return y(d.value) + 3; })
			.attr("dy", ".75em")
			.text(function (d) {return d.value});
});

function type (d) {
	d.value = +d.value; // coerce to number
	return d;
}

</script>
```

## Preparing Margins

Ordinal scales are often used in conjunction with D3's axis component to quickly display labeled tick marks, improving the chart's legibility. But before we can add an axis, we need to clear some space in the margins.

*Unlike HTML, the SVG container is implicitly overflow: hidden. IE9 allows overflow, but other browsers do not, so you shouldn't rely on it.*

By convention, margins in D3 are specified as an object with a top, right, bottom and left properties. Then, the *outer* size of the chart area, which includes the margins, is used to compute the *inner* size available for graphical marks by subtracting the margins. For example, reasonable values for a 960x500 chart are:

```javascript
var margin = {top: 20, right: 30, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
```

Thus, 960 and 500 are the outer width and height, respectively, while the compound inner width and height are 890 and 450. These inner dimensions can be used to initialize scale ranges. To apply the margins to the SVG container, we set the width and height of the SVG element to the outer dimensions, and add a g element to offset the origin of the chart area by the top-left margin.

```javascript
var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
```

Any elements subsequently added to the chart will thus inherit the margins.

## Adding Axes

We define an axis by binding it to our existing x-scale and declaring one of the four orientations. Since our x-axis will appear below the bars, here we use the "bottom" orientation.

```javascript
var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");
```

The resulting xAxis object will be used to render multiple axes by repeated application using the selection.call. Think of it as a rubber stamp which can print out axes wherever they are needed. The axis elements are positioned relative to a local origin, so to transform into the desired position we set the "transform" attribute on a containing g element:

```javascript
chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);
```

The axis container should also have a class name so that we can apply styles. The name "axis" here is arbitrary; call it whatever you like. Multiple class names, such as "x axis", are useful for styling axes differently by dimension while retaining some shared styles across dimensions.

The axis component consists of a path element which displays the domain, and multiple g ".tick" elements for each tick mark. A tick in turn contains a text label and a line mark. Most of D3's examples therefore use the following minimalist style:

```css
.axis text {
	font: 10px sans-serif;
}

.axis path,
.axis line {
	fill: none;
	stroke: #000;
	shape-rendering: crispEdges;
}
```

Beyond syles, you can further customize the appearance of an axis by selecting its elements and modifying them after the axis is created; the elements of an axis are part of its public API.

With axes, we can now remove the labels from the bar. The complete code:

```html
<!DOCTYPE html>
<meta charset="utf-8">
<style>

.bar {
	fill: steelblue;
}

.axis text {
	font: 10px sans-serif;
}

.axis path,
.axis line {
	fill: none;
	stroke: #000;
	shape-rendering: crispEdges;
}

.x.axis path {
	display: none;
}

</style>
<svg class="chart"></svg>
<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script>

var margin = {top: 20, right: 30, bottom: 30, left: 40},
		width = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
		.range([height, 0]);

var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

var chart = d3.select(".chart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", type, function (error, data){
	if(error) {
		console.error(error);
		return;
	}

	x.domain(data.map(function (d) {return d.name}));
	y.domain([0, d3.max(data, function (d) {return d.value;})]);

	chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0, " + height + ")")
			.call(xAxis);

	chart.append("g")
			.attr("class", "y axis")
			.call(yAxis);

	chart.selectAll(".bar")
			.data(data)
		.enter().append("rect")
			.attr("class", "bar")
			.attr("x", function (d) {return x(d.name);})
			.attr("y", function (d) {return y(d.value);})
			.attr("height", function (d) {return height - y(d.value);})
			.attr("width", x.rangeBand());

});

function type(d) {
	d.value = +d.value; // coerce to number
	return d;
}

</script>
```

## Communicating

At this point in the tutorial, I must apologize. I have done you a disservice.

In my effor to explain the technical details of chart construction, I have glossed over a critical component of effective visualization: *effective communication*. It doesn't matter how good a chart looks if it doesn't communicate anything! We must label the chart to give the reader sufficient context to interpret it.

This problem is more pervasive than you might expect. When visualizing data, it's easy to internalize and forget the extra knowledge you have about your dataset or your intent. *You* know it's a bar chart of relative frequency of letters in the English language. But unless you state that explicitly, your reader may not. Labels, captions, legends and other explanatory elements are essential to understanding. A title can be added to the y-axis by appending a text element and positioning it as desired.

```javascript
chart.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");
```

Unit-appropriate number formatting also improves legibility by tailoring the display to your data. Since our chart displays relative frequency, percentages are more appropriate than the default behavior which shows a number between 0 and 12. A format string as the second argument to axis.ticks will customize the tick formatting, and the scale will automatically choose a precision appropriate to the tick interval.

```javascript
var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10, "%");
```

*For total control over formatting, you can instead pass a function to axis.tickFormat.*