let createPetition = document.getElementById('create-petition');
let resetDocket = document.getElementById('reset-docket-info');




let newElement = `'<span style="color:red">TEST</span>'`

createPetition.onclick = function (element) {
    chrome.tabs.create({
        url: chrome.extension.getURL('options.html#window')
    })
};


resetDocket.onclick = function (element) {

    if (window.confirm("Are you sure?")) {
        injectPayload()
    }

    function injectPayload() {
        // Inject the payload.js script into the current tab after the popout has loaded
        chrome.extension.getBackgroundPage().chrome.tabs.executeScript(null, {
            file: 'payload.js'
        });;
    }
};

window.addEventListener('load', function (evt) {

    // let storageCounts = JSON.parse(localStorage.getItem('counts'))
    // alert(storageCounts)

    // setPopUpData(storageCounts[0]);

    chrome.tabs.executeScript({
        code: 'JSON.stringify(localStorage)'
    }, res => {
        lsObj = JSON.parse(res[0])
        key = "counts"
        // ls.innerHTML = lsHtml ? lsHtml : "The active tab has nothing in localStorage";
        setPopUpData(JSON.parse(lsObj[key]));
    })
})


// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {

    setPopUpData(message)

});

function setPopUpData(counts) {
    document.getElementById('pagetitle').innerHTML = counts[0]["docket"];
    document.getElementById('countNum').innerHTML = counts[0]["countNum"];
    // document.getElementById('docket').innerHTML = counts[0]["docket"];
    document.getElementById('offenseStatute').innerHTML = counts[0]["offenseTitle"] + " V.S.A. &sect " + counts[0]["offenseSection"] + " (" + counts[0]["offenseDesc"] + ")";
    document.getElementById('offenseStatus').innerHTML = counts[0]["offenseStatus"];
    document.getElementById('date').innerHTML = counts[0]["date"];
}
