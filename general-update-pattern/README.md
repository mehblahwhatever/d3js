# [General Update Pattern](http://bl.ocks.org/mbostock/3808218)

1. This example demonstrates D3's **general update pattern**, where a data-join is followed by operations on the *enter*, *update*, and *exit* selections. Enetering elements are shown in green, while updating elements are shown in black. Exiting elements are removed immediately, so they're invisible. This example does not use a key function for the data-join, so elements may change their associated letter. Entering elements are always added to the end: when the new data has more letters than the old data, new elements are entered to display the new letters. Likewise, exiting letters are always removed from the end when the new data has *fewer* letters than the old data.
2. By adding a key to the data-join, letters taht are already displayed are put in the update selection. Now updates can occur anywhere in the array, depending on the overlap between the old letters and the new letters. The text content only needs to be set on enter because the mapping from letter to element never changes; however, the x-position of the text element must now be recomputed on update as well as enter. It'll be easier to see what's going on when we add animated transitions next!
3. By adding transitions, we can more easily follow the elements as they are entered, updated and exited. separate transitions are defined for each of the three states. TO avoid repreating transition timing parameters for the enter, update, and exit selections, a top-level transition *t* sets the duration and then subsequent transitions use *selection* transition, passing in *t* to inherit timing.

```javascript
var t = d3.transition()
		.duration(750);
```