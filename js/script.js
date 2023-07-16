//Declare dom elements
const loc = document.getElementById('loc');
const btn = document.getElementById('btn');
const newdiv = document.getElementById('newdiv');

//Current position
let pos = await returnCoordinates();
let locationWeather = [];

//Surf spots array
const surfSpots = [
    {
        name: "Sennen Cove, Cornwall, England",
        location: { lat: 50.07991, lng: -5.69756 }
    },
    {
        name: "Fistral Beach, Cornwall, England",
        location: { lat: 50.418472, lng: -5.098361 },
    },
    {
        name: "Perranporth, Cornwall, England",
        location: { lat: 50.351417, lng: -5.156333 },
    },
    {
        name: "Porthleven, Cornwall, England",
        location: { lat: 50.080611, lng: -5.313306 },
    },
    {
        name: "Bantham Beach, Devon, England",
        location: { lat: 50.278250, lng: -3.878833 },
    },
    {
        name: "Woolacombe, Devon, England",
        location: { lat: 51.163278, lng: -4.214694 },
    },
    {
        name: "Croyde Beach, Devon, England",
        location: { lat: 51.132639, lng: -4.238444 },
    },
    {
        name: "Saltburn, North Yorkshire, England",
        location: { lat: 54.586222, lng: -0.969222 },
    },
    {
        name: "Kimmeridge Bay, Dorset, England",
        location: { lat: 50.61210, lng: -2.13079 },
    },
    {
        name: "Llangennith, Gower Peninsula, Wales",
        location: { lat: 51.592083, lng: -4.294056 },
    },
    {
        name: "Newgale, Pembrokeshire, Wales",
        location: { lat: 51.851889, lng: -5.125278 },
    },
    {
        name: "Porth Neigwl, Gwynedd, Wales",
        location: { lat: 52.807667, lng: -4.549694 },
    },
    {
        name: "Rest Bay, Bridgend County, Wales",
        location: { lat: 51.488750, lng: -3.725361 },
    },
    {
        name: "Thurso East, Scotland",
        location: { lat: 58.596806, lng: -3.522972 },
    },
    {
        name: "Dalmore Bay, Isle of Lewis, Scotland",
        location: { lat: 58.30661, lng: -6.75709 },
    },
    {
        name: "Portrush East Strand, County Antrim, Northern Ireland",
        location: { lat: 55.20463, lng: -6.64790 },
    },
    {
        name: "Lahinch, County Clare, Ireland",
        location: { lat: 52.94035, lng: -9.35854 },
    }
];


// array of surf spot coordinates
let surfSpotCoords = [];
for (let i = 0; i < surfSpots.length; i++) {
    surfSpotCoords.push(surfSpots[i].location);
}

// array of location names
let locationNames = [];
for (let i = 0; i < surfSpots.length; i++) {
    locationNames.push(surfSpots[i].name);
}

//array of location coords
let locationCoords = [];
for (let i = 0; i < surfSpots.length; i++) {
    locationCoords.push(surfSpots[i].location);
}



//Determine browser location
function getPosition() {

    return new Promise((res, rej) => {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            console.log("Sorry, your browser does not support HTML5 geolocation.");
        }

        function success(position) {
            res({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

        }

        function error(error) {
            console.log(error);
            console.log("Sorry, we can\'t retrieve your local weather without location permission.");
        }

    });

}


async function returnCoordinates() {
    return getPosition();
}

// Initializes Google maps and displays map
let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");


    map = new Map(document.getElementById("map2"), {
        center: pos,
        zoom: 8,
    });
    new google.maps.Marker({
        position: pos,
        map: map
    });

}

//return weather API


//returns API response
function returnAPIResponse(response) {
    let apiResponse = response;

    return apiResponse;
}

//collects distance & duration into array
function returnDistancesAndDurations(response) {
    let apiResponse = returnAPIResponse(response);
    let distancesAndDurations = apiResponse.rows[0].elements;
    return distancesAndDurations;
}


//adds and orders distances to surf spots into an array
function returnSortedDistanceArray(response) {
    let distancesAndDurations = returnDistancesAndDurations(response);
    let sortedDistances = [];
    for (let i = 0; i < distancesAndDurations.length; i++) {
        sortedDistances.push(distancesAndDurations[i].distance.value);
    }

    //orders by distance
    sortedDistances = sortedDistances.sort((a, b) => a - b);

    // replaces distance value with distance text
    for (let i = 0; i < sortedDistances.length; i++) {
        for (let j = 0; j < distancesAndDurations.length; j++) {
            if (sortedDistances[i] == distancesAndDurations[j].distance.value) {
                sortedDistances[i] = distancesAndDurations[j].distance.text;
            }
        }

    }
    return sortedDistances;
}

// returns sorted place names
function sortLocationNames(response) {
    let apiResponse = returnAPIResponse(response);
    let sortedDistances = returnSortedDistanceArray(response);

    for (let i = 0; i < sortedDistances.length; i++) {
        for (let j = 0; j < locationNames.length; j++) {
            if (sortedDistances[i] == apiResponse.rows[0].elements[j].distance.text) {
                locationNames[i] = surfSpots[j].name;
            }
        }
    }
    return locationNames;
}

//return sorted coordinates
function returnSortedCoords(response) {
    let apiResponse = returnAPIResponse(response);
    let sortedDistances = returnSortedDistanceArray(response);

    for (let i = 0; i < sortedDistances.length; i++) {
        for (let j = 0; j < locationCoords.length; j++) {
            if (sortedDistances[i] == apiResponse.rows[0].elements[j].distance.text) {
                locationCoords[i] = surfSpots[j].location;
            }
        }
    }
    return locationCoords;
}

//return weather from coords
function returnLocationWeather(response) {
    let locationCoords = returnSortedCoords(response);

    for (let i = 0; i < locationCoords.length; i++) {
        setWeather(locationCoords[i].lat, locationCoords[i].lng);
    }

}


//lists distances to surf spots onto page
function listDistances(response) {

    let locationNames = sortLocationNames(response);
    let sortedDistances = returnSortedDistanceArray(response);
    let locationCoords = returnSortedCoords(response);
    newdiv.innerHTML = '<button id="weather-button">Weather &#9660;</button>';
    for (let i = 0; i < sortedDistances.length; i++) {
        setWeather(locationCoords[i].lat, locationCoords[i].lng);

        loc.innerHTML += `<div>
                  <a href = 'https://www.google.com/maps/place/${locationNames[i]}' target='_blank' ><p class ='location-name'>${locationNames[i]} : ${sortedDistances[i]}</p></a>
                  </div>
                  <div id = weather-info-${i}></div>
                      `;

    }

    btn.removeEventListener('click', calcDistance);

}




//lists weather beneath location
function listWeather() {
    for (let i = 0; i < locationWeather.length; i++) {
        let weatherInfoI = document.getElementById(`weather-info-${i}`);
        weatherInfoI.innerHTML = locationWeather[i];
    }

}


// Calculate distance
async function calcDistance() {

    const service = new google.maps.DistanceMatrixService();
    const request = {
        origins: [pos],
        destinations: surfSpotCoords,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
    };
    service.getDistanceMatrix(request).then((response) => {
        returnLocationWeather(response);
        listDistances(response);
        let weatherButton = document.getElementById('weather-button');
        weatherButton.addEventListener('click', listWeather);

    });
}

////...Weather
function setWeather(lat, lng) {
    let openWeatherData = {};
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=1fefee8e8b1a71cebdcd8c7a806ae7a6`);
    xhr.responseType = 'text';
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            openWeatherData = JSON.parse(xhr.responseText);
            weatherInformations(openWeatherData);
        } else {
            console.log(xhr.status);
        }
    }, false);
    xhr.send();
}



function weatherInformations(openWeatherData) {
    let weather = `${openWeatherData.weather[0].main} : ${openWeatherData.weather[0].description} `;
    let temp = Math.round(openWeatherData.main.temp);
    let seaLevel = openWeatherData.main.sea_level;
    let wind = Math.round(openWeatherData.wind.speed);
    let time = new Date(openWeatherData.dt * 1000);
    let hrs = time.getHours();
    let mins = time.getMinutes();
    let timeString = '';
    if (mins < 10) {
        mins = `0${mins}`;
    }
    if (hrs === 12) {
        timeString = `12:${mins} PM`;
    } else if (hrs > 12) {
        timeString = `${hrs - 12}:${mins} PM`;
    } else if (hrs === 0) {
        timeString = `12:${mins} AM`;
    } else {
        timeString = `${hrs}:${mins} AM}`;
    }
    const str = `<div class='weather-box'>
  <p> ${weather}</p>
  <p>Sea Level : ${seaLevel}</p>
         <p>${temp}°C  Wind Speed: ${wind} m/h Current Time: ${timeString}</p>
          </div>`;
    locationWeather.push(str);
}


function app() {
    initMap();
    btn.addEventListener('click', calcDistance);
}

app();

