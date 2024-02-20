# JSDragnDrop
Drag and drop for complex (nested) HTML elements with JavaScript. Gives more control over visualization and effects than HTML drag event in those cases.

For this example, I made an items list with some item classes in wich items can be sorted and even in specific order.

I chose the 'table' element as structure of the items list.
Each row -except header's- are either an item or an item class, so an item can be dragged from it's initial position an dropped into a class to classify and sort it.
Last item class is for "unordered" and "unclassified" items; when an item is dropped in this class (or anywhere but a "dropBox"), it will be positioned on top of the list below this class row.
Each time items order is modified, the resulting order will be displayed below the items table.

* Details of items table structure in file index.html

MORE EXPLAINING:

		First I tried HTML native drag event but as I work with nested elements -not with just images- I had two problems: when an element is being dragged, HTML use a visualization effect that blurs it from the pointer out, so you can't see the whole element box and it just wasn't what I wanted; besides that, if you want to drag a nested element like a table row, or a table, or a div, you have to set the element's 'draggable' attribute as true, wich covers the whole element and it's content, then you can't reach the innerHtml so if you have a button you can't click it, or want to select some inner text, just can't, even if the element is stationary.
		Next, I removed the draggable attribute and tried pure JavaScript with HTML 'mousedown' event. It works good -it does 99% of the trick- but there is one little issue left: there is no discrimination between 'mousedown' and 'click', then the routine were triggered in both cases, even when any mouse button was just clicked on the element, and in some cases that resulted in unwanted sorting.
		Finally I added back the draggable attribute, only this time in a specific element inside item, trigger the routine with 'dragstart' event, and call a first-step function that acts as a bridge between both systems; this way a simple click is ignored and when an actual drag is started I just preventDefault and call my own JavaScript, non-dragevent, dragStart() function. It does the 100% of the trick.
