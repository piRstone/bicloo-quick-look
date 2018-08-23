
function getStationInfos(stationId) {
    var url = "http://www.pirstone.com/webapps/bql/station.php?id="+stationId;
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function() {
        var response = JSON.parse(x.response);
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

// Show icon bike count if option is set
if (localStorage['bql-show-number'] != undefined && JSON.parse(localStorage['bql-show-number']) == true && localStorage['bql-fav-station'] != undefined) {
    getStationInfos(parseInt(localStorage['bql-fav-station']));

    // Checks availability at setted interval
    var intervalInMinutes;
    if (localStorage['bql-refresh-interval'] != undefined) {
        intervalInMinutes = JSON.parse(localStorage['bql-refresh-interval']);
    } else {
        intervalInMinutes = 10;
    }
    var interval = 1000 * 60 * intervalInMinutes;
    setInterval(function() {
        getStationInfos(parseInt(localStorage['bql-fav-station']));
    }, interval);
}
