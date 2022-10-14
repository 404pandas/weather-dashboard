// Global variables
var searchHistory = [];
var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?";
var coordUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
var apiKey = "b917dd3be7f85cdcbd69de2a255eb995";

// DOM element references
var searchInput = $("#cityName");
var weatherNow = $(".weatherNow");
var weatherFive = $(".five-day");
var searchContainer = $(".searchContainer");
let cityName = document.getElementById("cityName").value;
let searchBtn = document.getElementById("searchBtn");

// Function to clear screen
function clearScreen() {
  $(".forecast-five").empty();
  $(".weatherNow").empty();
}

// Function to display the search history list.
function renderSearchHistory() {
  $(".recentBtn").remove();
  for (let i = 0; i < searchHistory.length; i++) {
    const element = searchHistory[i];
    var btn1 = $("#recentBtn").text(element);
    $(".searchAside").append(btn1);
  }
}

// Function to update history in local storage then updates displayed history.
function appendToHistory(search) {
  for (let i = 0; i < searchHistory.length; i++) {
    const history = searchHistory[i];
    if (history == search) {
      return;
    }
  }
  searchHistory.push(search);
  localStorage.setItem("cities", JSON.stringify(searchHistory));
  renderSearchHistory();
}
  
// Function to get search history from local storage
function initSearchHistory() {
  if (localStorage.getItem("cities")!==null) {
    searchHistory= JSON.parse(localStorage.getItem("cities"));
  }
  else {
    localStorage.setItem("cities", JSON.stringify(searchHistory))
  }
  renderSearchHistory();
}

// Function to display the CURRENT weather data fetched from OpenWeather api.
function renderCurrentWeather(cityGeo, weather) {
  var temp = weather.temp;
  var wind = weather.wind_speed;
  var humidity = weather.humidity;
  var clouds = weather.clouds;
  var date = new Date(weather.sunrise*1000)
  date = date.toLocaleDateString("en-US");
  var cityDateCloudsl = $("<h2></h2>").text(cityGeo+" ("+date+") "+clouds);
  var templ = $("<div></div>").text("Temp: "+temp+"°F");
  var windl = $("<div></div>").text("Wind: "+wind+" MPH");
  var humidityl = $("<div></div>").text("Humidity: "+humidity+" %");
  $(".weatherNow").append(cityDateClouds1, temp1, wind1, humidity1);
}
  
// Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
// daily forecast.
function renderForecastCard(forecast) {
  var temp = forecast.temp.day;
  var wind = forecast.wind_speed;
  var humidity = forecast.humidity;
  var clouds = forecast.clouds;
  var date = new Date(forecast.sunrise*1000)
  date= date.toLocaleDateString("en-US");
  var card1 = $('"<div class="col-2 cards"></div>"');
  $(".forecast-five").append(card1);
  var datel = $("<h3></h3>").text(date);
  var cloudsl = $("<div></div>").text(clouds);
  var templ = $("<div></div>").text("Temp: "+temp+"°F");
  var windl = $("<div></div>").text("Wind: "+wind+" MPH");
  var humidityl = $("<div></div>").text("Humidity: "+humidity+"%");
  $(card1).append(date1, clouds1, temp1, wind1, humidity1);
}
  
// Function to display 5 day forecast.
function renderForecast(dailyForecast) {
  for (var i = 1; i < i < 6; i++) {
    renderForecastCard(dailyForecast[i]);
  }
}
  
// Function to
function renderItems(cityGeo, data) {
  renderCurrentWeather(cityGeo, data.current);
  renderForecast(data.daily);
}
  
// Fetches weather data for given location from the Weather Geolocation
// endpoint; then, calls functions to display current and forecast weather data.
function fetchWeather(location) {
  const lat = location[0].lat;
  const lon = location[0].lon;
  const cityGeo = location[0].name;
  fetch(apiUrl+"lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly,minutely,alerts&appid="+apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    renderItems(cityGeo,data);
    appendToHistory(cityGeo);
  });
}
  
// Function to
function fetchCoords(cityName) {
  fetch(coordUrl+cityName+"&limit=1&appid="+apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (!data[0]) {
      return;
    }
    clearScreen();
    fetchWeather(data);
  });
}

// Function to
function handleSearchFormSubmit(e) {
  console.log("You clicked the search button")
  if (!searchInput.val()) {
    return;
  }
  e.preventDefault();
  var search = searchInput.val().trim();
  fetchCoords(search);
  searchInput.val("");
}
  
function handleSearchHistoryClick(e) {
  e.preventDefault();
  console.log("You clicked a city history button");
  var search = $(this).text().trim();
  console.log("City: " +search);
  fetchCoords(search);
}
  
initSearchHistory(); 
$("#searchBtn").on("click", handleSearchFormSubmit);
$("#recentBtn").on("click", handleSearchHistoryClick);