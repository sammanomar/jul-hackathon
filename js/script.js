//Declare dom elements
const loc = document.getElementById('loc');
const btn = document.getElementById('btn');

//Current position
let pos = await returnCoordinates();

//Surf spots array
const surfSpots = [
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
    location: { lat: 50.611111, lng: -2.130472 },
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
    location: { lat: 58.305722, lng: -6.757472 },
  },
  {
    name: "Portrush East Strand, County Antrim, Northern Ireland",
    location: { lat: 55.205694, lng: -6.647694 },
  },
  {
    name: "Lahinch, County Clare, Ireland",
    location: { lat: 52.933444, lng: -9.348028 },
  }
];


// array of surf spot coordinates
let surfSpotCoords = []
for (let i = 0; i < surfSpots.length; i++) {
  surfSpotCoords.push(surfSpots[i].location)
}

// array of location names
let locationNames = []
for (let i = 0; i < surfSpots.length; i++) {
  locationNames.push(surfSpots[i].name)
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
      })

    }

    function error(error) {
      console.log("Sorry, we can\'t retrieve your local weather without location permission.");
    }

  });

};


async function returnCoordinates() {
  return getPosition();
};

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
  })

}

//returns API response
function returnAPIResponse(response) {
  let apiResponse = response
  console.log(apiResponse);
  return apiResponse
}

//collects distance & duration into array
function returnDistancesAndDurations(response) {
  let apiResponse = returnAPIResponse(response);
  let distancesAndDurations = apiResponse.rows[0].elements
  return distancesAndDurations
}


//adds and orders distances to surf spots into an array
function returnSortedDistanceArray(response) {
  let distancesAndDurations = returnDistancesAndDurations(response);
  let sortedDistances = [];
  for (let i = 0; i < distancesAndDurations.length; i++) {
    sortedDistances.push(distancesAndDurations[i].distance.value);
  }

  //orders by distance
  sortedDistances = sortedDistances.sort((a, b) => a - b)

  // replaces distance value with distance text
  for (let i = 0; i < sortedDistances.length; i++) {
    for (let j = 0; j < distancesAndDurations.length; j++) {
      if (sortedDistances[i] == distancesAndDurations[j].distance.value) {
        sortedDistances[i] = distancesAndDurations[j].distance.text;
      };
    }

  }
  return sortedDistances
}

// returns sorted place names
function sortLocationNames(response) {
  let apiResponse =returnAPIResponse(response);
  let sortedDistances =returnSortedDistanceArray(response);

  for (let i = 0; i < sortedDistances.length; i++){
    for (let j = 0; j < locationNames.length; j++){
      if (sortedDistances[i]== apiResponse.rows[0].elements[j].distance.text){
        locationNames[i]=surfSpots[j].name
      }
    }
  }
  return locationNames
}


//lists distances to surf spots onto page
function listDistances(response) {
  let locationNames = sortLocationNames(response);
  let sortedDistances = returnSortedDistanceArray(response);

  for (let i = 0; i < sortedDistances.length; i++) {
    loc.innerHTML += `<p>${locationNames[i]} : ${sortedDistances[i]} </p>`;
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
  }
  service.getDistanceMatrix(request).then((response) => {
    listDistances(response);
  });
}

function app() {
  initMap();
  btn.addEventListener('click', calcDistance);
}

app();

