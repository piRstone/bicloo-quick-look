
function getStationInfos(stationId) {
    var url = "https://www.pirstone.com/webapps/bql/station.php?id="+stationId;
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

function notifyFavJourney() {
    var startId = localStorage['bql-beg-station'];
    var endId = localStorage['bql-end-station'];
    var startStation = $.get("https://www.pirstone.com/webapps/bql/station.php?id=" + startId);
    var endStation = $.get("https://www.pirstone.com/webapps/bql/station.php?id=" + endId);
    $.when(startStation, endStation).done(function (beg, end) {
        var stations = {
            beg: JSON.parse(beg[0]),
            end: JSON.parse(end[0])
        };

        var bikesCount = stations.beg.available_bikes;
        var standsCount = stations.end.available_bike_stands;
        var title;

        if (bikesCount == 0 || standsCount == 0) {
            title = '⛔️ Trajet impossible';
        } else if ((bikesCount > 0 && bikesCount <= 2) ||
            (standsCount > 0 && standsCount <= 2)) {
            title = '⚠️ Trajet risqué';
        } else {
            title = '✅ Trajet possible';
        }

        var bikes = bikesCount > 1 ? bikesCount.toString() + ' vélos' : bikesCount.toString() + ' vélo';
        var stands = standsCount > 1 ? standsCount.toString() + ' places' : standsCount.toString() + ' place';

        var options = {
            type: 'basic',
            title: 'Bicloo Quick Look',
            contextMessage: title,
            message: 'Départ : ' + bikes + ' | Arrivée : ' + stands,
            iconUrl: 'icon128.png'
        }
        chrome.notifications.create(
            undefined,
            options
        );
    });
}

function checkorUpdateNotificationSetting() {
    // If favorite journey notification is activated, show notification at specified time
    if (localStorage['bql-display-fav-journey-notification'] != undefined) {
        if (JSON.parse(localStorage['bql-display-fav-journey-notification']) == true) {
            if (localStorage['bql-notification-hour'] != undefined) {
                // Check every minute if it's notification time
                var notificationTime = localStorage['bql-notification-hour'];

                var notificationInterval = setInterval(function () {
                    var d = new Date();
                    var currentTime = d.getHours() + ':' + d.getMinutes();
                    if (currentTime == notificationTime) {
                        notifyFavJourney();
                    }
                }, 60000);
            }
        }
    } else {
        if (notificationInterval !== undefined) {
            clearInterval(notificationInterval);
        }
    }
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

// Init notification setting
checkorUpdateNotificationSetting();


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === 'notification') {
        checkorUpdateNotificationSetting();
    }
});
