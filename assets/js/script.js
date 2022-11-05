// Global variables
var cityState = "";
const apiKey = "2a486f5bbf138ec48900a8c6c87fef7c"; // search history as an empty array
var search = "";
var lat;
var lon;
// Weather API endpoint
var onecallUrl =
  "https://api.openweathermap.org/data/3.0/onecall?q=" +
  cityState +
  "&units=imperial&appid=" +
  apiKey;

// DOM element references
// search form
const buttonSearch = document.getElementById("searchBtn");
// search input
const inputSearch = document.getElementById("inputBox");
// history button
const buttonRecent = document.getElementById("recentBtn");
// container/section for today's weather
const currentContainer = document.getElementById("currentConditions");
// container/section for the forecast
const forecastContainer = document.getElementById("forecast");
// search history container
const historyContainer = document.getElementById("historyContainer");

// Function to display the search history list.
function renderSearchHistory() {
  // empty the search history container
  // loop through the history array creating a button for each item
  // append to the search history container
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  // push search term into search history array

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
function renderCurrentWeather(cityState, weather) {
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

function renderItems(cityState, data) {
  renderCurrentWeather(cityState, data.list[0]);
  renderForecast(data.list);
}

// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  // varialbles of longitude, latitude, cityState name - coming from location
  // api url
  // fetch, using the api url, .then that returns the response as json, .then that calls renderItems(cityState, data)
}

function fetchCoords(search) {
  var cityState = search;
  var coordsUrl =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    cityState +
    ",US&limit=5&appid=" +
    apiKey;

  fetch(coordsUrl).then(function (response) {
    console.log(response);
    console.log(response.statusText);
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        if (data.length === 0) {
          return;
        }
        var lat = data[0].lat;
        var lon = data[0].lon;
        console.log("latitude: " + lat + "\nlongitude: " + lon);

        appendToHistory(search);
        fetchWeather(lat, lon, cityState);
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
  var search = inputSearch.value.trim();
  fetchCoords(search);
  inputSearch.value = "";
}

function handleSearchHistoryClick(e) {
  console.log("History called");
  console.log("cityState: = " + e.target.textContent);
  var search = e.target.textContent;

  fetchCoords(search);
}

initSearchHistory();
buttonSearch.addEventListener("click", handleSearchFormSubmit);
buttonRecent.addEventListener("click", handleSearchHistoryClick);
