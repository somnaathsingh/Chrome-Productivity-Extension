let showTableBtn = document.querySelector('.btnShowTable');
let clearTimesBtn = document.querySelector('.btnClearTimes');

let errorMessageElement = document.querySelector('.errorMessage');
let timeTable = document.querySelector('.timeTable')

clearTimesBtn.addEventListener('click', () => {
  chrome.storage.local.set({ "tabTimesObject": "{}" }, function () {
    timeTable.innerHTML = "";

  });
});



showTableBtn.addEventListener('click', () => {
  chrome.storage.local.get("tabTimesObject", function (dataCont) {
    console.log(dataCont);
    let dataString = dataCont["tabTimesObject"];
    if (dataString == null) {
      return;
    }

    try {
      let data = JSON.parse(dataString);

      let rowCount = timeTable.rows.length;
      for (var x = rowCount - 1; x >= 0; x--) {
        timeTable.deleteRow(x);
      }

      let entries = [];
      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          entries.push(data[key]);
        }
      }

      entries.sort(function (e1, e2) {
        let e1S = e1["trackedSeconds"];
        let e2S = e2["trackedSeconds"];

        if (isNaN(e1S) || isNaN(e2S)) {
          return 0;
        }
        if (e1S > e2S) {
          return 1;
        }
        else if (e2S > e1S) {
          return -1;
        }
        return 0;
      });

      entries.map(function (urlOject) {
        let newRow = timeTable.insertRow(0);
        let celHostname = newRow.insertCell(0);
        let celTime = newRow.insertCell(1);
        let celLastDate = newRow.insertCell(2);
        let celStartDate = newRow.insertCell(3);
        celHostname.innerHTML = urlOject["url"];
        let time = urlOject["trackedSeconds"] != null ? urlOject["trackedSeconds"] : 0;
        let hour = Math.floor(time / (3600));
        let min = Math.floor((time % (3600)) / 60);
        let sec = Math.floor((time % (3600)) % 60);
        hour = hour < 10 ? '0' + hour : hour;
        min = min < 10 ? '0' + min : min;
        sec = sec < 10 ? '0' + sec : sec;
        let spentTime = `${hour}:${min}:${sec}`;
        celTime.innerHTML = spentTime;

        let date = new Date();

        if (urlOject.hasOwnProperty("lastDateVal")) {
          date.setTime(urlOject["lastDateVal"] != null ? urlOject["lastDateVal"] : 0);
          celLastDate.innerHTML = date.toString();

        }
        else {
          celLastDate.innerHTML = "date not found";
        }

        if (urlOject.hasOwnProperty("startDateVal")) {
          date.setTime(urlOject["startDateVal"] != null ? urlOject["startDateVal"] : 0);
          celStartDate.innerHTML = date.toString();

        }
        else {
          celStartDate.innerHTML = "date not found";
        }

      });

      let headerRow = timeTable.insertRow(0);
      headerRow.insertCell(0).innerHTML = "Url";
      headerRow.insertCell(1).innerHTML = "Tracked Time";
      headerRow.insertCell(2).innerHTML = "Last Date";
      headerRow.insertCell(3).innerHTML = "First Date";



    }
    catch (err) {
      const message = "loading the tabTimesOject went wrong :" + err.toString();
      console.log(message);
      errorMessageElement.innerText = message;
      errorMessageElement.innerText = dataString;
    }

  });
})