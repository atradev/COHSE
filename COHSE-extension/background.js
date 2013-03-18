chrome.browserAction.onClicked.addListener(function(tab) {
  var test = "test";
  console.log(test);
  chrome.tabs.executeScript(null,
                           {file:"toExecute.js"});
});
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
	//tagWithPeregrine(request.text); //Look at long comment bellow...
    if (request.termCount)
	  {	//chrome.browserAction.setBadgeText(text:"5");
		sendResponse(request.termCount);
		chrome.browserAction.setBadgeText({text:String(request.termCount)});
	  }
	 if (request.method == "getPrefVocab")
      sendResponse({status: localStorage['pref_vocab']});
	 else if (request.method == "getPrefSearchEngines")
      sendResponse({status: localStorage['searchEngines']}); 
    else
      sendResponse({}); // snub them.  
  });

  
  //Dunno what I was doing here.. :)
  /*
  function tagWithPeregrine(text){
	var peregrineData;
	
	var callJSON = "http://peregrine.nbiceng.net/index/indexText?text=" + encodeURIComponent(text) + "&format=json&lang=en&disambiguate=peregrine";
	document.getElementById("peregrineResponse").innerText = callJSON;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = handleStateChange;
	try{
	xhr.open("GET", callJSON , true);
	xhr.send();
	} catch(e){alert(e);}
	
	
  }
  
  
	function handleStateChange() {
		if (this.readyState == 4) {
			document.getElementById("peregrineResponse").innerText =  this.responseText;
			updateUi(resp);
		}
	}

	function updateUi(json) {
		//chrome.browserAction.setTitle("fetched");
		console.log("JSON: ", json);
		alert(json);
	}
	*/