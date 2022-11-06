// Global variables
var city = "";
const apiKey = "2a486f5bbf138ec48900a8c6c87fef7c"; // search history as an empty array
var search = "";
var lat;
var lon;
// Weather API endpoint
var onecallUrl =
  "https://api.openweathermap.org/data/3.0/onecall?q=" +
  city +
  "&units=imperial&appid=" +
  apiKey;

// DOM element references
// search button
const buttonSearch = document.getElementById("searchBtn");
// search input
const inputSearch = document.getElementById("inputBox");
// history button
const buttonRecent = document.getElementById("recentBtn");
// container for today's weather
const currentContainer = document.getElementById("currentConditions");
// container for the forecast
const forecastContainer = document.getElementById("forecast");
// container for the search history
const historyContainer = document.getElementById("historyContainer");

// Function to display the search history list.
function renderSearchHistory() {
  buttonRecent.innerHTML = "";
  // Creates forloop for search history
  for (var i = 0; i < localStorage.length; i++) {
    city = localStorage.getItem(localStorage.key(i));
    // Creates button for search history
    var historyButton = document.createElement("button");
    // Sets id for generated button to recentBtn so match css
    historyButton.setAttribute("class", "button");
    historyButton.setAttribute("id", "recentBtn", city);
    historyButton.textContent = city;
    buttonRecent.appendChild(historyButton);
    document
      .getElementById(city)
      .addEventListener("click", handleSearchHistoryClick);
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array
  localStorage.setItem(search, search);
  // set search history array to local storage
  renderSearchHistory();
}

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  // Store response data from our fetch request in variables
  // temperature, wind speed, etc.
  // document.create the elements you'll want to put this information in
  currentContainer.innerHTML = "";
  var currentCard = document.createElement("div");
  var currentName = document.createElement("h2");
  var currentTemp = document.createElement("p");
  var currentWind = document.createElement("p");
  var currentHumidity = document.createElement("p");

  // Attributes for current conditions
  currentCard.setAttribute("id", "currentConditions");

  // Icon selection
  //
  //   id = currentIcon
  //
  // Icon Selection

  // Formatting for Date, applies to current and forecast
  var date = new Date();
  var dd = String(date.getDate()).padStart(2, "0");
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var yyyy = date.getFullYear();
  date = mm + "/" + dd + "/" + yyyy;

  // append those elements somewhere
  currentContainer.appendChild(currentName);
  currentContainer.appendChild(currentCard);
  currentCard.appendChild(currentTemp);
  currentCard.appendChild(currentWind);
  currentCard.appendChild(currentHumidity);

  // give them their appropriate content
  currentName.innerHTML = city + " (" + date + ") " + "iconHere";
  currentTemp.innerText = "Temp: " + weather.main.temp + " °F";
  currentWind.innerText = "Wind: " + weather.wind.speed + " mph";
  currentHumidity.innerText = "Humidity: " + weather.main.humidity + "%";
}

// Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
// daily forecast.
function renderForecastCard(forecast) {
  // variables for data from api
  // temp, windspeed, etc.
  // Create elements for a card
  // append
  // Add content to elements
  // append to forecast section
}

// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  // set up elements for this section

  // append

  // loop over dailyForecast

  for (var i = 0; i < dailyForecast.length; i++) {
    // send the data to our renderForecast function as an argument
    renderForecastCard(dailyForecast[i]);
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0]);
  renderForecast(data.list);
}

// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(lat, lon, city) {
  // api url
  var onecallUrl =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;

  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(cityState, data)
  fetch(onecallUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        renderItems(city, data);
      });
    } else {
      return;
    }
  });
}

// Function to fetch coordinates
function fetchCoords(search) {
  var city = search;
  var coordsUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    ",US&limit=5&appid=" +
    apiKey;
  // API fetch for coordinates
  fetch(coordsUrl).then(function (response) {
    if (response.ok) {
      // Logs data from API fetch
      response.json().then(function (data) {
        if (data.length === 0) {
          return;
        }
        // Creates variables from lat and long values
        lat = data[0].lat;
        lon = data[0].lon;
        search = data[0].name;
        city = search;
        // Logs values for long and lat
        console.log("latitude: " + lat + "\nlongitude: " + lon);

        // Appends search to history and runs fetch weather function with created variables from API response
        appendToHistory(search);
        fetchWeather(lat, lon, city);
      });
    }
  });
}

function handleSearchFormSubmit(e) {
  console.log("Search submitted");
  if (!inputSearch.value) {
    return;
  }
  e.preventDefault();

  search = inputSearch.value.trim();
  console.log("Search = " + search);
  fetchCoords(search);
  inputSearch.value = "";
}

function handleSearchHistoryClick(e) {
  console.log("History called");
  console.log("City: = " + e.target.textContent);
  search = e.target.textContent;
  fetchCoords(search);
}

renderSearchHistory();

searchBtn.addEventListener("click", handleSearchFormSubmit);
