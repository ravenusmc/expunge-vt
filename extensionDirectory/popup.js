let createPetition = document.getElementById('create-petition');

let resetDocket = document.getElementById('reset-docket-info');
let newElement = `'<span style="color:red">TEST</span>'`;
let loadedMessage;
let docketInfo = document.getElementById('docketInfo');

createPetition.onclick = function (element) {
    chrome.tabs.create({
        url: chrome.extension.getURL('formMenu.html')
    })
};

let clearData = document.getElementById('clear-data');
clearData.onclick = function (element) {
    var myNode = document.getElementById("countCards");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    document.getElementById('defendantName').innerHTML = "";
    document.getElementById('defendantDOB').innerHTML = "";
    document.getElementById('defendantAddress').innerHTML = "";
};



let expungeIT = document.getElementById('expunge-it');

expungeIT.onclick = function (element) {
    chrome.tabs.create({
        url: chrome.extension.getURL('./forms/petitionExpunge.html?1')
    })
};

document.addEventListener("DOMContentLoaded", function () {
    getData();
}, false);

function getData() {
    chrome.storage.local.get(['expungevt'], function (result) {
        console.log(result.expungevt);
        setPopUpData(result.expungevt[0])
    });
}



resetDocket.onclick = function (element) {
    injectPayload();

    chrome.storage.local.clear();

    function injectPayload() {
        // Inject the payload.js script into the current tab after the popout has loaded
        chrome.tabs.executeScript(null, {
            file: 'payload.js'
        });
    }
};

// Listen to messages from the payload.js script and write to popout.html
chrome.runtime.onMessage.addListener(function (message) {
    loadedMessage = message
    setPopUpData(message[0])
});

function setPopUpData(counts) {

    //Get current storage for camparison
    chrome.storage.local.get(['expungevt'], function (result) {
        currentStorage = result.expungevt[0]
    });
    //defendant info
    document.getElementById('defendantName').innerHTML = counts.defName;
    document.getElementById('defendantDOB').innerHTML = counts.defDOB;
    document.getElementById('defendantAddress').innerHTML = getAddress(counts.defAddress);

    function getAddress(addrArray) {
        addressHTML = ""
        for (i = 0; i < addrArray.length; i++) {
            addressHTML += "<br>" + addrArray[i]
        }
        return addressHTML
    }

    $('#countCards').empty();
    for (i = 0; i < counts.totalCounts; i++) {
        let card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = createCountCard(counts.counts[i])
        $('#countCards').append(card);

    }
}

function createCountCard(count) {
    let cardHTML = (`

    <div class="card">
        <div class="card-header" id=${"heading" + count.docketNum.trim() + "-" + count.countNum.trim()}>
            <button class="btn btn-link btn-sm countCardBtn" type="button" data-toggle="collapse" data-target=${"#collapse" + count.docketNum.trim() + "-" + count.countNum.trim()} aria-expanded="false" aria-controls=${"collapse" + count.docketNum.trim() + "-" + count.countNum.trim()}>
                <div class="buttonLink">
                    <span><i class="fas fa-gavel">  </span></i><ul class="nav md-pills nav-justified pills-rounded pills-outline-red">
                        <li class="nav-item pillText">
                        <a class="nav-link active pillText" data-toggle="tab" href="#panel61" role="tab">${count.county} </a></li>
                    </ul>
                    <ul class="nav md-pills nav-justified pills-rounded pills-outline-red smallPill" width="50" >
                        <li class="nav-item pillText">
                        <a class="nav-link active pillText" data-toggle="tab" href="#panel61" role="tab">${count.offenseClass} </a></li>
                    </ul>
                </div>
                <p><span>${"<b>" + count.docketNum.trim() + "/" + count.countNum.trim() + ":</b> " + count.description.substring(0, 23).trim()}</p></span>
             </button>
                
        </div>

        <div id=${"collapse" + count.docketNum.trim() + "-" + count.countNum.trim()} class="collapse " aria-labelledby=${"heading" + count.docketNum.trim() + "-" + count.countNum.trim()} data-parent="#countCards">
            <div class="card-body">
                <p><b>Desc: </b>${"  " + count.description.trim()}</p>
                <p><b>Statute: </b>${"  " + count.titleNum + " V.S.A. &sect " + count.sectionNum + " (" + count.offenseClass + ")"}</p>
                <p><b>Disposition: </b>${"  " + count.offenseDisposition}</p>
                <table class="table">
                    <thead class="">
                        <th scope="col">Alleged Offense Date</th>
                        <th scope="col">Arrest / Citation Date</th>
                        <th scope="col">Disposition Date</th>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${count.allegedOffenseDate}</td>
                            <td>${count.arrestCitationDate}</td>
                            <td>${count.dispositionDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    `);

    return cardHTML
}