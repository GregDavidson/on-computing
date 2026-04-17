// javascript code to animate the tech-note "What Computers Are"
// jgd April 2009 with Charles Sickles

// A span of class="abit" contains two switch images,
//	- one showing an off switch
//	- and one showing an on switch.
// Only one of the switch images will be displayed at a given time.
// toggle_abit is called when the user clicks on a switch image,
//	- it changes which switch image is shown, and
//	- it records the name of the newly displayed switch
//	- as the value of the span's "switch_state" property
// 
function toggle_abit(event) {
    var child = event.target;
    var parent = child.parentNode;
    var index;
    if (parent.className != "abit")
	alert("toggle_abit called on unknown element");
    else
	for (index in parent.childNodes) {
	    var obj = parent.childNodes[index];
	    if (obj.tagName == "IMG" && obj.style.display) {
		if (obj.style.display == "none") {
		    obj.style.display="inline";
		    parent.switch_state = obj.name; // "on" or "off"
		} else
		    obj.style.display="none";
	    }
	}
}

// first_text_child returns the first text child of the
// given parent or null if none was found.
// Note: text nodes have a nodeType of 3.
function first_text_child(parent) {
    var index;
    for (index = 0; index < parent.childNodes.length; index++)
	if ( parent.childNodes[index].nodeType == 3 )
	    return parent.childNodes[index];
    return null;
}

// change_text_child finds the first text child of the
// given parent and changes it to display the new_text_value.
function change_text_child(parent, new_text_value) {
    var index;
    var text_child = first_text_child(parent);
    if (!text_child)
	alert("change_text_child: parent has no text child!");
    else
    	text_child.nodeValue = new_text_value;
}

// The switch displayed inside the div with id="bit1" is either on or off
// The switch position inside the div with id="bit1" should correspond to
// the text in the interpretations just below the switch.
// reinterpret_bit is called when the switch_state has changed,
// reinterpret_bit should update the interpretations for the new switch_state.
function reinterpret_bit(event) {
    var bit1 = document.getElementById("bit1");
    if (!bit1)
	alert("reinterpret_bit: failed to find element with id bit1");
    else {
    // bit1 is the DIV surrounding the bit
    // now find its child which is a SPAN with class="abit"
	var index;
	var abit_child;
	for (index in bit1.childNodes)
	    if (bit1.childNodes[index].className=="abit")
		abit_child = bit1.childNodes[index];
	if (!abit_child)
	    alert("reinterpret_bit: failed to find child with class abit");
	else {
	    // put in new interpretation for abit as an unsigned integer: 1 or 0
	    var abit_unsigned = document.getElementById("abit_unsigned");
	    if (!abit_unsigned)
	    	alert("reinterpret_bit: failed to find element with id abit_unsigned");
	    else
	    	if (abit_child.switch_state == "on")
	    	    change_text_child(abit_unsigned, "1");
	    	else
	    	    change_text_child(abit_unsigned, "0");
	    // put in new interpretation for abit as a boolean truth value: true or false
	    var abit_truth = document.getElementById("abit_truth");
	    if (!abit_truth)
	    	alert("reinterpret_bit: failed to find element with id abit_truth");
	    else
	    	if (abit_child.switch_state == "on")
	    	    change_text_child(abit_truth, "true");
	    	else
	    	    change_text_child(abit_truth, "false");
	    // put in new interpretation for abit as a switch position: on or off
	    var abit_switch = document.getElementById("abit_switch");
	    if (!abit_switch)
	    	alert("reinterpret_bit: failed to find element with id abit_switch");
	    else
		change_text_child(abit_switch, abit_child.switch_state);

	}
    }
}

// The four switches displayed inside the div with id="nybble1"
// represent a nybble, i.e. half a byte, or a hex digit.
// reinterpret_nybble is called when a switch_state has changed
// as a result of a click on one of the switches.
// reinterpret_nybble should update the interpretations for the new switch_state.
function reinterpret_nybble(event) {
    // alert("reinterpret_nybble not written yet");
}

// setup_actions is called when we load the document into the window.
// It's job is to set things up initially so that our dynamic animations
// will work.
// It attaches display styles to the image elements we will be
// hiding and revealing.
// It attaches our desired functions to listen for onclick events
// in order to do our toggling and reinterpretations as needed.
function setup_actions() {
    var span_array = document.getElementsByTagName("span");
    var span_index;
    for (span_index=0;span_index<span_array.length;span_index++) {
	var parent=span_array[span_index];
	if (parent.className == "abit") {
	    var child_index;
	    for (child_index in parent.childNodes) {
		var child = parent.childNodes[child_index];
		if (child.tagName == "IMG" && child.className) {
		    if (child.className == "show")
			child.style.display = "inline";
		    else if (child.className == "hide")
			child.style.display = "none";
		}
	    }
	    parent.addEventListener("click",toggle_abit,false);
	}
    }
    document.getElementById("bit1").addEventListener("click", reinterpret_bit, false);
    document.getElementById("nybble1").addEventListener("click", reinterpret_nybble, false);
}

// Arrange for our setup_actions function to be called when we load
// the document into the window.
window.addEventListener("load", setup_actions, false);
