// Chetan Tyagi
// 2 August 2023



// Initialize the map
const map = L.map('map').setView([0, 0], 2);

const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 16,
}).addTo(map);


// Initialize game variables
// Initialize high scores from localStorage or an empty array

let guessedCities = {};

let playerScore = 0;
let marker = null;
let initialCity = '';
let initialCountry = '';
let initialCapital = '';
let initialLat = 0;
let initialLng = 0;
let startTime = 0;
let endTime = 0;
let timerInterval = null;
tingtong=0
// Use Nominatim API to retrieve the city, country, and capital for the initial coordinates
async function initializeGame() {
  [initialLat, initialLng] = await getRandomLandCoordinates();
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${initialLat}&lon=${initialLng}`;
  try {
    const response = await fetch(nominatimUrl);
    const data = await response.json();
    initialCity = data.address.city || data.address.town || data.address.village || data.address.hamlet || 'Unknown';
    initialCountry = data.address.country || 'Unknown';

    
    //initialCapital = data.address.country_capital || 'Unknown';
    
  } catch (error) {
    console.error('Error retrieving city, country, and capital for initial coordinates:', error);
  }
}

function startTimer() {
  let seconds = 0;
  const timerElement = document.getElementById('timer');

  timerInterval = setInterval(() => {
    seconds++;
    timerElement.textContent = `Time Elapsed: ${seconds} seconds`;
  }, 1000);
  tingtong=5
}
// Add click event listener to map
map.on('click', function(event) {
  if (marker === null) {
    // Add marker at clicked location with custom icon
    marker = L.marker(event.latlng, {
      icon: L.icon({
        iconUrl: '../styles/assets/select_marker.png',
        iconSize: [65, 65], // Adjust the size as needed
      })
    }).addTo(map);
  } else {
    // Move marker to clicked location
    marker.setLatLng(event.latlng);
  }
});
if (tingtong!=5){  startTimer()    
    startTime = Date.now();
   ; 
 }

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  
}

// Add this code to your existing updateHighScoreList function
// Modify the updateHighScoreList function to include rankings
async function updateHighScoreList() {
  const highScoreList = document.getElementById('high-score-list');
  highScoreList.innerHTML = '';

  // Fetch high scores from Firebase Firestore and update the list
  try {
    const querySnapshot = await db.collection("street_score").orderBy("score", "desc").limit(10).get();
    let rank = 1; // Initialize the ranking counter
    querySnapshot.forEach((doc) => {
      const scoreData = doc.data();
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong> ${scoreData.name}</strong>: ${scoreData.score} points (${scoreData.date})`;
      highScoreList.appendChild(listItem);
      rank++; // Increment the ranking counter for the next score
    });
  } catch (error) {
    console.error("Error getting high scores: ", error);
  }
}

let image1 = document.getElementById('image1');
let image2 = document.getElementById('image2');
let image3 = document.getElementById('image3');

// Handle guess button click event
const guessButton = document.getElementById('guess-button');
const showCoordinatesCheckbox = document.getElementById('show-coordinates');
let guessCount = 0; // Initialize guess count
guessButton.addEventListener('click', async function () {
  if (marker === null) {
    return;
  }
  if (guessCount >= 2) { // Check if guess count exceeds limit
    guessButton.textContent = 'See the Answer';
  }
  if (guessCount >= 3) { // Check if guess count exceeds limit

    const arrowIcon = L.icon({
      iconUrl: '../styles/assets/result_marker.png', // Replace with the path to your select_marker.png
      iconSize: [65, 65], // Adjust the size of the arrow icon
    });
    const arrowMarker = L.marker([initialLat, initialLng], { icon: arrowIcon }).addTo(map); // Place arrow marker on the map to point to the answer
    return;
  }
  guessCount++; // Increment guess count

  // Remove the arrowMarker if it exists

  const guessLat = marker.getLatLng().lat.toFixed(4);
  const guessLng = marker.getLatLng().lng.toFixed(4);

  const helloDiv = document.querySelector('.text-center2');
  if (helloDiv !== null) {
    helloDiv.textContent = '';
  }

  const loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block'; // Show loading element

  // Use Nominatim API to retrieve the nearest city, country, and capital to the marker
  const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${guessLat}&lon=${guessLng}`;

  try {
    const response = await fetch(nominatimUrl);
    const data = await response.json();

    const guessCity = data.address.city || data.address.town || data.address.village || data.address.hamlet || 'Unknown';
    const guessCountry = data.address.country || 'Unknown';
    const guessDistance = Math.round(marker.getLatLng().distanceTo([initialLat, initialLng]));

    const resultText = [];
    for (const guessedCity in guessedCities) {
      const distance = marker.getLatLng().distanceTo(guessedCities[guessedCity].getLatLng());
      if (distance <= 50000) {
        alert('You are too close to a previously guessed city. Try another location.');
        return;
      }
    }


    if (guessDistance < 50000) {
      endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000;
      playerScore += 10; // Calculate time taken in seconds
      resultText.push(`<strong>You win! Distance from answer:</strong> ${guessDistance / 1000} kilometers. <strong>Your Guess:</strong> ${guessCity}, ${guessCountry}. `);
      guessedCities[initialCity] = L.marker(marker.getLatLng()).addTo(map);

      stopTimer();

      resultText.push(`Reload the page to start a new round.`);
      const playerScoreElement = document.getElementById('player-score');
      playerScoreElement.textContent = playerScore;
    } else {
      resultText.push(`<strong>Distance from answer:</strong> ${guessDistance / 1000} kilometers. <strong>Your Guess:</strong> ${guessCity}, ${guessCountry}.`);
      if (guessCount === 1) {
        image1.style.display = 'none';
      } else if (guessCount === 2) {
        image2.style.display = 'none';
      } else if (guessCount === 3) {
        image3.style.display = 'none';
      }
      if (initialLat.toFixed(4) !== 0.0000 && initialCity !== "" && initialCity !== "Unknown") {
      } else {
        // Fix the loop to properly fetch the data for initial coordinates
        let validInitialCity = false;
        do {
          [initialLat, initialLng] = await getRandomLandCoordinates();
          const nominatimUrlLoop = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${initialLat}&lon=${initialLng}`;
          try {
            const response = await fetch(nominatimUrlLoop);
            const data = await response.json();
            initialCity = data.address.city || data.address.town || data.address.village || data.address.hamlet || 'Unknown';
            validInitialCity = initialCity !== "" && initialCity !== "Unknown";
            initialCountry = data.address.country || 'Unknown';

          } catch (error) {
            console.error('Error retrieving city, country, and capital for initial coordinates:', error);
          }
        } while (!validInitialCity);
      }
    }

    // Add latitude and longitude of guess and initial coordinates if checkbox is checked
    if (showCoordinatesCheckbox.checked) {
      resultText.push(`<strong>Guess Coordinates:</strong> ${guessLat}, ${guessLng}`);
      resultText.push(`<strong>Answer Coordinates:</strong> ${initialLat.toFixed(4)}, ${initialLng.toFixed(4)}`);
    }

    // Remove previous circle if it exists

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = resultText.join('<br>');

  } catch (error) {
    console.error('Error retrieving nearest city, country, and capital:', error);
  } finally {
    loadingElement.style.display = 'none'; // Hide loading element
  }

});
function resetImages() {
  image1.style.display = 'block';
  image2.style.display = 'block';
  image3.style.display = 'block';
}
function sanitizeInput(input) {
  // Replace '<' with '&lt;' and '&' with '&amp;'
  return input.replace(/</g, '&lt;').replace(/&/g, '&amp;');
}
// Generate random coordinates on land
async function getRandomLandCoordinates() {
  
  const cityIds = [
    "paris-1202903123464252",
  
    "agra-156038159745395",
    
    "keystone-768858467067157",
    
    "barcelona-987420751796837" ,
    
    "beijing-604012977205983",
    
    "tokyo-1195388297830542",
    
    "berlin-3239772952947894",
    
    
    "lucerne-1112576252586784",
    
    "pisa-243324604210417",
    
    "bangkok-492548511955809",
    
    "houston-626149635009294",
  
    "singapore-2800278286968363",
  
    "jakarta-383086720385784",
    
    "new york-126491143334729",
  
    "kabul-143431291046379",
    
    "banff-162769565655436",
    
    "edmonton-276369800814495",
    
    "london-557807761891307",
    
    "oslo-229430919192635",
    
    "calgary-1092582851151417",
    
    "rio de janeiro-477309337031051",
    
    "hanoi-685942156728923",
  
    "chicago-513112553151500",
  
    "dubai-331484938401580",
  
    "cuzco-279416883907644",
  
    "new york-533358671467146",
  
    "amsterdam-838761340319948",
  
    "las vegas-587347449630786",
  
    "reykjavik-200688741736661",
  
    "prague-198071292185889"
  
  ];
  
  // Shuffle the city IDs randomly
  function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  }
  shuffleArray(cityIds);
  
  // Get a random city ID and extract the numbers after "-"
  const randomCityId = cityIds[Math.floor(Math.random() * cityIds.length)];
  const citybeforeHyphen = randomCityId.split('-')[0];
  const numbersAfterHyphen = randomCityId.split('-')[1];
  
  var { Viewer } = mapillary;

  var viewer = new Viewer({
    accessToken: "MLY|6567123976742596|e9835e8db194154123b48d4979d5927c",
    container: "mly",
    imageId: numbersAfterHyphen,
    sequence: false // Disable arrow overlay

  });
  const randomCity = citybeforeHyphen
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(randomCity)}&format=json`;
  let lat, lng, city, country;
  try {
    const response = await fetch(nominatimUrl);
    const data = await response.json();
    if (data && data[0]) {
      lat = parseFloat(data[0].lat);
      lng = parseFloat(data[0].lon);

      
    }
    
  } catch (error) {
    console.error('Error retrieving city information for:', randomCity, error);
  }
  return [lat, lng];
}

// Define a variable to track the visibility state of the high score table
let highScoresVisible = false;

// Function to toggle the visibility of the high score table
function toggleHighScores() {
  const highScoreTable = document.getElementById("score-table");
  const toggleButton = document.getElementById("toggle-high-scores");

  if (highScoresVisible) {
    highScoreTable.style.display = "none";
    toggleButton.textContent = "Show High Scores";
  } else {
    highScoreTable.style.display = "block";
    toggleButton.textContent = "Hide High Scores";
  }

  // Toggle the visibility state
  highScoresVisible = !highScoresVisible;
}
let mapVisible = false;

function toggleMap() {
    const map = document.getElementById("map");
    const toggleButton = document.getElementById("toggle-map");

    if (mapVisible) {
      map.style.visibility = "hidden";
      toggleButton.textContent = "Show Map";
    } else {
      map.style.visibility = "visible";
      toggleButton.textContent = "Hide Map";
    }

    // Toggle the visibility state
    mapVisible = !mapVisible;
  }
  
  

// Initialize the game when the window finishes loading
window.addEventListener('load', async function () {
    await initializeGame();
    updateHighScoreList(); // Add this line
  });




const saveScoreButton = document.getElementById('save-score');
saveScoreButton.addEventListener('click', async () => {
  saveScoreButton.disabled = true;

  const userNameInput = document.getElementById('user-name');
  const userName = userNameInput.value;
  const sanitizedUserName = sanitizeInput(userName); // Sanitize the user's name

  // Check if the user name exceeds 15 characters
  if (sanitizedUserName && sanitizedUserName.trim() !== '' && sanitizedUserName.length <= 15) {
    const userScore = playerScore;
    const currentDate = new Date().toLocaleDateString();
    const newHighScore = { name: sanitizedUserName, score: userScore, date: currentDate };

    // Save the high score to Firebase
    db.collection("street_score")
      .add(newHighScore)
      .then(function (docRef) {
        console.log("High score saved with ID: ", docRef.id);

        // Hide the input field and button
        userNameInput.style.display = 'none';
        saveScoreButton.style.display = 'none';

        // Show the "Submitted!" message
        const submittedMessage = document.getElementById('submitted-message');
        submittedMessage.style.display = 'block';

        // Add the new high score to the leaderboard
        const highScoreList = document.getElementById('high-score-list');
        const newListItem = document.createElement('li');
        newListItem.textContent = `${sanitizedUserName}, Score: ${userScore}, Date: ${currentDate}`;
        highScoreList.appendChild(newListItem);
      })
      .catch(function (error) {
        console.error("Error adding high score: ", error);
      });
  } else {
    // Display an error message if the user name is too long
    alert('User name must be 15 characters or less.');
  }
});



function startNewGame() {
  resetImages();

  guessCount=0
startTime = 0;
endTime = 0;
stopTimer();
startTimer();
tingtong=1
const timerElement = document.getElementById('timer');
timerElement.textContent = 'Time Elapsed: 0 seconds';
for (const guessedCity in guessedCities) {
  map.removeLayer(guessedCities[guessedCity]);
}
guessedCities = {};  
if (marker !== null) {
  map.removeLayer(marker);
  marker = null;
}

var mlyContainer = document.getElementById('mly');
if (mlyContainer) {
  mlyContainer.innerHTML = ''; // Remove the content inside the Mapillary container
}


marker = null;
initialCity = '';
initialCountry = '';
initialCapital = '';
initialLat = 0;
initialLng = 0;


window.addEventListener('load', () => {
  updateHighScoreList();
});


// Reset result text
const resultDiv = document.getElementById('result');
resultDiv.textContent = '';

// Remove previous marker and circle
if (marker !== null) {
  map.removeLayer(marker);
  marker = null;
}

const helloDiv = document.querySelector('.text-center2');
if (helloDiv !== null) {
}

// Initialize new game
initializeGame();


}

// Add new game button and text to the HTML
const newGameButton = document.createElement('button');
newGameButton.id = 'new-game-button';
newGameButton.textContent = 'New Game';
newGameButton.addEventListener('click', startNewGame);
const textContainer = document.querySelector('.text-container');
textContainer.insertBefore(newGameButton, textContainer.firstChild);