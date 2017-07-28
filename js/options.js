var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";
var DEFAULT_INTERVAL = 15;

function getSavedStations() {
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey="+apiKey;
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStationsIds = localStorage['bql-fav-stations'].split(',');
        $.get(url, function(data) {
            var select = $('#fav-stations-choice');
            for(var i=0 ; i < savedStationsIds.length ; i++) {
                for(var j=0 ; j < data.length ; j++) {
                    if (data[j].number === parseInt(savedStationsIds[i])) {
                        select.append('<option value="'+data[j].number+'">'+data[j].name+'</option>');
                    }
                }
            }
        });
    }
}

function getStationAvailableBikesCount(stationId, success) {
    var url = "https://api.jcdecaux.com/vls/v1/stations/"+stationId+"?contract=nantes&apiKey="+apiKey;
    $.get(url, function(data) {
        if (data.available_bikes) {
            success(data.available_bikes);
        } else {
            success('*');
        }
    });
}

// Display bikes count for favorite station
function displayIconNumber(e) {
    localStorage['bql-show-number'] = e.target.checked;
    if (e.target.checked == true) {
        $('#show-interval').removeClass("hide");
        // Set bikes count in icon
        getStationAvailableBikesCount(17, function(count) {
            chrome.browserAction.setBadgeText({text: count.toString()});
            if (count == 0 || count == '*') {
                chrome.browserAction.setBadgeBackgroundColor({color: "red"});
            } else {
                chrome.browserAction.setBadgeBackgroundColor({color: "green"});
            }
        });
    } else {
        chrome.browserAction.setBadgeText({text: ""});
        $('#show-interval').addClass("hide");
    }
}

// Set icon number refresh interval (in minutes)
function setRefreshInterval() {
    localStorage['bql-refresh-interval'] = $('#interval').val();
    $('.interval-change-ok').removeClass("hide");
    setTimeout(function() {
        $('.interval-change-ok').addClass("hide");
    }, 2000);
}

function saveFavStation() {
    var stationId = $('#fav-stations-choice').val();
    localStorage['bql-fav-station'] = stationId;
    $('.fav-station-change-ok').removeClass("hide");
    setTimeout(function() {
        $('.fav-station-change-ok').addClass("hide");
    }, 2000);
}

function init() {
    // Get added stations
    getSavedStations();

    // Set number checkbox value
    if (localStorage['bql-show-number'] != undefined) {
        if (JSON.parse(localStorage['bql-show-number']) == true) {
            $('#show-icon-label').prop("checked", true);
        } else {
            $('#show-interval').addClass("hide");
        }
    }

    // Set refresh interval
    if (localStorage['bql-refresh-interval'] != undefined) {
        var interval = JSON.parse(localStorage['bql-refresh-interval']);
        $('#interval').val(interval);
    } else {
        $('#interval').val(DEFAULT_INTERVAL);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    init();
    document.getElementById('show-icon-label').addEventListener('change', displayIconNumber);
    $('.validate-interval').click(setRefreshInterval);
    $('.validate-fav-station').click(saveFavStation);
});
