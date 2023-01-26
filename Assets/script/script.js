let cityArray = JSON.parse(localStorage.getItem("cities")) || [];

//gets users current location
$.get("https://ipinfo.io", function(response) {
    console.log(response.city, response.country);
    var currentCity = response.city
    city = currentCity;
    fetchWeather(city)
}, "jsonp");

// Event listener function that gets users current browser location city
$("#locationBtn").on("click", function(){
    console.log("clcick");
    $.get("https://ipinfo.io", function(response) {
    var currentCity = response.city
    city = currentCity;
    fetchWeather(city)
}, "jsonp");
});

// Event listener function for search button.
$("#searchBtn").on('click',function(){
    let cityInput = $("#cityInput");
    city = cityInput.val().trim();
    // Turns field red if empty field
    if (city === "") {
        cityInput.attr("class", "border border-3 border-danger");
        cityInput.attr("placeholder", "*City cannot be empty*");
        return;
    // Turns field green if city entered
    } else {
        cityInput.attr("placeholder", "Enter next city");
        cityInput.attr("class", "border border-3 border-success-subtle");
        cityArray.unshift(city);
        localStorage.setItem("cities", JSON.stringify(cityArray));
        displayHistory();
        cityInput.val("")
        };
    fetchWeather(city)
});

//  Clears the the search history list
$("#clearBtn").on("click", function(){
    localStorage.clear();
    cityArray = [];
    $(".history").empty();
});

// displays the weather from the search history list
$(".history").on('click',function(event) {
    event.preventDefault();
    console.log($(".history").value = event.target.textContent);
    fetchWeather($(".history").value = event.target.textContent)

});

// displays the searched city into search History
function displayHistory(){
    // filters cityArray to only display the most recent searches
   let historyArray = cityArray.slice(0,6);
   console.log("updated aray is " + historyArray);
    $(".history").empty();
    for (let i = 0; i < historyArray.length; i++) {
            let listedCity = $("<button>")
            listedCity.text(historyArray[i]);
            listedCity.addClass("m-1 p-2 btn btn-outline-dark rounded-0 listed");
            $(".history").append(listedCity)
        }
        
    };

 // retireves current day weather data form open weather API
function fetchWeather(city) {
    // Creates API call Key for inputed City 
    const APIKey = "851f848d274c31bfc439d660f647c15c";
    let currentAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid=" + APIKey;
fetch(currentAPI)
    .then(function(response){
    return response.json()})
    .then(function(data){
    // console.log(data);
    displayWeather(data);
    fetchForecast(data.name)
    })
}

// creates and appends current day forecast to DOM
function displayWeather(data){
    $(".currentWeather").empty();
    let cityEl = document.createElement("h3")
    let currentDay = document.createElement("h5")
    let currentTemp = document.createElement("p")
    let currentWind = document.createElement("p")
    let currentHumidity = document.createElement("p")
    let currentIcon = document.createElement("img")


    cityEl.textContent = data.name
    currentDay.textContent = dayjs.unix(data.dt).format("ddd, MMM D, YYYY")
    currentTemp.textContent = "Temperature: " + data.main.temp + " F"
    currentWind.textContent = "Wind Speed: " + data.wind.speed + " mph"
    currentHumidity.textContent = "Humidity: " + data.main.humidity + " %"
    var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
    currentIcon.setAttribute("src", iconUrl)
    $(".currentWeather").append(cityEl, currentDay, currentIcon, currentTemp, currentWind, currentHumidity);
}

 // Retrieves 5 day weather forecast data form open weather API
function fetchForecast(city) {
// Creates API call Key for inputed City 
    const APIKey = "851f848d274c31bfc439d660f647c15c";
    var apiUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city +"&units=imperial&appid=" + APIKey;
fetch(apiUrlForecast)
    .then(function(response){
    return response.json()})
    .then(function(data){
    // console.log(data);
    displayForecast(data);
    })
};

// Creates and appends 5 day weather forecas to DOM
function displayForecast(data){
    $(".forecast").empty();
    
for (let i = 0; i < data.list.length; i += 8){
    let forecastDay = $("<h5>");
    let forecastTemp = $("<p>");
    let forecastWind = $("<p>");
    let forecastHumidity = $("<p>");
    let forecastIcon = $("<img>");
    let forecastContainer = $("<div>");

    forecastDay.text(dayjs.unix(data.list[i].dt).format("ddd, MMM D, YYYY"));
    forecastTemp.text("Temperature: " + data.list[i].main.temp + " F");
    forecastWind.text("Wind Speed: " + data.list[i].wind.speed + " mph")
    forecastHumidity.text("Humidity: " + data.list[i].main.humidity + " %")
    let iconUrl = "https://openweathermap.org/img/wn/" + data.list[i].weather[0].icon + "@2x.png";
    forecastIcon.attr("src", iconUrl)

    forecastContainer.addClass("col-lg-2 col-md-5 col-sm-10 m-1 p-3 bg-light bg-opacity-25");
    forecastContainer.append(forecastDay,forecastIcon, forecastTemp, forecastWind, forecastHumidity);
    $(".forecast").append(forecastContainer);
}
}
displayHistory();