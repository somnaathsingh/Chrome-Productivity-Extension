let btnstart = form.button1;


btnstart.addEventListener('click', () => {

    formDisplay = false;
    let h1 = form.hour_1.value;
    let h0 = form.hour_0.value;
    let m1 = form.min_1.value;
    let m0 = form.min_0.value;
    let s1 = form.sec_1.value;
    let s0 = form.sec_0.value;

    blockTime = (parseInt(h1)) * 60 * 60;
    blockTime += (parseInt(m1)) * 60;
    blockTime = parseInt(blockTime) + parseInt(s1);

    unlockTime = (parseInt(h0)) * 60 * 60;
    unlockTime += (parseInt(m0)) * 60;
    unlockTime = parseInt(unlockTime) + parseInt(s0);

    form.style.display = "none";
    resetbtn.style.display = "";

    console.log(blockTime);
    console.log(unlockTime);

    let msg = {
        txt: "blockBrowsertimer",
        blockValue: blockTime,
        unlockValue: unlockTime
    }

    chrome.runtime.sendMessage(msg);
});

resetbtn.addEventListener('click', () => {
    form.style.display = "";
    form.hour_1.value = 0;
    form.hour_0.value = 0;
    form.min_1.value = 0;
    form.min_0.value = 0;
    form.sec_1.value = 0;
    form.sec_0.value = 0;

    resetbtn.style.display = "none";
    blockCountDown.innerHTML = "";
    unlockCountDown.innerHTML = "";
    
    let msg={
        txt:"browserTimer_reset"
    }

    chrome.runtime.sendMessage(msg);
});