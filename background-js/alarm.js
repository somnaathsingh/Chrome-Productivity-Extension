console.log("ONNN");

window.stime = -2;


window.formDisplay = true;
window.timerDisplay = false;
window.pauseDisplay = true;
window.onlyResetDisplay = false;
window.blockBrowserTime = -1;
window.unlockBrowserTime = -1

window.formDisplay_browser = true;
window.timerDisplay_browser = false;

let audioelt = document.querySelector('audio');
let label = "";

let myInterval = "";
let myInterval2="";



let pageUrl=document.URL.toString();
let popupUrl=pageUrl.replace("/background.html","");


let blockBrowser=false;

function blockBrowserCount() {

  blockBrowserTime--;
  formDisplay_browser = false;
  timerDisplay_browser = true;
  let msg =
  {
    txt: "blockBrowserTimer_count",
    value: blockBrowserTime,
  }
  chrome.extension.sendMessage(msg);
  if (blockBrowserTime == 0) {
    audioelt.play();
    chrome.notifications.create(
      "Block Browser",
      {
        type: "basic",
        iconUrl: "images/logo1.png",
        title: "Notification",
        message: "Chrome Browser has been Blocked",
      },
      function () { }
    );
    blockBrowser=true;
  }

  if (blockBrowserTime == -1) {
    clearInterval(myInterval2);
    myInterval2 = setInterval(unlockBrowserCount, 1000);
  }
}

function unlockBrowserCount() {
  unlockBrowserTime--;
  formDisplay_browser = false;
  timerDisplay_browser = true;
  let msg =
  {
    txt: "unlockBrowserTimer_count",
    value: unlockBrowserTime,
  }
  chrome.extension.sendMessage(msg);
  if (unlockBrowserTime == 0) {
    blockBrowser=false;
    audioelt.play();
    chrome.notifications.create(
      "Block Browser",
      {
        type: "basic",
        iconUrl: "images/logo1.png",
        title: "Notification",
        message: "Chrome Browser has been Unblocked",
      },
      function () { }
    );
  }

  if (unlockBrowserTime == -1) {
    clearInterval(myInterval2);
  }

}



chrome.runtime.onMessage.addListener(reciever1);

function reciever1(request, sender, response) {

  console.log("request Object :")
  console.log(request);

  if (request.txt == "timer") {
    label = request.label;
    if (label == "") {
      label = "Time's Up";
    }
    window.stime = request.value;
    console.log(`stime = ${stime}`);
    myInterval = setInterval(updatecountdown1, 1000);


    function updatecountdown1() {
      console.log(window.stime);
      stime--;
      formDisplay = false;
      timerDisplay = true;
      let msg =
      {
        txt: "timer_count",
        value: stime,
      }
      chrome.extension.sendMessage(msg);
      if (stime == 0) {
        audioelt.play();
        chrome.notifications.create(
          "TIMER",
          {
            type: "basic",
            iconUrl: "images/logo.png",
            title: "Notification",
            message: label,
          },
          function () { }
        );

        label = "";
      }

      if (stime == -1) {
        clearInterval(myInterval);
        stime = -2;
        onlyResetDisplay = true;
      }
    }
  }

  else if (request.txt == "timer_pause") {
    formDisplay = false;
    timerDisplay = true;
    pauseDisplay = false;
    clearInterval(myInterval);

  }

  else if (request.txt == "timer_resume") {
    formDisplay = false;
    timerDisplay = true;
    pauseDisplay = true;
    myInterval = setInterval(updatecountdown2, 1000);

    function updatecountdown2() {

      stime--;

      let msg =
      {
        txt: "timer_count",
        value: stime,
      }
      chrome.extension.sendMessage(msg);
      if (stime == 0) {
        audioelt.play();
        chrome.notifications.create(
          "TIMER",
          {
            type: "basic",
            iconUrl: "images/logo.png",
            title: "Notification",
            message: label,
          },
          function () { }
        );

        label = "";
      }

      if (stime == -1) {
        clearInterval(myInterval);
        stime = -2;
        onlyResetDisplay = true;
      }
    }
  }

  else if (request.txt == "timer_reset") {
    try {
      clearInterval(myInterval);
      stime = -2;
    }
    catch (err) {
      console.log(`err_reset:${err}`);
    }
    formDisplay = true;
    timerDisplay = false;
    onlyResetDisplay = false;

  }

  else if (request.txt == "blockBrowsertimer") {
    
    blockBrowserTime = request.blockValue;
    unlockBrowserTime = request.unlockValue;
    formDisplay_browser=false;
    timerDisplay_browser=true;
    myInterval2 = setInterval(blockBrowserCount, 1000);

  }
  else if (request.txt == "browserTimer_reset") {
    blockBrowser=false;
    try {
      clearInterval(myInterval2);
      blockBrowserTime = -1;
    }
    catch (err) {
      console.log(`err_reset:${err}`);
    }
    formDisplay_browser = true;
    timerDisplay_browser = false;

  }
  else if (request.txt == "refresh") {
    chrome.storage.local.get('blockedurls', function (result) {
      let blockedLinks = [];
      if (result['blockedurls'] != null) {
        blockedLinks = JSON.parse(result['blockedurls']);
      }
      filter = blockedLinks;
    });
  }
}



