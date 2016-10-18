# [Three Little Circles](https://bost.ocks.org/mike/circles/)

Once upon a time, there were three little circles.

```html
<svg width = "720" height = "120">
	<circle cx="40" cy="60" r="10"></circle>
	<circle cx="80" cy="60" r="10"></circle>
	<circle cx="120" cy="60" r="10"></circle>
</svg>
```

This tutorial shows you how to manipulate them using selections.

## Selecting Elements

The d3.selectAll method takes a selector string, such as "circle", and returns a *selection* representing all elements that match the selector:

```javascript
var circle = d3.selectAll("circle");
```

With a selection, we can make various changes to selected elements. For example, we might change the fill color using selection.style and the radius using selection.attr:

```javascript
circle.style("fill", "steelblue");
circle.attr("r", 30);
```

The above code sets styles and attributes for all selected elements to the same values.

We can also set values on a per-element basis by using anonymous functions. The function is evaluated once per selected element. Anonymous functions are used extensively in D3 to compute attribute values, particularly in conjunction with scales and shapes. To set each circle's x-coordinate to a random value:

```javascript
circle.attr("cx", function() {return Math.random() * 720;});
```

If you run this code repeatedly, the circles will dance.

## Binding Data

More commonly, we use *data* to drive the appearance of our circles. Let's say we want these circles to represent the numbers 32, 57 and 112. The selection.data method binds the numbers to the circles:

```javascript
circle.data([32, 57, 112]);
```

Data is specified as an array of values; this mirrors the concept of a selection, which is an array of elements. In the code above, the first number (the first *datum*, 32) is bound to the first circle (the first *element*, based on the order in which they are defined in the DOM), the second number is bound to the second circle, and so on.

After data is bound, it is accessible as the first argument to attribute and style functions. By convention, we typically use the name d to refer to bound data. To set the radius using the data:

```javascript
circle.attr("r", function(d) {return Math.sqrt(d);});
```

This results in a primitive visualization.

There's a second optional argument to each function you can also use: the *index* of the element within its selection. The index is often useful for positioning elements sequentially. Again by convention, this is often referred to as i. For example:

```javascript
circle.attr("cx", function (d, i) {return i * 100 + 30;});
```

Note that in SVG, the origin is in the top-left corner.

## Entering Elements

What if we had *four* numbers to display, rather than three? We wouldn't ahve enough circles, and we would need to create more elements to represent our data. You can append new nodes manually, but a more powerful alternative is the *enter* selection computed by a data join.

When joining data to elements, D3 puts any leftover data--or equivalently "missing" elements--in the enter selection. With only three circles, a fourth number would be put in the enter selection, while the other three numbers are returned directly (in the *update* selection) by selection.data.

By appending to the enter selection, we can create new circles for any missing data. The new circles will be appended to the element defined by parent selection. So, we select the "svg" element first, then select all "circle" elements, and then join them to data:

```javascript
var svg = d3.select("svg");

var circle = svg.selectAll("circle")
		.data([32, 57, 112, 293]);

var circleEnter = circle.enter().append("circle");
```

Entering elements are already bound to the data, so we can use data to compute attributes and styles, as well as set constant properties:

```javascript
circleEnter.attr("cy", 60);
circleEnter.attr("cx", function(d, i) {return i * 100 + 30;});
circleEnter.attr("r", function (d) {return Math.sqrt(d);});
```

Now we have four circles.

Taking this to the logical extreme, then, what if we have *no* existing elements, such as with an empty page? Then we're joinging data to an empty selection, and *all* data ends up in enter.

This pattern is so common, you'll often see the sellectAll + data + enter + append methods called sequentially, one immediately after the other. Despite it being common, keep in mind that htis is just one special case of a data join.

```javascript
svg.selectAll("circle")
		.data([32, 57, 112, 293])
	.enter().append("circle")
		.attr("cy", 60)
		.attr("cx", function(d, i) {return i * 100 + 30; })
		.attr("r", function (d) {return Math.sqrt(d);});
```

This enter pattern is often used in conjunction with method chaining, another technique for abbreviating code. Because D3 methods return the selection they act upon, you can apply multiple operations to the same selection.

## Exiting Elements

Often you have the opposite problem from *enter*: you have too many existing elements, and you want to remove some of them. Again you can select nodes and remove them manually, but the *exit* selection computed by a data join is more powerful.

The exit selection is the reflection of the enter selection: it contains the leftover elements for which there is no corresponding data.

```javascript
var circle = svg.selectAll("circle")
		.data([32, 57]);
```

All that's left to do, then, is to remove the exiting elements:

```javascript
circle.exit().remove();
```

And now we have two circles.

Of course, you aren't required to remove exiting elements immediately; for example, you might apply a transition to have them fade out or slide away.

## All Together

Putting everything together, consider the three possible outcomes that result from joining data to elements:

1. *enter* - incoming elements, entering the stage.
2. *update* - persistent elements, staying on stage.
3. *exit* - outgoing elements, exiting the stage.

By default, the data join happens by index: the first element is bound to the first datum, and so on. Thus, either the enter or exit selection will be empty, or both. If there are more data than elements, the extra data are in the enter selection. And if there are fewer data than elements, the extra elements are in the exit selection.

You can control precisely which datum is bound to which element by specifying a key funciton to selection.data. For example, by using the identity function, you can rebind the circles to new data while ensuring that existing circles are rebound to the same value in the new data, if any.

```javascript
var circle = svg.selectAll("circle")
		.data([32, 57, 293], function (d) {return d;});

circle.enter().append("circle")
		.attr("cy", 60)
		.attr("cx", function (d, i) {return i * 100 + 30;})
		.attr("r", function (d) {return Math.sqrt(d);});

circle.exit().remove();
```