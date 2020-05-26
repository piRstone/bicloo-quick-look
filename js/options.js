var DEFAULT_INTERVAL = 10;

function initFavJournee(stations) {
    // Fill selects options
    var begin = $('#begin-station');
    var end = $('#end-station');
    for(var i=0 ; i < stations.length ; i++) {
        begin.append('<option value="'+ stations[i].number +'" id="beg-'+ stations[i].number +'">'+ stations[i].name +'</options>');
        end.append('<option value="'+ stations[i].number +'" id="end-'+ stations[i].number +'">'+ stations[i].name +'</options>');
    }

    // Set options if data are filled
    if (localStorage['bql-beg-station'] != undefined && localStorage['bql-end-station'] != undefined) {
        var begStationId = parseInt(localStorage['bql-beg-station']);
        var endStationId = parseInt(localStorage['bql-end-station']);
        var begOption = $('#beg-'+begStationId);
        var endOption = $('#end-'+endStationId);
        begOption.prop('selected', true);
        endOption.prop('selected', true);
    }
}

function getSavedStations() {
    var url = "https://bql.pirstone.com/webapps/bql/stations.php";
    var favStation;
    if (localStorage['bql-fav-station'] != undefined) {
        favStation = localStorage['bql-fav-station'];

        // Display checkbok count badge
        $('#icon-number').removeClass('hide');
    }
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStationsIds = localStorage['bql-fav-stations'].split(',');
        var savedStations = [];
        $.get(url, function(data) {
            var data = JSON.parse(data);
            var select = $('#fav-stations-choice');
            for(var i=0 ; i < savedStationsIds.length ; i++) {
                for(var j=0 ; j < data.length ; j++) {
                    if (data[j].number === parseInt(savedStationsIds[i])) {
                        // Add station to saved stations list
                        savedStations.push(data[j]);

                        // Fill the select options
                        if (favStation && data[j].number == favStation) {
                            select.append('<option value="'+data[j].number+'" selected>'+data[j].name+'</option>');
                        } else {
                            select.append('<option value="'+data[j].number+'">'+data[j].name+'</option>');
                        }
                    }
                }
            }

            // Init favorite journee
            if (savedStations.length > 0) {
                initFavJournee(savedStations);
            }
        });
    }
}

function getStationAvailableBikesCount(stationId, success) {
    var url = "https://bql.pirstone.com/webapps/bql/station.php?id="+stationId;
    $.get(url, function(data) {
        var data = JSON.parse(data);
        if (data.available_bikes != undefined) {
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
        getStationAvailableBikesCount(parseInt(localStorage['bql-fav-station']), function(count) {
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

function displayFavJournee(e) {
    localStorage['bql-display-fav-journee'] = e.target.checked;
    if (e.target.checked == true) {
        $('#select-fav-journee-stations').removeClass('hide');
    } else {
        $('#select-fav-journee-stations').addClass('hide');
    }
}

function saveFavStation() {
    var stationId = $('#fav-stations-choice').val();
    localStorage['bql-fav-station'] = stationId;

    // Display icon badge options
    if ($('#icon-number').hasClass('hide')) {
        $('#icon-number').removeClass('hide');
    }

    // Show validation message
    $('.fav-station-change-ok').removeClass("hide");
    setTimeout(function() {
        $('.fav-station-change-ok').addClass("hide");
    }, 2000);
}

function saveJourney() {
    var begin = $('#begin-station').val();
    var end = $('#end-station').val();
    if (begin != end) {
        localStorage['bql-beg-station'] = begin;
        localStorage['bql-end-station'] = end;
        $('.fav-journee-change-ok').removeClass("hide");
        setTimeout(function() {
            $('.fav-journee-change-ok').addClass("hide");
        }, 2000);
    } else {
        $('.fav-journee-error').removeClass("hide");
        setTimeout(function() {
            $('.fav-journee-error').addClass("hide");
        }, 4000);
    }
}

function displayFavJourneyNotification(e) {
    localStorage['bql-display-fav-journey-notification'] = e.target.checked;
    chrome.runtime.sendMessage('notification'); // Update background script
    if (e.target.checked == true) {
        $('#notify-fav-journey-hour').removeClass('hide');
    } else {
        $('#notify-fav-journey-hour').addClass('hide');
    }
}

function saveFavJourneyNotifHour() {
    var hour = $('#notify-hour').val();
    localStorage['bql-notification-hour'] = hour;
    chrome.runtime.sendMessage('notification'); // Update background script

    $('.notif-hour-change-ok').removeClass('hide');
    setTimeout(function() {
        $('.notif-hour-change-ok').addClass('hide');
    }, 4000);
}

function init() {
    // Get added stations
    getSavedStations();

    // Remove orange message if saved stations are not empty
    if (localStorage['bql-fav-stations'] != undefined) {
        $('#empty-message').addClass('hide');
    }

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

    // Set fav journey checkbox
    if (localStorage['bql-display-fav-journee'] != undefined) {
        if (JSON.parse(localStorage['bql-display-fav-journee']) == true) {
            $('#show-fav-station').prop("checked", true);
            $('#select-fav-journee-stations').removeClass('hide');
        }

        // Set notification checkbox
        if (localStorage['bql-display-fav-journey-notification'] != undefined) {
            if (JSON.parse(localStorage['bql-display-fav-journey-notification']) == true) {
                $('#notify-fav-journey').prop("checked", true);
                $('#notify-fav-journey-hour').removeClass('hide');

                // Set notification hour
                if (localStorage['bql-notification-hour'] != undefined) {
                    $('#notify-hour').val(localStorage['bql-notification-hour']);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    init();
    $('#show-icon-label').change(displayIconNumber);
    $('.validate-interval').click(setRefreshInterval);
    $('.validate-fav-station').click(saveFavStation);
    $('#show-fav-station').change(displayFavJournee);
    $('.validate-fav-journee').click(saveJourney);
    $('#notify-fav-journey').click(displayFavJourneyNotification);
    $('.validate-notif-hour').click(saveFavJourneyNotifHour);
});

// Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-109217041-1']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
