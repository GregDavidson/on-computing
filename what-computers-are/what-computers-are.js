// javascript code to animate the tech-note "What Computers Are"
// Started by jgd April 2009 with Charles Sickles
// Continuing with Kim Syfrett February 2012

function errors_this() { alert( [].join(arguments, " ") ); return this; }
function errors() { return errors_this.apply(undefined, arguments); }

// We depend on some recent JavaScript methods:
if ( typeof  [].forEach !== 'function' ) errors('[].forEach() missing!');
if ( typeof  [].filter !== 'function' ) errors('[].filter() missing!');
if ( typeof  [].every !== 'function' ) errors('[].every() missing!');
if ( typeof  [].reduce !== 'function' ) errors('[].reduce() missing!');
if ( typeof  Object.keys !== 'function' ) errors('Object.keys() missing!');

// return non-empty string padded with blanks at both ends
function padded(string) {
	if ( ! string || typeof string !== "string" || string === "" ) return "";
	if ( string.charAt(0) !== " " ) string = " " + string;
	if ( string.charAt(string.length-1) !== " " ) string += " ";
	return string;
}

klas = {			// Padded classNames providing hooks for this code
	sw_: " sw_ ",				// image showing state of switch
	sw: " sw ",					// switch of 2 switch states
	on: " on ",					// switch in state "ON"
	off: " off ",					// switch in state "OFF"
	sw_tree: " sw_tree ",			// tree with 1 switch + elements it toggles
	register: " register ",	//  tree with switches making multiple-bit register
	hide: " hide ",			// hidden element (and subtree)
	show: " show ",			// hideable but currently shown element
	// Within a .register tree, some nodes may have classes:
	register_int: " register_int ", // get int from local register
	register_width: " register_width ", // get width from local register
	register_color: " register_color ",		// get color from local register
	register_bg_color: " register_bg_color "	// bg color from local register
};

function checkKlas(f, klas) {
	if ( typeof klas !== "string" ) return errors(f, "type", typeof klas);
	if ( klas.charAt(0) !== " " ) return errors(f, "-->", klas);
	if ( klas.charAt(klas.length-1) !== " " ) return errors(f, klas, "<--");
	return klas;
}
											
function on_off(flag) { return flag ? klas.on : klas.off; }

function checkNode(f, node) {
	if ( ! node ) return errors(f, "expected node!");
	if ( ! node.nodeType ) return errors(f, "expected nodeType!");
	return node;
}

function isElementNode(node) {
	var f = arguments.callee.name;
	return checkNode(f, node).nodeType === 1;
}

function checkElement(f, node) {
	if ( checkNode(f, node).nodeType === 1 ) return node;
	return errors(f, "nodeType", node.nodeType,  "not ElementNode");
}

// return wheter node's classlist contains klas
function hasKlas(node, klas) {
	var f = arguments.callee.name;
	checkElement(f, node);
	checkKlas(f, klas);
	return padded(node.className).indexOf(klas) >= 0;
}

function hasKlasList(node, klaslist) {
	return klaslist.every(
		function(klas) { return hasKlas(this, klas); }, node
		);
}

function hasKlasses(node) {
	return hasKlasList(node, [].slice.call(arguments, 1));
}

// accumulate nodes in tree with all specified klasses
// by pushing them onto nodes array
function withKlassesAccum(tree, klasses, nodes) {
	if ( ! isElementNode(tree) ) return nodes;
	if ( hasKlasList(tree, klasses) ) nodes.push(tree);
	var i, children = tree.childNodes;
	for (i = 0; i < children.length; i++) {
		withKlassesAccum(children[i], klasses, nodes);
	}
	return nodes;
}

// better than getElementsByClassName which isn't working
function withKlasses(node) {
		var f = arguments.callee.name;
		checkElement(f, node);
		return withKlassesAccum(node, [].slice.call(arguments, 1), []);
}

// delete klas from node's class list if present
// return whether class list was modified
function delKlas(node, klas) {
		var f = arguments.callee.name;
		checkKlas(f, klas);
		var names = padded(node.className);
		var start = names.indexOf(klas);
		if ( start < 0 ) return false;
		node.className = names.substr(0, start) +
				names.substr(start + klas.length);
		return true;
}

// add klas to node's class list if not already there
// return whether class list was modified
function addKlas(node, klas) {
		var f = arguments.callee.name;
		checkKlas(f, klas);
		var names = padded(node.className);
		if ( names.indexOf(klas) >= 0 ) return false;
		node.className = names + klas.slice(1);
		return true;
}

function hideNode(node) {
		delKlas(node, klas.show);
		addKlas(node, klas.hide);
}

function showNode(node) {
		delKlas(node, klas.hide);
		addKlas(node, klas.show);
}

function hasTagKlas(node, tagName, klas) {
		return node.tagName == tagName && hasKlas(node, klas);
}

function checkTagKlas(f, node, tagName, klas) {
		if ( ! checkElement(f, node) ) return false;
		if ( tagName && node.tagName !== tagName ) {
				return errors(f, "tag", node.tagName, "not", tagName);
		}
		if ( ! klas || hasKlas(node, klas) ) return node;
		return errors(f,"tag",node.tagName,"class",node.className, "not",klas);
}

function toggle_sw_state(node, state) {
		var f = arguments.callee.name;
		if ( ! isElementNode(node) ) return true;
		var nodes_to_show = withKlasses(node, on_off(state), klas.hide);
		if ( ! nodes_to_show ) {
				return errors_this.call(false, f, "expected nodes to show!");
		}
		nodes_to_show.forEach( showNode );
		withKlasses(node, on_off(!state), klas.show).forEach( hideNode );
		return true;
}

function ancestorTagKlas(node, tagName, klas) {
		while ( node && node.nodeType &&
						! hasTagKlas(node, tagName	|| node.tagName, klas) ) {
				node = node.parentNode;
		}
		return node;
}

// find all switches inside the given tree
// breadth-first ( not by getElementsByClassName )
// and compute their value as a register
// function register_int(tree, accum) {
// 		if ( ! isElementNode(tree) ) return accum;
// 		if ( typeof tree.sw_bool === "boolean" ) {
// 				accum = (accum <<  1) + (tree.sw_bool ? 1 : 0);
// 		}
// 		var i, children = tree.childNodes;
// 		for (i = 0; i < children.length; i++) {
// 				accum = register_int(children[i], accum);
// 		}
// 		return accum;
// }

// find all switches inside given tree breadth-first
// and compute their value as a register
function register_int(tree) {
		return withKlasses(tree, klas.sw).reduce(
				function (accum, sw) {
						return (accum <<  1) + (sw.sw_bool ? 1 : 0);
				}, 0
		);
}

// firstTextChild returns the first text child of the
// given parent or null if none was found.
// Note: text nodes have a nodeType of 3.
function firstTextChild(parent) {
		var index;
		for (index = 0; index < parent.childNodes.length; index++) {
				if ( parent.childNodes[index].nodeType == 3 ) {
						return parent.childNodes[index];
				}
		}
		return undefined;
}

// setTextChild setstext data of first text child to
// given string value, creating text node if none exists
function setTextChild(parent, string) {
		var f = arguments.callee.name;
		var type = typeof string;
		if ( type !== 'string' ) return errors(f, 'typeof data =', type);
		var child = firstTextChild(parent);
		if ( ! child ) {
				child = document.createTextNode(string);
				parent.appendChild(child);
		} else {
				child.nodeValue = string;
		}
		return child.nodeValue;
}

// A SPAN.sw switch contains two .sw_ (switch state)  images,
//	- a .off switch + a .on switch
// - both use this function on event "click"
// - one switch image is .hide, the other is .show
// when the user clicks on a switch image,
//	- we change which switch image is shown
//	- we record the.sw_bool of the newly displayed switch
// - if the switch is part of a DIV.sw
// -- then we toggle the display of any dependent pieces
// - if the switch is part of a DIV.register
// -- then we set its register_int property
//
function sw_toggle(event) {
		var f = arguments.callee.name;
		var target = event.target;
		if ( ! checkTagKlas(f, target, false, klas.sw_) ) return;
		var state = hasKlas(target, klas.on);
		if ( !state && ! checkTagKlas(f, target, false, klas.off) ) return;
		var sw = target.parentNode;
		if (! checkTagKlas(f, sw, "SPAN", klas.sw) ) return;
		sw.sw_bool = state = ! state;
		toggle_sw_state(sw, state);
		var sw_tree = ancestorTagKlas(sw, false, klas.sw_tree);
		if (sw_tree) toggle_sw_state(sw_tree, state);
		var register = ancestorTagKlas(sw, "DIV", klas.register);
		if (register) {
				register.register_int = register_int(register, 0);
				withKlasses(register, klas.register_int).forEach( function (node) {
						setTextChild(node, this.register_int.toString());
				},	register	);
		}
}

// setup_actions called when document loaded into window.
// It sets event listeners for our dynamic animations
function setup_actions() {
	withKlasses(document.documentElement, klas.sw_).forEach(
		function (node) { node.addEventListener("click", sw_toggle, false);	}
	);
	var switches = withKlasses(document.documentElement, klas.sw);
	switches.forEach(
		function (sw) { sw.sw_bool = hasKlasses(sw, klas.on, klas.show); }
	);
	var registers = withKlasses(document.documentElement, klas.register);
	registers.forEach(
		function (register) {
			register.register_width = withKlasses(register, klas.sw).length;
			withKlasses(register, klas.register_width).forEach( function (node) {
				setTextChild(node, this.register_width.toString());
			},	register	);
			register.register_int = register_int(register, 0);
			withKlasses(register, klas.register_int).forEach( function (node) {
				setTextChild(node, this.register_int.toString());
			},	register	);
	} );
}

// have setup_actions() called on load of document
window.addEventListener("load", setup_actions, false);
