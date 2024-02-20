
function drag(event) {

	// This step is to filter mouse click event; only drag will trigger the drag and drop js routine

	event.preventDefault();

	dragStart(event);

}

function dragStart(event) {

	/* 
	This function identifies the item's box to be dragged, sets it's initial
	position, and moves it into a floating container ("dragBox") to give it
	structure while dragging.
	Also adds event listeners mousemove to update dragBox position
	and mouseup to drop the item and finish.
	*/

	// Get "draggable" item
	let dragItem = event.target.closest('.draggable');

	// Get itembox's initial position (relative to pointer and viewport) and size
	dragItemRect = {};
	dragItemRect.x = event.clientX - dragItem.getBoundingClientRect().x; //tr.pageX = 9
	dragItemRect.y = event.clientY - dragItem.getBoundingClientRect().y; //tr.pageY = 167
	dragItemRect.width = dragItem.getBoundingClientRect().width;
	dragItemRect.height = dragItem.getBoundingClientRect().height;

	dragHandle = event.target;

	// Create a "dragBox" element (in this case a table) to carry the item (wich, in this case, is just a table row)
	dragBox = document.createElement("table");
	dragBox.id = 'dragBox';
	dragBox.style.width = dragItemRect.width + 'px';
	dragBox.className = 'dragging';

	// Put the item into dragBox
	dragBox.appendChild(dragItem);

	// Append dragBox to document, to give it visibility
	document.body.appendChild(dragBox);

	// Add event listeners to follow mouse actions
	document.addEventListener('mousemove', mouseDragging);

	dragHandle.addEventListener('mouseup', dragEnd);

	// Set default and initial dropBoxes
	currentDropBox = defaultDropBox = document.querySelector('.lotBox');

	// First dragBox positioning
	mouseDragging(event);

}

async function dragEnd() {

	/*
	This function places the item's HTML element, that is being dragged, back into items table
	after element stored as currentDropBox ends.
	If dropBox is an item class (other than lotBox), adds "dropBox" class to the
	item element, so that another item can be dropped after, and items can be sorted in specific order
	inside an item class.
	*/
	if (!dragBox) return;

	// Recover item's HTML element from dragBox
	let dragItem = dragHandle.closest('.item');

	// Add/Remove "dropBox" class, according to currentDropBox value
	if (currentDropBox != defaultDropBox) {

		dragItem.classList.add('dropBox');

	} else {

		dragItem.classList.remove('dropBox');

	}		

	// Insert item element after dropBox
	currentDropBox.insertAdjacentElement('afterend', dragItem);

	// Cleaning, removing event listeners, back to normal
	dragBox.remove();

	highlightDropBox(currentDropBox, 'out');

	document.removeEventListener('mousemove', mouseDragging);

	dragHandle.removeEventListener('mouseup', dragEnd);

	delete dragItemRect;
	delete dragHandle;
	delete currentDropBox;
	delete defaultDropBox;

	// Display new item's order
	readItemsOrder();

}

// Auxiliares
	function mouseDragging(event) {

		/*
		This sets dragBox coords every time mousemove event is triggered on dragHandle.
		After that, mouseDragging checks if dragBox is being dragged over
		a dropBox and, if so, gets it so dragEnd() can work
		*/

		// If at this point, for some reason, there is no dragBox, abort
		if (!dragBox) return;

		// Set dragBox new coords
		dragBox.style.left = event.pageX - dragItemRect.x + 'px';

		dragBox.style.top = event.pageY - dragItemRect.y + 'px';


		// Hide dragBox just so JavaScript can pick the element just below it to see if it is a dropBox
		dragBox.hidden = true;

		let elementBelow = document.elementFromPoint(event.clientX, event.clientY);

		dragBox.hidden = false;

		if (!elementBelow) return;

		// If the element picked is a dropBox, keep it and do visual indications of changes when corresponds
		let dropBox = elementBelow.closest('.dropBox');

		// If dragBox is being dragged over a new dropBox, check if is leaving another, to back it to normal, and then highlight the new one
		if (dropBox != currentDropBox) {

			if (currentDropBox) {

				highlightDropBox(currentDropBox, 'out');

			}

			// If picked dropBox is null (means element below wasn't one), back to default
			currentDropBox = dropBox ?? defaultDropBox;

			highlightDropBox(currentDropBox, 'in');

		}

	}

	function highlightDropBox(dropBox, InOut) {

		/*
		This only works with dropBox being table-rows; if dragBox enters dropBox, set padding-bottom property value of each td inside dropBox to the height of dragBox; if leaves, set padding-bottoms back to 0
		*/
		let paddingBottom = (InOut == 'in') ? dragItemRect.height + 'px' : '0';

		for (let td of currentDropBox.children) {

			td.style.paddingBottom = paddingBottom;

		}

	}

	function readItemsOrder() {
		
		/*
		This function walks every itemClass and item row of items' table
		get the items order after dragEnd drops the item. Then displays the
		result on a div below item's table.
		*/
		let displayOrder = '';

		displayDiv.innerHTML = displayOrder;

		// Get items and item-class rows
		let rows = mainTable.querySelectorAll('.itemsClass, .item');

		let className;

		let emptyClass = false;

		for (let row of rows) {
			
			// Differentiate itemClass rows from item rows for give them different text decoration.
			// Also, if itemClass results with no items in it, display '<empty>'
			switch (true) {

				case row.classList.contains('itemsClass'): 

					if (emptyClass) displayOrder += '&emsp;<i>&lt;empty&gt;</i><br>';

					className = row.firstElementChild.innerText;

					displayOrder += '<b>' + className + '</b><br>';

					emptyClass = true;

					break;

				case row.classList.contains('item'):

					displayOrder += '&emsp;' + row.id + '<br>';

					emptyClass = false;

					break;

				default:

					break;

			}

		}

		if (emptyClass) displayOrder += '&emsp;<i>&lt;empty&gt;</i><br>';

		// Fill displayDiv with the result
		displayDiv.innerHTML = displayOrder;

	}

