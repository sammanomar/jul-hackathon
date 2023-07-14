const loc = document.getElementById('loc');
const btn = document.getElementById('btn');

//Determine browser location

let pos = await returnCoordinates();

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


// Calculate distance
async function calcDistance(){
  // const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();
  const origin1 = pos;
  
  const destinationA = "Stockholm, Sweden";
  const destinationB = { lat: 50.087, lng: 14.421 };
  const request = {
    origins: [origin1,],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  }

    loc.innerText = JSON.stringify(
      loc,
      null,
      1
    );
    
    
    service.getDistanceMatrix(request).then((response) => {
      // put response
    //   loc.innerText = JSON.stringify(
    //     response,
    //     null,
    //     1
    //   )
    let arr = response.rows[0].elements
    let arr2 = [];
    let arr2s = [];
    //sorts distances into array
    for (let i = 0; i < arr.length; i++) {
        arr2.push(arr[i].distance.value);
        arr2s = arr2.sort((a,b)=>a-b)
    }
    //checks in console 
    console.log(arr);
    console.log(arr2s);

    for (let i = 0; i < arr2s.length; i++) {
        loc.innerHTML = `${arr2s[i]} km`
    }
    });
  }

initMap();
btn.addEventListener('click', calcDistance);
