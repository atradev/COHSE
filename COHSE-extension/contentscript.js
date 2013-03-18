var parseXml;
var taggedData;
if (typeof window.DOMParser != "undefined") {
    parseXml = function(xmlStr) {
        return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
    };
} else if (typeof window.ActiveXObject != "undefined" &&
       new window.ActiveXObject("Microsoft.XMLDOM")) {
    parseXml = function(xmlStr) {
        var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = "false";
        xmlDoc.loadXML(xmlStr);
        return xmlDoc;
    };
} else {
    throw new Error("No XML parser found");
}
var HTMLtext = getBodyText(window);

//Get pref search engines
var searchEngines;
chrome.extension.sendMessage({method: "getPrefSearchEngines"}, function(response) {
  searchEngines = response.status.split(",");
  console.log(searchEngines);
});


//var URL = "http://peregrine.nbiceng.net/index/indexText?text=" + encodeURIComponent(HTMLtext) + "&format=json&lang=en&disambiguate=peregrine&vocab=" + prefVocab;
var URL = "http://localhost:8080/uk.co.nasko.jersey.jaxb/rest/tag?text=" + encodeURIComponent(HTMLtext) + "&vocab=" + prefVocab;
var URL2 = "http://localhost:8080/uk.co.nasko.jersey.jaxb/rest/tag";
console.log(URL);
function getBodyText(win) {
    var doc = win.document, body = doc.body, selection, range, bodyText;
    if (body.createTextRange) {
        return body.createTextRange().text;
    } else if (win.getSelection) {
        selection = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(body);
        selection.addRange(range);
        bodyText = selection.toString();
        selection.removeAllRanges();
		//console.log(bodyText.replace(/(\r\n|\n|\r)/gm," ").replace(/<a(.*)<\/a>/g, ""));
        return bodyText.replace(/(\r\n|\n|\r)/gm," ");
    }
}

//Get pref vocab and make request
var prefVocab = "";
chrome.extension.sendMessage({method: "getPrefVocab"}, function(response) {
  prefVocab = response.status;
  console.log(prefVocab);
  makeRequest(prefVocab, function(data) {
	//console.log(data);
	taggedData = JSON.parse(data);
      // Render the results.
      //renderQuestions(JSON.parse(data));
	  var l = taggedData.result.taggedTerms.length;
		console.log(l);
		//Update Icon:
		chrome.extension.sendMessage({termCount: l}, function(response) {
			console.log(response);
		});
	  
    });
});
/*makeRequest(function(data) {
	console.log(data);
	taggedData = JSON.parse(data);
      // Render the results.
      //renderQuestions(JSON.parse(data));
	  var l = taggedData.result.taggedTerms.length;
		console.log(l);
		//Update Icon:
		chrome.extension.sendMessage({termCount: l}, function(response) {
			console.log(response);
		});
	  
    });*/

	
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.displayResults == "OK")
      sendResponse({farewell: "Displaying Results..."});
	  renderQuestions(taggedData);
  });	
//redo with jquery
function makeRequest(prefVocab, callback) {/*
  var xhr = new XMLHttpRequest();
  xhr.open('GET', URL);
  xhr.setRequestHeader("Accept","application/json");
  console.log(URL);
  xhr.addEventListener('load', function(e) {
    var result = xhr.responseText;
    callback(result);
  });
  xhr.send();*/
  
  var xhr = new XMLHttpRequest();
  xhr.open('POST', URL2);
  xhr.timeout = 10000;
  xhr.setRequestHeader("Accept","application/json");
  console.log(URL2 + "?text=" + encodeURIComponent(HTMLtext) + "&vocab=" + prefVocab);
  xhr.addEventListener('load', function(e) {
    var result = xhr.responseText;
    callback(result);
  });
  xhr.send("text=" + encodeURIComponent(HTMLtext) + "&vocab=" + prefVocab);
  
}

function renderQuestions(data) {
	var l = data.result.taggedTerms.length;
	var popupDiv = $('<div></div>').attr('id', 'cohse_popup');
	$('body').prepend(popupDiv);
	
	for(var i = 0; i < l; i++) {
		
			//console.log(data.concept[i].semantictypes.semantictype[0].value);
			var search = "http://www.google.com/search?q=" + data.result.taggedTerms[i].prefLabel.replace(" ", "+");
			/*
			  <ul class="tabs">
				<li><a href="#">Tab 1</a></li>
				<li><a href="#">Tab 2</a></li>
				<li><a href="#">Tab 3</a></li>
			</ul>
			
			*/
			
			//var results = data.result.taggedTerms[i].prefLabel.replace(" ","_");
			var results = data.result.taggedTerms[i].termContext.replace(/ /g,"_");
			var definition = data.result.taggedTerms[i].definition.replace(/\"/g,"'");
			var alt = data.result.taggedTerms[i].matchedText + ";;";
			if(data.result.taggedTerms[i].hierarchy != "") alt += data.result.taggedTerms[i].hierarchy;
			//var tabs = "<span class=\"panes\"><span>First tab content. Tab contents of <a href=\"#second\">second</a></span> <span>Second tab content</span> </span>";
			//findAndReplace(data.concept[i].word[j].value, "<a href=\"" + search + "\" title='" + results +  "'>" + data.concept[i].word[j].value + "</a>" );
			//findAndReplace(data.result.taggedTerms[i].matchedText, "foundya" );
			var regx = new RegExp( "[\\.\\s\\!\\;\\?]" + data.result.taggedTerms[i].matchedText + "[\\.\\s\\!\\;\\?]" ,"g");
			if(data.result.taggedTerms[i].matchedText != "are" && data.result.taggedTerms[i].matchedText != "is" && data.result.taggedTerms[i].matchedText != "was" && data.result.taggedTerms[i].matchedText != "been" && data.result.taggedTerms[i].matchedText != "were" && data.result.taggedTerms[i].matchedText != "as" && data.result.taggedTerms[i].matchedText != "be")
			  findAndReplace(regx, " <span class=\"cohse_button b" + results + "\" title=\"" + definition.replace(/"/g,"") + "\" alt=\"" + alt.replace(/"/g,"") + "\">" + data.result.taggedTerms[i].matchedText + "</span> " );
			 
	}
	
	/*
		Add a popup div as placeholder for search popup html. 
		On clicking a term, call the popup and change its html accordingly.
	
	*/
	
	//First get the close button and then the frame sorted

	$(".cohse_button").each(function() {
		$(this).bind("click",function() {
			var maskHeight = $(document).height();  
			var maskWidth = $(window).width();
			$('#cohse_popup_overlay').css({height:maskHeight, width:maskWidth}).show();
			
			var term = $(this).attr("alt").split(";;")[0];
			var hierarchy = "";
			if($(this).attr("alt").split(";;").length > 1) hierarchy = $(this).attr("alt").split(";;")[1];
			var searchTerm = $(this).attr('class').replace("cohse_button b","");
			var def = $(this).attr("title");
			//var searchBox = "<h2 style=\"text-align:center\">Search Results</h2><ul class=\"searchTabs\">"
			var searchBox = '<img style="display:block; margin:auto 50%; margin-bottom:3px;" width="48" height="48" title="COHSE" alt="Cohse Popup Image" src="data:image/png;base64,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" />'
			searchBox += "<br /><h3 class=\"term\">" + term + "</h3>";
			if(def.length > 0) searchBox += "<p class=\"cohse_definition\"><b>Definition:</b>" + def + "</p>";
			searchBox += "<ul class=\"searchTabs\">"
			for(var i=0; i<searchEngines.length; i++) {
				var sURL = searchEngines[i].split("_")[0];
				var sName = searchEngines[i].split("_")[1];
				searchBox += "<li class=\"sEngineTab\"><a href=\"javascript:void(0);\" class=\"tabLink\" title=\"" + sURL + ";;" + searchTerm + "\">" + sName + "</a></li>"
			}
			if(hierarchy != "") 
			  searchBox += "<li class=\"sEngineTab\"><a href=\"javascript:void(0);\" class=\"tabRelationships\" title=\"" + hierarchy + "\">Hierarchy</a></li>"
			//Add hierarchy link
			//searchBox += "</ul><br /><div id=\"cohse_popup_res\"><a href=\"javascript:void(0);\" class=\"tabLink\" title=\"wikipedia.org;;" + searchTerm + "\">Load Results</a></div>";
			searchBox += "</ul><br /><div id=\"cohse_popup_res\">Select a Search Engine</div>";
			$("#cohse_popup").html(searchBox);
			$("#cohse_popup").dialog({
				
				width:700,
				height:400,
				maxHeight:400,
				modal:true,
				open: function(event, ui) { 
					// Hide close button 
					var img = '<img width="45" height="35" title="" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAoCAYAAABaW2IIAAAJJUlEQVRogdWaWWxc1RnHf/fMnc2z2c7YM7HHsRMHHJzGMSlJQwwkAdoGSIhKhaCteKCLWlUEqlbqQx9Kq0ptKS1QIdFIPFQ8tA+UsgWaRYFAooQsNIkTJ8R27HiL9xlv49nucvpwM46zON4mQP+jT/fOOd893/c/3znnfufMKHJ4mNliUDqDTc0dDzS39tW1X4zWDkbHKsaT6XxdN52zbuwqqKpIe9zO4eACX1t56YKT1VWlHywtL9tZIBLx2balzJSclFI53jm89cP9DU+dbereKCVi1p7PEaoq0itui+zZWLf8lRUlvt2KosiZPDcjcqcujm56/Z3Df77YO7Q8W+YetxMcyMM/5MQz5sCRsc3D/cswFUnGZTDmTxP3Z4gFkyQ92kR9eWTBie88UretKug+OF1bNyQXxR14450D2w8fb3kcQJgKxd15hLu85MXtueAyIyQ8Gj3lcfoXjiMVq2zDnctefXjzuqcL9PHUVM9NSa4rwS1/+/uuHT39I1UAwV43ZS0+HOncRGguSLsM2m8ZZajI4rNkUdGxHz7x9W+HHUbn9fSvS64zIZe9+Lcd+0bGkmE1I1h81k8gOu+1ImeIhVO0VY1iqpIFBd72n/14y4YSl9l2td415LoS3PLi9nf3D48mw+64jcpTfpypLy5aUyHp0TlfM0rGbRIs8Lb//Kdb14XsevdknSvIRaU78NL2t4709I9UueM2Kk/4UDXlc3d8ptCcJs2rxsi4TZYsKjr6kx9tWV84aQ5esZy/+d6B7b39I1XOpGBxfR5CNzEV40srtoxk8ak8VE3hQsfAmr17j/5hMh9BIADA2d74fcdOtDyuAKXnnAjty00sK/akpLTRiaLA3v0NT7eN6jUABAJW5KTfr7z2r0N/BSjsUnGNyi/c6dmIJwq+ARuAeGPHwZezkVMBjtW3b73QObTcLaGwXcFUzJswQ24uiloE40GDhsbee5qiqbW3BgKHVYBd+xqeAvCdVtAumtjD8zMkMcj3xxA2SSLhIJ3Ov0ZHEWkCvlEURTI8GkDOMy1VxkFtUkiUSnbtO7Pt1iWhw+poPBU809i9ESC/WaIlDUyFeRH05sV44nv1E9//+fpyBmPFV+g8svkEkVIrF969dwmN58vnZEtKMKKgD0KgB/pL4dP6toc1zXCKkw0dD0iJcA9IRNLAxECLGWQGrPu5yGgiQGtbPggBQnDPXZ1X1IfD3UTKEiAE40kH51qL52RHGzNInTfI9BuYpoEtbuAclqTSuvdsc8969dz5vjoAT7eJiTHRI5kBMAXYgnPqUD48WMLiJeMoCkTKkpSU9NDZUwxScs9d3aBYicGBwwvRpQ0UY5oWJ0UrDXovmNfZBHm6IJ1v40LH4CrR1hWtBXD26df0TKbPINViXY3k7Hp1KO7n9Gf5oAhQBOvv7sNEp3xRL+FwBhRBdMjJ6abQzNs1DTK9lk96/Po6jiGrk9o6B2vVwehYOYA6omNeb5eUBCMJ2gAoDhBesPmt67TRO1RE9W3jqCqEQjpLl/RRt2YIhO1SdIuxTE6/OhtDoPeB1G+sZ49JwEF7V6xGjSfSBQBoxvQmMmDEQItZo0p4QQRA+KwAXY2U5ubI8QB1XxsDYPOmKHZVAoLOiw5aOgumHY7mOGjdIKfc2Fzto5UuxsfThWr2aEAaBjPa3mZhgDECjADKJaJ+sPmASVu9A58GWFWbxO2S2CeV7/44H8M0kBqgWxGROqBNutfBTM7GKVDS1nU0nixSs4WTF5NZQ4I5BoxdMuC0iIo80HQ70aZuIkUDoKVAT6OlNPqPPEYyOQ+b08BmE5qqqiKt66bTlDk0lALj0jCqrmwlIo5C9HK1Hdiw+gjvfXx37mxeguGx5rPH7RwWXo8rBmDY5Zzfa1MJisY36z6ZMHy4vnrifk3NGQL+oZzb1B3W5PJ6nDERLPR2AGQCAjPHn9UrzlJUOAJAe08xb+6ro73bylRUm8k31h3NuU2twIpceaTwlKiILDgJkClSc9qDdnuK+9f+dyJSuw7djonBfw59daKstqqFcFF/Tu1mQg4AKsqCJ8WK20o/AMiUuDClkTNZf0c9vjxr4p3vCtHYEcaUBs2dxTR1WImrosBDdx3Nqd1MyErAqypDB8Xty8t2qqpIayV56HlKTnrP6xljw6ozExF6/+DKK+rfP1g7UVdV3kNlWVduolZkx/TZ8XtdA1WVoUPC5bLHV1ZH9qBAusqfEyOrlrXisFur7+mWUlq6F1xRf6G3gBNNZRMEV1e35MRueqnPaq+24m0hhKFIKTnZ0Lnp9y/v3KnoJu5/NyNS0+Q400LidlqnxMm0Y0ottzODgiSZdiCZ30GU6XOQ+NZSUBReePbR5ZGSgrMqQO1XynYtXhQ8fqFjcFXmjmIcB7rmZQhgPJXND6ZO6i7ryEsyd6TvCIGisLI6sjtSUnAWJp1+ff/xddsAqVcWoC3yYvwffbSlAYxFflSbyDz52LpnspwmyFVVhg/df/eyVwG0dWWYfntOl+ibJUahE21NKQBbN9U+VxLOb8xyUqS8PBwymu569vkd+1vaB1YTT2N7/zNIZuY1XG4q/C6MB6vBpVJTHdnzq22bHhRCTOSRV5ADGIzFy379/LsHBmPxcuJplL3nYCjxufs9LUI+5L1V4LJTEgo0/u6XW+t8Xld0sso15AD6B8cqfvOXHR8NxuLlaAYcaUU2931uft8QioKybCGsWQxCoSQUaHz2F1s2FgTyeq5RvR45gOGRRPhPr+x+53zbwBoA2T2MPHIeOfzFRVEJ+lDuXIoStN5nNdWRPc/84N7vXh2xCf2pyAFomuH8x1tH/rjzw4ansz8Tm+2DmA0dyP6Rm+H/dTxUECUFiJpylLB1/qnaRGbrptrnHt286reT59g1j96IXBYdF2MrXnv9kxdOn7t4f7ZMJtKYnYPI4XFL4knI6Mi5LkA2geJQravHhRLKRxR4EWVBcEzsqVlZHdn95GPrnpm8Ks6LXBZNrX1rd+07s+3T+vYtqbTmmxuL2cPvdQ2srq14+6H7VryUfUHPBLMil4WmGc6m1r47my/0r23rHKxt74rVxMfThfP9u0b2bxpejzNWHik8VVEWPFl968KPllYUHbvR8JsK/wOBedd5tFNTmQAAAABJRU5ErkJggg==" />'
					$(this).parent().children().children(".ui-dialog-titlebar-close").css("background-color","#fff").css("border","none").css("margin-top","5px").css("margin-right","10px").html(img);
				}
			});
			
			
			
			$('.ui-widget-overlay').on("click", function() {
				//Close the dialog
				$(this).find("#cohse_popup").dialog("close");
			});
			$('a[class=tabRelationships]').click( 
			function (e) {
				e.preventDefault();
				var title = $(this).attr("title").replace("|HIERARCHY|","");
				var t = title.split("|--|");
				var res = "";
				for(var i = 0; i < t.length; i++){
					if(t[i].split("__")[0] == "broader")
						res += "<b>^Broader</b>: " + t[i].split("__")[1].split("+|+")[0] + "<br />";
					if(t[i].split("__")[0] == "related")
						res += "<b>-Related</b>: " + t[i].split("__")[1].split("+|+")[0] + "<br />";
					if(t[i].split("__")[0] == "narrower")
						res += "<b>Narrower</b>: " + t[i].split("__")[1].split("+|+")[0] + "<br />";
					
					if(t[i].split("__")[1].split("+|+").length > 1)
						res += "<i>" + t[i].split("__")[1].split("+|+")[1].replace("TM ","") + "</i><br />";
				}
				$("#cohse_popup_res").html(res);
			});
			$('a[class=tabLink]').click(
			function (e) {
				e.preventDefault();
				var title = $(this).attr("title");
				
			console.log(title);
				var ttl = title.split(";;");
				//var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCVkDf2lSJOMwYETOP9qF_jTBU0k_h4meA&cx=016963398958569568888:poqdfodsdzs&q=site:ncbi.nlm.nih.gov+" + title.replace(" ", "+").replace("_tab1","").replace("_tab2","") + "&callback=?";
				//atradev: AIzaSyCHyAv7VOvFo7TwBan8Qd3Fh_OdJo5nRpU  017520011284633168625:ejm7w0magme
				//var url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCHyAv7VOvFo7TwBan8Qd3Fh_OdJo5nRpU&cx=016963398958569568888:poqdfodsdzs&q=site:ncbi.nlm.nih.gov+" + title.replace(" ", "+").replace("_tab1","").replace("_tab2","")+ "&callback=?";
				var res = "";
				var url = "";
				if(ttl[0] === "google.com") {url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCHyAv7VOvFo7TwBan8Qd3Fh_OdJo5nRpU&cx=016963398958569568888:poqdfodsdzs&q=" + ttl[1].replace(/ /g, "+").replace(/_/g,"+").replace(/_tab2/g,"")+ "";}
				else {url = "https://www.googleapis.com/customsearch/v1?key=AIzaSyCHyAv7VOvFo7TwBan8Qd3Fh_OdJo5nRpU&cx=016963398958569568888:poqdfodsdzs&q=site:"+ ttl[0] + "+" + ttl[1].replace(/ /g, "+").replace(/_/g,"+").replace(/_tab2/g,"")+ "";}
			console.log(url);
				var xhr = new XMLHttpRequest();
				xhr.overrideMimeType("application/json"); 
				xhr.open("GET", url, true);
				xhr.onreadystatechange = function() {
					if (xhr.readyState == 4) {
					   
						var json = JSON.parse(xhr.responseText);
						//alert(json.items[0].htmlSnippet);
						for (var i = 0; i < json.items.length; i++) {
							var item = json.items[i];
							// in production code, item.htmlTitle should have the HTML entities escaped.
							res += "<li class=\"cohse_results_li\"><a target=\"_blank\" class=\"cohse_link\" href=\"" + item.link + "\">" + item.htmlTitle + " " + "</a> <br /><i>" + item.htmlSnippet.replace(/<br>/g,"") + "</i><br /></li>";
							//var t_class = "#" + title;
						}
					
						$("#cohse_popup_res").html(res);
				  }
				}
				xhr.send();
							
				
					//$(this).attr("title", res);
				
					//alert(res);
			}
		);
	
	
	
	
		});
	});
	
	
	/*
		Add search functionality.
	*/
	//note: add persistance
	 
	
	//$(".popup ul").idTabs(); 
	
	//$("[title]").tooltip({offset: [10, 2]}).dynamic({ bottom: { direction: 'down', bounce: true } });
	//$("ul.tabs").tabs("span.panes > span");
}
function renderQuestions2(data) {
  var $results = document.querySelector('#results');
  var questions = data.questions;
  for (var i = 0; i < Math.min(10, questions.length); i++) {
    var question = questions[i];
    var $question = document.createElement('li');
    var url = ROOT + question.question_answers_url;
    $question.innerHTML = '<a href="' + url + '" target="_blank">' +
        question.title + '</a>';
    results.appendChild($question);
  }
  // Update title too.
  document.querySelector('#title').innerText = 'Top Chrome Extension Questions';
}
	
//createDiv();

/*
chrome.extension.sendMessage({text: HTMLtext}, function(response) {
  console.log(response.farewell);
});
*/

function createDiv(){
var divTag = document.createElement("div");
divTag.id = "peregrineResponse";
divTag.setAttribute("display","none");
document.body.appendChild(divTag);
//document.getElementById("peregrineResponse").innerText = "test";
}

function findAndReplace(searchText, replacement, searchNode) {
    if (!searchText || typeof replacement === 'undefined') {
        // Throw error here if you want...
        return;
    }
    var regex = typeof searchText === 'string' ?
                new RegExp(searchText, 'g') : searchText,
        childNodes = (searchNode || document.body).childNodes,
        cnLength = childNodes.length,
        excludes = 'html,head,style,title,link,meta,script,object,iframe,a'; //REMOVE A IF IT BREAKS STUFF.
		//excludes_classes = 'button';
    while (cnLength--) {
        var currentNode = childNodes[cnLength];
        if (currentNode.nodeType === 1 &&
            (excludes + ',').indexOf(currentNode.nodeName.toLowerCase() + ',') === -1 ) {
            arguments.callee(searchText, replacement, currentNode);
        }
        if (currentNode.nodeType !== 3 || !regex.test(currentNode.data) ) {
            continue;
        }
        var parent = currentNode.parentNode,
            frag = (function(){
                var html = currentNode.data.replace(regex, replacement),
                    wrap = document.createElement('div'),
                    frag = document.createDocumentFragment();
                wrap.innerHTML = html;
                while (wrap.firstChild) {
                    frag.appendChild(wrap.firstChild);
                }
                return frag;
            })();
        parent.insertBefore(frag, currentNode);
        parent.removeChild(currentNode);
    }
}
