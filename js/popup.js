var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";
var stations = [];


function getStations(success) {
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey="+apiKey;
    $.get(url, function(data) {
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
    text.innerHTML = data.name.substring(6);
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
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStation = localStorage['bql-fav-stations'].split(',');
        for(var i=0 ; i < savedStation.length ; i++) {
            displayInfos(getStationInfos(savedStation[i]));
        }
    }
}

function showStationsList() {
    if ($('#add-station').hasClass('open')) {
        // Remove all event handlers of stations to add list
        $('#station-list').off('click', 'p', addStation);

        // Hide list of stations
        $('#stations').removeClass('hide');
        $('#stations-list').addClass('hide');
        $('#add-station').removeClass('open');
    } else {
        // Display list of stations
        $('#stations').addClass('hide');
        $('#stations-list').removeClass('hide');
        $('#add-station').addClass('open');
    }

    // Add stations to list
    var list = $('#stations-list');
    for(var i=0 ; i < stations.length ; i++) {
        list.append('<p id="add-station-'+stations[i].number+'" class="station-to-add">'+stations[i].name.substring(3)+'</p>');
        $('#add-station-'+stations[i].number).click(addStation);
    }
}

function addStation(event) {
    // Close stations list
    showStationsList();

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
    localStorage['bql-fav-stations'] = savedStation;
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
            begDiv.append('<span class="station-name">'+beg.name.substring(6)+'</span>');
            begDiv.append('<span class="count bikes"><img src="bike.png" alt="bike"/>'+beg.available_bikes+'</span>');

            // Create arrival station div
            var endDiv = $('<li class="journee-station"></li>');
            endDiv.append('<span class="station-name">'+end.name.substring(6)+'</span>');
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
    // Load stations
    getStations(function() {
        loadAddedStations();
        showFavJournee();
        updateCountBadge();

        $('#settings').click(openOptions);
        $('#add-station').click(showStationsList);
    });
});
