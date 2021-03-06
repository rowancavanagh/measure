// Rowan Cavanagh
// Measure
// Held together with string and paperclips.

var prepare = true;
var oneAndOnly = false;
var competingTooltip = document.querySelector(".fb-quote, .highlightMenu, #highlight_create_popover"); // Tooltips from Facebook, The Guardian, Instapaper

// Measuring
function measure() {
  var str = window.getSelection();
  var selection = str.toString();
  if (selection != "") {
    console.log('Measure!');
    oneAndOnly = true;
    measureCounterCount.innerHTML = selection.length;
    if (selection.length == 1) {
      measureCounterTitle.innerHTML = chrome.i18n.getMessage("character");
    }
    else {
      measureCounterTitle.innerHTML = chrome.i18n.getMessage("characters");
    };
    measureCounter.setAttribute('class', 'measure-counter-extension__on');
    
    var range = str.getRangeAt(0);
    var rangeContainer = range.commonAncestorContainer;
    var rangeContainerChildren = rangeContainer.childNodes;
    var rangeContainerChildrenLength = rangeContainerChildren.length;
    var rangeContainerNames = [];
    for (var i = 0; i < rangeContainerChildrenLength; i++) {
      var rangeContainerChildrenName = rangeContainerChildren[i].nodeName;
      rangeContainerNames.push(rangeContainerChildrenName);
    }
    if (rangeContainerNames.includes("INPUT") || rangeContainerNames.includes("TEXTAREA")) {
      var bounding = rangeContainer.getBoundingClientRect();
    }
    else {
      var bounding = range.getBoundingClientRect();
    };
    
    var left = bounding.left, right = bounding.right, top = bounding.top, bottom = bounding.bottom;
    top = top + window.scrollY;
    bottom = bottom + window.scrollY;
    measureCounter.style.left = (left+((right-left)/2)-49) + 'px';
    if (bounding.top < 65 || competingTooltip) {
      measureCounter.style.top = (bottom+10) + 'px';
      measureCounter.classList.add('measure-counter-extension__underneath');
    }
    else {
      measureCounter.style.top = (top-65) + 'px';
      measureCounter.classList.remove('measure-counter-extension__underneath');
    };
    
    chrome.runtime.sendMessage({"whatToDo": "measured"});

    range.detach();
  }
  else {
    measureCounter.classList.remove('measure-counter-extension__on');
  };
};


// Prepare that element and listen
if (prepare == true) {
  var yn = document.getElementById('measure-counter-extension');
  var measureCounter = document.createElement('div');
  if (yn == null) {
    measureCounter.setAttribute('id', 'measure-counter-extension');
    measureCounter.innerHTML = '<span id="measure-counter-extension__count">0</span><span id="measure-counter-extension__title"></span>';
    document.body.appendChild(measureCounter);
    var measureCounterCount = document.getElementById('measure-counter-extension__count');
    var measureCounterTitle = document.getElementById('measure-counter-extension__title');
    measureCounterTitle.innerHTML = chrome.i18n.getMessage("characters");
  };
  
  document.addEventListener('mouseup', measure, false);
  document.addEventListener('keyup', measure, false);
  window.addEventListener('resize', measure, false);

  // BackgroundJS is talking to you
  chrome.runtime.onMessage.addListener(function(message){
    var whatToDo = message.whatToDo;

    if (whatToDo == "off" && oneAndOnly) {
      console.log("Measure is off");
      document.removeEventListener('mouseup', measure, false);
      document.removeEventListener('keyup', measure, false);
      window.removeEventListener('resize', measure, false);
      var yn = document.getElementById('measure-counter-extension');
      if (yn !== null) {
        measureCounter.parentNode.removeChild(measureCounter);
      };
      oneAndOnly = false;
    }
    else if (whatToDo == "measure") {
      measure();
    };
  });

  prepare = false;
};