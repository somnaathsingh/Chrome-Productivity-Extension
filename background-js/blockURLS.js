

let filter = [];



chrome.webRequest.onBeforeRequest.addListener(
  function (details) {

    if (details.url.indexOf(popupUrl) != -1) {
      return { cancel: false };
    }
    else {
      for (let index = 0; index < filter.length; index++) {
        const element = filter[index];
        let newhostname=details.url;
        try{
          let newurl=new URL(newhostname);
          newhostname=newurl.hostname;
        }
        catch(err){

        }
        if (element["hostname"] == newhostname && element["blocked"] == true) {
          return { cancel: true };
        }

      }
      return {cancel:blockBrowser}
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);



