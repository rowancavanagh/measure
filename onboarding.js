// Rowan Cavanagh
// Measure
// Onboarding page scripting

//chrome.runtime.sendMessage({"whatToDo": "off"}); // Seems to be stopping it completely

var openButton = document.querySelector(".open");
var closeButton = document.querySelector(".close");
var dialogOne = document.querySelector(".dialog-one");
var dialogTwo = document.querySelector(".dialog-two");

// Open onboarding
openButton.addEventListener('click', openOnboarding, false);

function openOnboarding(e) {
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

    e.preventDefault();
};

// Close
closeButton.addEventListener('click', closeTab, false);

function closeTab(e) {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
    e.preventDefault();
};

// Test Measure
function testMeasure() {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
        var whatToDo = message.whatToDo;
        var section = document.querySelector("#instruction");
        if (whatToDo == "on") {
            dialogTwo.innerHTML = '<p>Now highlight some text</p>';
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
        }

        // Measured
        else if (whatToDo == "measured") {
            dialogTwo.innerHTML = '<p>Yay. Now, go forth and Measure!</p><a href class="close-harder">Fine</a>';
            dialogTwo.classList.remove("arrow-left");
            dialogTwo.style.pointerEvents = "initial";
            var closeButtonCloseHarder = document.querySelector(".close-harder");
            closeButtonCloseHarder.addEventListener('click', closeTab, false);
        };
    });
};