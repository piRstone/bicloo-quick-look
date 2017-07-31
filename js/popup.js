var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";
var stations = [];


function getStations(success) {
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey="+apiKey;
    $.get(url, function(data) {
        stations = data;
        success();
        var select = $('#add-station');
        for(var i=0 ; i < data.length ; i++) {
            select.append('<option value="'+data[i].number+'">'+data[i].name+'</option>');
        }
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
            displayInfos(stations[i]);
        }
    }
}

function loadAddedStations() {
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStation = localStorage['bql-fav-stations'].split(',');
        for(var i=0 ; i < savedStation.length ; i++) {
            getStationInfos(savedStation[i]);
        }
    }
}

function addStation(event) {
    // Store added station
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStations = localStorage['bql-fav-stations'].split(',');
        // If the added station is not already saved
        if (savedStations.indexOf(event.target.value) == -1) {
            // Display station in list
            getStationInfos(event.target.value);

            // Save station id in localStorage
            savedStations.push(event.target.value);
            localStorage['bql-fav-stations'] = savedStations;
        }
    } else {
        getStationInfos(event.target.value);
        localStorage['bql-fav-stations'] = event.target.value;
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

function openOptions() {
    chrome.extension.getBackgroundPage().open('options.html');
}

document.addEventListener('DOMContentLoaded', function() {
    // Load stations
    getStations(function() {
        loadAddedStations();

        $('#settings').click(openOptions);
        $('#add-station').change(addStation);

        console.log('stations', stations);
    });
});
