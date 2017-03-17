// Rowan Cavanagh
// Measure
// Onboarding page scripting

var openButton = document.querySelector(".open");
var closeButton = document.querySelector(".close");
var dialogOne = document.querySelector(".dialog-one");
var dialogTwo = document.querySelector(".dialog-two");
var testMeasureDone = false;

// Open onboarding
openButton.addEventListener('click', openOnboarding, false);

function openOnboarding(hiya) {
    var backgroundConnect = chrome.runtime.connect();
    backgroundConnect.postMessage({onboarding: "yup"});

    // Dialog one close
    dialogOne.classList.add("dialog-one-hide");
    dialogOne.addEventListener("animationend", function(){
        dialogOne.classList.remove("dialog-one-hide");
        dialogOne.removeAttribute("open");

        // Dialog two open
        dialogTwo.setAttribute("open", "");
        testMeasure();

        dialogOne.removeEventListener("animationend", arguments.callee, false);
    }, false);

    hiya.preventDefault();
};

// Close
closeButton.addEventListener('click', closeTab, false);

function closeTab(boop) {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
    boop.preventDefault();
};

// Test Measure
function testMeasure() {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        var whatToDo = message.whatToDo;
        var section = document.querySelector("#instruction");
        if (whatToDo == "on" && !testMeasureDone) {
            dialogTwo.innerHTML = '<p>Now highlight a line of text</p>';
            dialogTwo.classList.remove("arrow-top");
            dialogTwo.classList.add("arrow-left");
            dialogTwo.classList.add("bounce");
            section.classList.add("fade");
            section.addEventListener("animationend", function(){
                section.style.backgroundColor = "transparent";
                section.classList.remove("fade");
                section.style.pointerEvents = "none";
                section.removeEventListener("animationend", arguments.callee, false);
            }, false);
            testMeasureDone = !testMeasureDone;
        }

        // Measured
        else if (whatToDo == "measured") {
            dialogTwo.innerHTML = '<p>All done. How easy was that?</p><a href class="close-harder close">Go forth and Measure</a>';
            dialogTwo.classList.remove("arrow-left");
            dialogTwo.style.pointerEvents = "initial";
            var closeButtonCloseHarder = document.querySelector(".close-harder");
            closeButtonCloseHarder.addEventListener('click', closeTab, false);
        };
    });
};