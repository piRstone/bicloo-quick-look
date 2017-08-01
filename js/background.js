var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";

function getStationInfos(stationId) {
    var url = "https://api.jcdecaux.com/vls/v1/stations/"+stationId+"?contract=nantes&apiKey="+apiKey;
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function() {
        var response = x.response;
        if (!response) {
            return;
        }
        if (response.available_bikes == 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: "red"});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: "green"});
        }
        chrome.browserAction.setBadgeText({text: response.available_bikes.toString()});
    };
    x.onerror = function() {
        console.error(x.response);
    };
    x.send();
}

// Initial count. 17 is for Sainte-Elisabeth station
// Show icon bike count if option is set
if (localStorage['bql-show-number'] != undefined && JSON.parse(localStorage['bql-show-number']) == true && localStorage['bql-fav-station'] != undefined) {
    getStationInfos(parseInt(localStorage['bql-fav-station']));

    // Checks availability at setted interval
    var intervalInMinutes;
    if (localStorage['bql-refresh-interval'] != undefined) {
        intervalInMinutes = JSON.parse(localStorage['bql-refresh-interval']);
    } else {
        intervalInMinutes = 15;
    }
    var interval = 1000 * 60 * intervalInMinutes;
    setInterval(function() {
        getStationInfos(17);
    }, interval);
}
