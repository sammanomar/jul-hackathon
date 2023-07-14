//Declare dom elements
const loc = document.getElementById('loc');
const btn = document.getElementById('btn');

//Current position
let pos = await returnCoordinates();

//Surf spots array
const surfSpots = [
  { lat: 48.39276, lng: 135.72473 },
  { lat: 50.087, lng: 14.421 },
  { lat: 52.75672962610946, lng: -6.245176598717489 },
  { lat: 52.18789747091325, lng: -6.547300610706609 },
  { lat: 51.99890520306989, lng: -7.623960726158749 },

  // { lat: 4.56298, lng: 86.35182 },
  // { lat: 15.77314, lng: -32.27885 },
  // { lat: -25.77536, lng: -13.37909 },
  // { lat: 27.22509, lng: 37.68827 },
]
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


  map = new Map(document.getElementById("map"), {
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
  console.log(sortedDistances);
  return sortedDistances
}


//lists distances to surf spots onto page
function listDistances(response) {
  let sortedDistances = returnSortedDistanceArray(response);
  for (let i = 0; i < sortedDistances.length; i++) {
    loc.innerHTML += `<p>${sortedDistances[i]} </p>`;
  }
}


// Calculate distance
async function calcDistance() {

  const service = new google.maps.DistanceMatrixService();
  const request = {
    origins: [pos],
    destinations: surfSpots,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }
  service.getDistanceMatrix(request).then((response) => {
    // console.log(response);
    listDistances(response);
  });
}

function app() {
  initMap();
  btn.addEventListener('click', calcDistance);
}

app();

