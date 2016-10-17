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

That looks like:

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

