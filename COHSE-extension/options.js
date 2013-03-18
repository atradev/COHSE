// Save this script as `options.js`

// Saves options to localStorage.
function save_options() {
	//get preferred vocab
  var select = document.getElementById("vocab");
  var vocab = select.children[select.selectedIndex].value;
  localStorage["pref_vocab"] = vocab;
  
  //get preferred search engines
  var checkedBoxes = getCheckedBoxes("searchCheckBoxes");
  if(checkedBoxes !== null){
	localStorage["searchEngines"] = checkedBoxes;
  } else {
	localStorage["searchEngines"] = null;
  }
  
  // Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var favorite = localStorage["pref_vocab"];
  if (!favorite) {
    return;
  }
  var select = document.getElementById("vocab");
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == favorite) {
      child.selected = "true";
      break;
    }
  }
  
  //And the search engines:
  var arrSearch = document.getElementsByName("searchCheckBoxes");
  var arrSaved = localStorage["searchEngines"].split(",");
  for (var i = 0; i < arrSearch.length; i++) {
	for(var j = 0; j < arrSaved.length; j++) {
      if(arrSearch[i].value == arrSaved[j]) {
		arrSearch[i].checked = true;
	  }
	}
  }
}

function getCheckedBoxes(chkboxName) {
  var checkboxes = document.getElementsByName(chkboxName);
  var checkboxesChecked = [];
  // loop over them all
  for (var i=0; i<checkboxes.length; i++) {
     // And stick the checked ones onto an array...
     if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i].value);
     }
  }
  // Return the array if it is non-empty, or null
  return checkboxesChecked.length > 0 ? checkboxesChecked : null;
}



document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);