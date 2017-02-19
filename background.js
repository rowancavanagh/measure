// Rowan Cavanagh
// Measure
// Held together with string and paperclips.

var toggle = false;
var tabId = "";

chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": "icons/icon16c.png", "19": "icons/icon19c.png", "32": "icons/icon32c.png", "38": "icons/icon38c.png"}});
    chrome.tabs.executeScript({file: "measure.js"});
    chrome.tabs.executeScript({file: "lineWrapDetector.js"});
    chrome.tabs.insertCSS({file: "styles.css"});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      tabId = tabs[0].id;
      console.log("Measure is on tab number: " + tabId);
    });
  }
  else{
    chrome.browserAction.setIcon({path:{"16": "icons/icon16.png", "19": "icons/icon19.png", "32": "icons/icon32.png", "38": "icons/icon38.png"}});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "off"});
    });
    tabId = "";
  }
});

chrome.tabs.onRemoved.addListener(function(){
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": "icons/icon16.png", "19": "icons/icon19.png", "32": "icons/icon32.png", "38": "icons/icon38.png"}});
    tabId = "";
    toggle = false;
  };
});
chrome.tabs.onZoomChange.addListener(function(){
  if(toggle){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "measure"});
    });
  };
});
chrome.tabs.onActivated.addListener(function(){
  if(toggle){
    var tabIdInt = Number(tabId);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabIdInt, {"whatToDo": "off"});
    });
    chrome.browserAction.setIcon({path:{"16": "icons/icon16.png", "19": "icons/icon19.png", "32": "icons/icon32.png", "38": "icons/icon38.png"}});
    tabId = "";
    toggle = false;
  };
});