var stations = [];

function getStations(success) {
    var url = "https://bql.pirstone.com/webapps/bql/stations.php";
    $.get(url, function(data) {
        var data = JSON.parse(data);
        // Sort stations by id
        data.sort(function(a, b) {
            if (a.number < b.number)
                return -1;
            if (a.number > b.number)
                return 1;
            return 0;
        });
        stations = data;
        success();
    });
}

function displayInfos(data) {
    // Title
    var title = document.createElement('h2');
    var text = document.createElement('span');
    text.innerHTML = data.name.replace(/\#[0-9]{5}\s?\-\s?/g, ''); // Remove station number prefix (#00XXX - )
    var stationId = document.createElement('span');
    stationId.innerHTML = ' - ' + data.number;
    stationId.className = 'station-id';
    title.appendChild(text);
    title.appendChild(stationId);

    // Bikes available
    var available = data.available_bikes;
    var status = document.createElement('span');
    var sentence = document.createElement('span');
    if (available == 0) {
        sentence.className = "unavailable";
        sentence.innerHTML = "Aucun vélo disponible";
        status.className = "status false";
    } else if (available == 1) {
        sentence.innerHTML = available + " vélo disponible";
        status.className = "status true";
    } else {
        sentence.innerHTML = available + " vélos disponibles";
        status.className = "status true";
    }
    var bikes = document.createElement('p');
    bikes.appendChild(status);
    bikes.appendChild(sentence);

    // Stands available
    var standsAvailable = data.available_bike_stands;
    var status2 = document.createElement('span');
    var sentence2 = document.createElement('span');
    if (standsAvailable == 0) {
        sentence2.className = "unavailable";
        sentence2.innerHTML = "Aucune place disponible";
        status2.className = "status false";
    } else if (standsAvailable == 1) {
        sentence2.innerHTML = standsAvailable + " place disponible";
        status2.className = "status true";
    } else {
        sentence2.innerHTML = standsAvailable + " places disponibles";
        status2.className = "status true";
    }
    var stands = document.createElement('p');
    stands.appendChild(status2);
    stands.appendChild(sentence2);

    // Delete button
    var deleteBut = document.createElement('a');
    deleteBut.className = "delete";
    deleteBut.id = "delete-" + data.number;
    deleteBut.innerHTML = "&times;";
    deleteBut.setAttribute("title", "Retirer la station");

    var element = document.createElement('div');
    element.className = "station";
    element.id = "station-"+data.number;
    element.appendChild(title);
    element.appendChild(bikes);
    element.appendChild(stands);
    element.appendChild(deleteBut);
    document.getElementById('stations').append(element);
    document.getElementById('delete-' + data.number).addEventListener('click', deleteStation);
}

function getStationInfos(stationId) {
    for (var i=0 ; i < stations.length ; i++) {
        if (stations[i].number == stationId) {
            return stations[i];
        }
    }
}

function loadAddedStations() {
    if (localStorage['bql-fav-stations'] != undefined && localStorage['bql-fav-stations'] != '') {
        var savedStation = localStorage['bql-fav-stations'].split(',');
        for(var i=0 ; i < savedStation.length ; i++) {
            displayInfos(getStationInfos(savedStation[i]));
        }
    }
}

function showStationsList(e) {
    // Track stations list display
    if (e !== undefined) {
        _gaq.push(['_trackEvent', e.target.id, 'Show stations list']);
    }

    if ($('#add-station').hasClass('open')) {
        // Remove all event handlers of stations to add list
        $('#station-list').off('click', 'p', addStation);

        // Hide list of stations
        $('#main').removeClass('hide');
        $('#stations-list').addClass('hide');
        $('#add-station').removeClass('open');
    } else {
        // Display list of stations
        $('#main').addClass('hide');
        $('#stations-list').removeClass('hide');
        $('#add-station').addClass('open');
    }

    // Add stations to list
    var list = $('#stations-list');
    if (!list.hasClass('loaded')) {
        for(var i=0 ; i < stations.length ; i++) {
            var stationName = stations[i].name.replace('-', ' - ');
            list.append('<p id="add-station-' + stations[i].number + '" class="station-to-add">' + stationName + '</p>');
            $('#add-station-'+stations[i].number).click(addStation);
        }
        list.addClass('loaded');
    }
}

function addStation(event) {
    // Track station adding
    _gaq.push(['_trackEvent', event.target.id, 'Adding station']);

    // Close stations list
    showStationsList();

    // Hide empty message if no station where added before
    if (!$('#empty-stations').hasClass('hide')) {
        $('#empty-stations').addClass('hide');
    }

    var stationId = event.target.id.substring(12);

    // Store added station
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStations = localStorage['bql-fav-stations'].split(',');
        // If the added station is not already saved
        if (savedStations.indexOf(stationId) == -1) {
            // Display station in list
            displayInfos(getStationInfos(stationId));

            // Save station id in localStorage
            savedStations.push(stationId);
            localStorage['bql-fav-stations'] = savedStations;
        }
    } else {
        displayInfos(getStationInfos(stationId));
        localStorage['bql-fav-stations'] = stationId;
    }

    // Reset select to default value
    $('#add-station').prop('selectedIndex',0);
}

function deleteStation(event) {
    var id = event.target.id.substring(7);
    // Remove element
    document.getElementById('station-'+id).remove();

    // Remove value in storage
    var savedStation = localStorage['bql-fav-stations'].split(',');
    var i = savedStation.indexOf(id);
    savedStation.splice(i, 1);

    if (localStorage['bql-fav-station'] != undefined && id == parseInt(localStorage['bql-fav-station'])) {
        chrome.browserAction.setBadgeText({text: ""});
        localStorage.removeItem('bql-fav-station');
        localStorage.removeItem('bql-show-number');
    }

    if (localStorage['bql-beg-station'] != undefined && (id == parseInt(localStorage['bql-beg-station']) || id == parseInt(localStorage['bql-end-station']))) {
        localStorage.removeItem('bql-beg-station');
        localStorage.removeItem('bql-end-station');
        localStorage.removeItem('bql-display-fav-journee');
        $('#fav-journee').addClass('hide');
    }

    if (savedStation.length == 0) {
        // If no more saved stations, clear all settings
        localStorage.clear();
        $('#empty-stations').removeClass('hide');
        $('#fav-journee').addClass('hide');
    } else {
        localStorage['bql-fav-stations'] = savedStation;
    }
}

function showFavJournee() {
    if (localStorage['bql-display-fav-journee'] != undefined && JSON.parse(localStorage['bql-display-fav-journee']) == true) {
        var begStationId = localStorage['bql-beg-station'] != undefined ? parseInt(localStorage['bql-beg-station']) : undefined;
        var endStationId = localStorage['bql-end-station'] != undefined ? parseInt(localStorage['bql-end-station']) : undefined;
        if (begStationId != undefined && endStationId != undefined) {
            var beg = getStationInfos(begStationId);
            var end = getStationInfos(endStationId);

            // Create origin station div
            var begDiv = $('<li class="journee-station"></li>');
            begDiv.append('<span class="station-name">' + beg.name.replace(/\#[0-9]{5}\s?\-\s?/g, '') + '</span>');
            begDiv.append('<span class="count bikes"><img src="bike.png" alt="bike"/>'+beg.available_bikes+'</span>');

            // Create arrival station div
            var endDiv = $('<li class="journee-station"></li>');
            endDiv.append('<span class="station-name">' + end.name.replace(/\#[0-9]{5}\s?\-\s?/g, '') + '</span>');
            endDiv.append('<span class="count stands"><img src="marker.png" alt="station"/>'+end.available_bike_stands+'</span>');

            // Add data in journee block
            var favJourneeList = $('#fav-journee ul');
            favJourneeList.prepend(begDiv);
            favJourneeList.append(endDiv);

            // Display favorite journee block
            var favJourneeBlock = $('#fav-journee');
            favJourneeBlock.removeClass('hide');

            // Adding style to the block
            if (beg.available_bikes == 0 || end.available_bike_stands == 0) {
                favJourneeBlock.addClass('bad');
            } else if ((beg.available_bikes > 0 && beg.available_bikes <= 2) ||
                (end.available_bike_stands > 0 && end.available_bike_stands <= 2)) {
                favJourneeBlock.addClass('danger');
            } else {
                favJourneeBlock.addClass('good');
            }
        }
    }
}

function updateCountBadge() {
    if (localStorage['bql-show-number'] != undefined && JSON.parse(localStorage['bql-show-number']) == true && localStorage['bql-fav-station'] != undefined) {
        var station = getStationInfos(parseInt(localStorage['bql-fav-station']));
        if (station.available_bikes == 0) {
            chrome.browserAction.setBadgeBackgroundColor({color: "red"});
        } else {
            chrome.browserAction.setBadgeBackgroundColor({color: "green"});
        }
        chrome.browserAction.setBadgeText({text: station.available_bikes.toString()});
    }
}

function openOptions() {
    chrome.extension.getBackgroundPage().open('options.html');
}

document.addEventListener('DOMContentLoaded', function() {
    // Remove message if stations are already added
    if (localStorage['bql-fav-stations'] != undefined && localStorage['bql-fav-stations'] != '') {
        $('#empty-stations').addClass('hide');
    }

    // Load stations
    getStations(function() {
        loadAddedStations();
        showFavJournee();
        updateCountBadge();


        $('#settings').click(openOptions);
        $('#add-station').click(showStationsList);
    });
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
