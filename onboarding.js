// Rowan Cavanagh
// Measure
// Onboarding page scripting

// Head tag localisation content
var htmlTag = document.querySelector("html");
var locale = chrome.i18n.getMessage("locale");
htmlTag.setAttribute("lang", locale);
document.title = chrome.i18n.getMessage("onboarding_title");
if (locale == "zh") {
    var link = document.createElement('link');
    link.href = "onboarding-zh.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
}
else {
    var link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css?family=Crimson+Text";
    link.rel = "stylesheet";
    document.head.appendChild(link);
};

// Dialog one content localisation
var dialogOne = document.querySelector(".dialog-one");
var dialogOneP = chrome.i18n.getMessage("onboarding_d1_paragraph");
var dialogOneOpen = chrome.i18n.getMessage("onboarding_d1_open");
var dialogOneClose = chrome.i18n.getMessage("onboarding_d1_close");
dialogOne.innerHTML = '<img src="images/measure_logo.svg" alt="Measure logo" /><p>' + dialogOneP + '</p><a href class="open">' + dialogOneOpen + '</a><a href class="close">' + dialogOneClose + '</a>';

// Dialog two content localisation
var dialogTwo = document.querySelector(".dialog-two");
var dialogTwo1 = chrome.i18n.getMessage("onboarding_d2_step1");
dialogTwo.innerHTML = '<p>' + dialogTwo1 + '</p>';

var dialogTwo2 = chrome.i18n.getMessage("onboarding_d2_step2");
var dialogTwo3 = chrome.i18n.getMessage("onboarding_d2_step3");
var dialogTwo3Button = chrome.i18n.getMessage("onboarding_d2_step3_button");

// Article content localisation
var article = document.querySelector("article");
var articleContent = chrome.i18n.getMessage("onboarding_article");
article.innerHTML = articleContent;

// Open onboarding
var testMeasure = false;
var openButton = document.querySelector(".open");
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
        testMeasure = true;

        dialogOne.removeEventListener("animationend", arguments.callee, false);
    }, false);

    hiya.preventDefault();
};

// Close
var closeButton = document.querySelector(".close");
closeButton.addEventListener('click', closeTab, false);

function closeTab(boop) {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id, function() { });
    });
    boop.preventDefault();
};

// Test Measure
var testMeasureDone = false;

chrome.runtime.onMessage.addListener(function(message){
    var whatToDo = message.whatToDo;
    var section = document.querySelector("#instruction");
    if (whatToDo == "on" && !testMeasureDone && testMeasure) {
        dialogTwo.innerHTML = '<p>' + dialogTwo2 + '</p>';
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
        testMeasureDone = true;
    }

    // Measured
    else if (whatToDo == "measured" && testMeasure) {
        dialogTwo.innerHTML = '<p>' + dialogTwo3 + '</p><a href class="close-harder close">' + dialogTwo3Button + '</a>';
        dialogTwo.classList.remove("arrow-left");
        dialogTwo.style.pointerEvents = "initial";
        var closeButtonCloseHarder = document.querySelector(".close-harder");
        closeButtonCloseHarder.addEventListener('click', closeTab, false);
    };
});