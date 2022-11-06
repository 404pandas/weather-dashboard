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
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array
  localStorage.setItem(search, search);
  // set search history array to local storage
  renderSearchHistory();
}

// Function to get search history from local storage
function initSearchHistory() {
  // get search history item from local storage

  // set search history array equal to what you got from local storage
  renderSearchHistory();
}

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(city, weather) {
  // Store response data from our fetch request in variables
  // temperature, wind speed, etc.
  // document.create the elements you'll want to put this information in
  // append those elements somewhere
  // give them their appropriate content
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
        console.log(data);
        // Creates variables from lat and long values
        var lat = data[0].lat;
        var lon = data[0].lon;
        search = data[0].name;
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

  console.log("Search = " + inputSearch.value);
  search = inputSearch.value.trim();
  fetchCoords(search);
  inputSearch.value = "";
}

function handleSearchHistoryClick(e) {
  console.log("History called");
  console.log("City: = " + e.target.textContent);
  search = e.target.textContent;
  fetchCoords(search);
}

initSearchHistory();
buttonSearch.addEventListener("click", handleSearchFormSubmit);
