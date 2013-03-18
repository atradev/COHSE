// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


function click(e) {
  //chrome.tabs.executeScript(null,
    //  {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {displayResults: "OK"}, function(response) {
		console.log(response.farewell);
	  });
	});
  chrome.browserAction.setBadgeText({text:""});
  window.close();
}

document.addEventListener('DOMContentLoaded', function () {
  var divs = document.querySelectorAll('div');
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener('click', click);
  }
});