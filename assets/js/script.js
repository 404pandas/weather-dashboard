// Global variables
var searchHistory = [];
var apiUrl = "https://api.openweathermap.org/data/3.0/onecall?";
var apiKey = "2a486f5bbf138ec48900a8c6c87fef7c";

// DOM element references
var searchInput = $("#cityName");
var weatherNow = $(".weatherNow");
var weatherFive = $(".five-day");
var historyContainer = $(".recentBtn");

// Images
const weatherIcon = data.weather[0];
let locationIcon = document.querySelector(".weather-icon")
locationIcon.innerHTML = `<img src="assets/images/icons/${icon}.png">;`

// Function to clear screen
function clearScreen(){
  $(".forecast-five").empty();
  $(".weatherNow").empty();
}

// Function to display the search history list.
function renderSearchHistory() {
    // empty the search history container
  searchHistory.remove();
    // loop through the history array creating a button for each item
  for (let i = 0; i < searchHistory.length; i++) {
    const element = searchHistory[i];
    var btnHistory = $(`"<button class="btn recentBtn"></button>"`).text(element);
      // append to the search history container
      $(".searchBtn").append(btnHistory);
  }
}

  // Function to update history in local storage then updates displayed history.
  function appendToHistory(search) {
    // push search term into search history array
  for (let i = 0; i < searchHistory.length; i++) {
    const history = searchHistory[i];
    if (history == search) {
      return;
    }
  }
  // Push search term into search history array
  searchHistory.push(search);
     // set search history array to local storage
     localStorage.setItem("cityHistory", JSON.stringify(searchHistory));

    renderSearchHistory();
  }
  
  // Function to get search history from local storage
  function initSearchHistory() {
     // get search history item from local storage
  if (localStorage.getItem("cityHistory")!==null) {
    // set search history array equal to what you got from local storage
  searchHistory= JSON.parse(localStorage.getItem("cityHistory"));
  }
    renderSearchHistory();
}

    // Function to display the CURRENT weather data fetched from OpenWeather api.
  function renderCurrentWeather(city, weather) {
    // Store response data from our fetch request in variables
      // temperature, wind speed, etc.
  var temp = weather.temp;
  var wind = weather.wind_speed;
  var humidity = weather.humidity;
  var clouds = weather.clouds;
  var date = new Date(weather.sunrise*1000)
  date = date.toLocaleDateString("en-US");
    // document.create the elements you'll want to put this information in  
    var cityDateCloudsl = $("<h3></h3>").text(city+" ("+date+") "+clouds);
    var templ = $("<div></div>").text("Temp: "+temp+"°F");
    var windl = $("<div></div>").text("Wind: "+wind+" MPH");
    var humidityl = $("<div></div>").text("Humidity: "+humidity+" %");

    // append those elements somewhere
  $(".weatherNow").append(cityDateClouds1,temp1, wind1, humidity1);

  
  }
  
  // Function to display a FORECAST card given an object (from our renderForecast function) from open weather api
  // daily forecast.
  function renderForecastCard(forecast) {
    // variables for data from api
    var temp = forecast.temp.day;
    var wind = forecast.wind_speed;
    var humidity = forecast.humidity;
    var clouds = forecast.clouds;
    var date = new Date(forecast.sunrise*1000)
    date= date.toLocaleDateString("en-US");

    var card1 = $('"<div class=".col-2 cards"></div>"').append(card1)
    $(".forecast-five").append(card1);
  
    // Create elements for a card
    var datel = $("<h3></h3>").text(date);
    var cloudsl = $("<div></div>").text(clouds);
    var templ = $("<div></div>").text("Temp: "+temp+"°F");
    var windl = $("<div></div>").text("Wind: "+wind+" MPH");
    var humidityl = $("<div></div>").text("Humidity: "+humidity+"%");

    // append
$(card1).append(date1, clouds1, temp1, wind1, humidity1);
  }
  
  // Function to display 5 day forecast.
  function renderForecast(dailyForecast) {

  // loop over dailyForecast
  
    for (var i = 1; i < dailyForecast.length; i++) {
  
      // sends the data to renderForecast function as an argument
          renderForecastCard(dailyForecast[i]);
    }
  }
  
  function renderItems(city, data) {
    renderCurrentWeather(city, data.current);
    renderForecast(data.daily);
  }
  
  // Fetches weather data for given location from the Weather Geolocation
  // endpoint; then, calls functions to display current and forecast weather data.
  function fetchWeather(location) {
     // variables of longitude, latitude, city name - coming from location
  var lat = location[0].lat;
  var lon = location[0].lon;
  var city = location[0].name;
  fetch(apiUrl+"&lat= "+lat+"&lon="+lon+"&units=imperial&exclude=hourly,minutely,alerts&appid="+apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    renderItems(city,data);
    appendToHistory(city);
  });
  
    // fetch using the api url, .then that returns the response in json, .then that calls renderItems(city, data)
  
  }
  
  function fetchCoords(search) {
    // variable for api url
  var coordUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
    // fetch using the api url, .then that returns the response in json, .then that calls appendToHistory(search), calls fetchWeather(data)
  fetch(coordUrl+search+"&limit=1&appid="+apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    if (!data[0]) {
      return;
    }
    clear();
    fetchWeather(data);
  });
  }
  
  function handleSearchFormSubmit(e) {
    // Don't continue if there is nothing in the search form
    console.log("You clicked the search button")
    if (!searchInput.value) {
      return;
    }
  
    e.preventDefault();
    var search = searchInput.value.trim();
    fetchCoords(search);
    searchInput.value = '';
  }
  
  function handleSearchHistoryClick(e) {
    // grab whatever city it is they clicked
    e.preventDefault();
    console.log("You clicked a city history button");
    var search = $(this).text().trim();
    console.log("City: " +search);
    fetchCoords(search);
  }
  
  initSearchHistory();
  // click event to run the handleSearchFormSubmit 
  $("#searchBtn").on("click", handleSearchFormSubmit);
  // click event to run the handleSearchHistoryClick
  $("#recentBtn").on("click", handleSearchHistoryClick)