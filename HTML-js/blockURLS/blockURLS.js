let addUrl = document.querySelector(".addUrl");
let form = document.querySelector(".blockUrlsForm");
let blockedUrls = document.querySelector(".blockedUrls");
let errorUrl = document.querySelector(".error_url");
let notifier = document.querySelector(".notifier");

let save = form.save;

refreshList();


function is_url(str) {
    regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(str)) {
        return true;
    }
    else {
        return false;
    }
}


addUrl.addEventListener('click', () => {

    form.style.display = "";
    addUrl.style.display = "none";
});

save.addEventListener('click', () => {
    let link = form.url.value;

    if (!is_url(link)) {
        errorUrl.innerHTML = "enter a valid url";
        setTimeout(() => { errorUrl.innerHTML = "" }, 5000);
        return;
    }
    let hostname = link

    try {
        let newLink = new URL(link);
        hostname = newLink.hostname;
    }
    catch (err) {
        console.log(err);
    }

    chrome.storage.local.get('blockedurls', function (result) {
        console.log(result);
        let blockedLinks = [];
        if (result['blockedurls'] != null) {
            blockedLinks = JSON.parse(result['blockedurls']);
        }
        let urlOject = { hostname: hostname, blocked: true };
        blockedLinks.push(urlOject);
        let newblockedlinks = {};
        newblockedlinks['blockedurls'] = JSON.stringify(blockedLinks);
        console.log(newblockedlinks);
        chrome.storage.local.set(newblockedlinks, () => {
            form.style.display = "none";
            form.url.value = "";
            notifier.innerHTML = "url has been added";
            setTimeout(() => { notifier.innerHTML = "" }, 3000);
            chrome.runtime.sendMessage({ txt: "refresh" });

            refreshList();
        })
    });


})

function refreshList() {
    blockedUrls.innerHTML = "";
    let newHTML = "";
    chrome.storage.local.get('blockedurls', function (result) {
        console.log(result);
        let blockedLinks = [];
        if (result['blockedurls'] != null) {
            blockedLinks = JSON.parse(result['blockedurls']);
        }
        for (let index = 0; index < blockedLinks.length; index++) {
            const element = blockedLinks[index];
            let icon = "";
            let isblocked = ""
            if (element["blocked"]) {
                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-node-minus" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M11 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6.025 7.5a5 5 0 1 1 0 1H4A1.5 1.5 0 0 1 2.5 10h-1A1.5 1.5 0 0 1 0 8.5v-1A1.5 1.5 0 0 1 1.5 6h1A1.5 1.5 0 0 1 4 7.5h2.025zM1.5 7a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM8 8a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 8 8z"/>
              </svg>`;
                isblocked = "blocked";
            }
            else {
                icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-node-plus-fill" viewBox="0 0 16 16">
                <path d="M11 13a5 5 0 1 0-4.975-5.5H4A1.5 1.5 0 0 0 2.5 6h-1A1.5 1.5 0 0 0 0 7.5v1A1.5 1.5 0 0 0 1.5 10h1A1.5 1.5 0 0 0 4 8.5h2.025A5 5 0 0 0 11 13zm.5-7.5v2h2a.5.5 0 0 1 0 1h-2v2a.5.5 0 0 1-1 0v-2h-2a.5.5 0 0 1 0-1h2v-2a.5.5 0 0 1 1 0z"/>
              </svg>`;
                isblocked = "unblocked";
            }
            let x = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
          </svg>`;


            newHTML += `<li data-linkIndex=${index}><span class="link">${element["hostname"]}</span>
                <div><span class="link_prop">${icon}</span><span class="delete">${x}</span></div>
            </li>`;
        }
        blockedUrls.innerHTML = newHTML;
        let linkList = document.querySelectorAll('ul li');
        for (let index = 0; index < linkList.length; index++) {


            linkList[index].querySelector('.link_prop').addEventListener('click', function () {
                console.log(this.parentNode);
                let callIndex = this.parentNode.parentNode.dataset.linkindex;
                toggle(callIndex);
            });
            linkList[index].querySelector('.delete').addEventListener('click', function () {
                let callIndex = this.parentNode.parentNode.dataset.linkindex;
                linkDelete(callIndex);
            });
        }
    });

}

function toggle(index) {
    console.log(index);
    chrome.storage.local.get('blockedurls', function (result) {
        let blockedLinks = [];
        if (result['blockedurls'] != null) {
            blockedLinks = JSON.parse(result['blockedurls']);
        }
        let element = blockedLinks[index];
        console.log(element);
        if (element["blocked"]) {
            element["blocked"] = false;
        }
        else {
            element["blocked"] = true;
        }
        let newblockedlinks = {};
        newblockedlinks['blockedurls'] = JSON.stringify(blockedLinks);
        chrome.storage.local.set(newblockedlinks, () => {
            chrome.runtime.sendMessage({ txt: "refresh" });
            refreshList();
        })
    });
}

function linkDelete(index) {

    chrome.storage.local.get('blockedurls', function (result) {
        let blockedLinks = [];
        if (result['blockedurls'] != null) {
            blockedLinks = JSON.parse(result['blockedurls']);
        }
        blockedLinks.splice(index, 1);
        let newblockedlinks = {};
        newblockedlinks['blockedurls'] = JSON.stringify(blockedLinks);
        chrome.storage.local.set(newblockedlinks, () => {
            chrome.runtime.sendMessage({ txt: "refresh" });
            refreshList();
        })
    });
}
