var apiKey = "e9e260718f3e80217b7d67cc20cd05a27019862c";

// chrome.browserAction.setBadgeText({text: data.available_bikes.toString()});

function displayInfos(data) {
    // Title
    var title = document.createElement('h2');
    title.innerHTML = data.name;

    // Bikes available
    var available = data.available_bikes;
    var sentence;
    if (available == 0) {
        sentence = "Aucun vélo disponible";
    } else if (available == 1) {
        sentence = available + " vélo disponible";
    } else {
        sentence = available + " vélos disponibles";
    }
    var bikes = document.createElement('p');
    bikes.innerHTML = sentence;

    // Stands available
    var standsAvailable = data.available_bike_stands;
    var sentence2;
    if (standsAvailable == 0) {
        sentence2 = "Aucune place disponible";
    } else if (standsAvailable == 1) {
        sentence2 = standsAvailable + " place disponible";
    } else {
        sentence2 = standsAvailable + " places disponibles";
    }
    var stands = document.createElement('p');
    stands.innerHTML = sentence2;

    // Delete button
    var deleteBut = document.createElement('a');
    deleteBut.className = "delete"
    deleteBut.id = "delete-" + data.number;
    deleteBut.innerHTML = "&times;";

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
    var url = "https://api.jcdecaux.com/vls/v1/stations/"+stationId+"?contract=nantes&apiKey="+apiKey;
    var x = new XMLHttpRequest();
    x.open('GET', url);
    x.responseType = 'json';
    x.onload = function() {
        var response = x.response;
        if (!response || response.error != undefined) {
            return;
        }
        displayInfos(response);
    };
    x.onerror = function() {
        console.error(x.response);
    };
    x.send();
}

function loadAddedStations() {
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStation = localStorage['bql-fav-stations'].split(',');
        for(var i=0 ; i < savedStation.length ; i++) {
            getStationInfos(savedStation[i]);
        }
    }
}

function getStationsList() {
    var url = "https://api.jcdecaux.com/vls/v1/stations?contract=nantes&apiKey="+apiKey;
    $.get(url, function(data) {
        var select = $('#add-station');
        for(var i=0 ; i < data.length ; i++) {
            select.append('<option value="'+data[i].number+'">'+data[i].name+'</option>');
        }
    });
}

function addStation(event) {
    getStationInfos(event.target.value);

    // Store added station
    if (localStorage['bql-fav-stations'] != undefined) {
        var savedStation = localStorage['bql-fav-stations'].split(',');
        savedStation.push(event.target.value);
        localStorage['bql-fav-stations'] = savedStation;
    } else {
        localStorage['bql-fav-stations'] = event.target.value;
    }
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

document.addEventListener('DOMContentLoaded', function() {
    // Load stations
    getStationsList();
    loadAddedStations();

    document.getElementById('add-station').addEventListener('change', addStation);
});
