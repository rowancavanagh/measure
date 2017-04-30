// Rowan Cavanagh
// Measure
// Held together with string and paperclips.

var toggle = false;
var onboarding = false;
var tabId = "";
var locale = chrome.i18n.getMessage("locale");

var icon16 = "icons/" + locale + "/icon16.png";
var icon32 = "icons/" + locale + "/icon32.png";
var icon16c = "icons/" + locale + "/icon16c.png";
var icon32c = "icons/" + locale + "/icon32c.png";
chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});

chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": icon16c, "32": icon32c}});

    if(onboarding){
      var windows = chrome.extension.getViews({type: "tab"});
      for (var howManyWindows of windows) {
        var script = howManyWindows.document.createElement('script');
        script.setAttribute("src", "measure.js");
        script.setAttribute("async", "");
        howManyWindows.document.body.appendChild(script);
        var link = howManyWindows.document.createElement('link');
        link.setAttribute("href", "styles.css");
        link.setAttribute("rel", "stylesheet");
        howManyWindows.document.body.appendChild(link);
        if (locale == "zh") {
          var linkChinese = howManyWindows.document.createElement('link');
          linkChinese.setAttribute("href", "styles-zh.css");
          linkChinese.setAttribute("rel", "stylesheet");
          howManyWindows.document.body.appendChild(linkChinese);
        };
      };
      onboarding = !onboarding;
    }
    else {
      chrome.tabs.executeScript({file: "measure.js"});
      chrome.tabs.insertCSS({file: "styles.css"});
      if (locale == "zh") {
        chrome.tabs.insertCSS({file: "styles-zh.css"});
      };
    };

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "on"});
      console.log("Measure is on tab number: " + tabId);
    });
  }
  else {
    chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "off"});
    });
    tabId = "";
  }
});

// On zoom
chrome.tabs.onZoomChange.addListener(function(){
  if(toggle){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "measure"});
    });
  };
});

// On close
chrome.tabs.onRemoved.addListener(function(){
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});
    tabId = "";
    toggle = false;
  };
});

// On switch
chrome.tabs.onActivated.addListener(function(info){
  if(toggle){
    var tabIdInt = Number(tabId);
    chrome.tabs.query({active: true, currentWindow: true}, function() {
      chrome.tabs.sendMessage(tabIdInt, {"whatToDo": "off"});
    });
    chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});
    tabId = "";
    toggle = false;
  };
});

// On refresh
chrome.tabs.onUpdated.addListener(function(){
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});
    tabId = "";
    toggle = false;
  };
});

// On window change
chrome.windows.onFocusChanged.addListener(function(){
  if(toggle){
    chrome.browserAction.setIcon({path:{"16": icon16, "32": icon32}});
    tabId = "";
    toggle = false;
  };
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.tabs.create({url: "/onboarding.html"});
  };
});

// Talking to onboarding
function onboardingConnected(port) {
  port.onMessage.addListener(function(message) {
    if(message.onboarding == "yup"){
      onboarding = true;
    };
  });
}

chrome.runtime.onConnect.addListener(onboardingConnected);

// Onboarding round-the-houses
chrome.runtime.onMessage.addListener(function(message){
    var whatToDo = message.whatToDo;
    if (whatToDo == "measured") {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"whatToDo": "measured"});
      });
    };
});