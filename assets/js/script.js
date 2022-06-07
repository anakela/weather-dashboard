// Initially hide the modal.
let tryAgain = $(".modal");
tryAgain.hide();

// OpenWeather API key variable
let apiKey = "b25df5e9996a5430f0c6f80adaf93b37";

// Get the latitude and longitude of the city searched.
function getLatLong(lat, long) {
    // One Call for getting future forecasts.
    let oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&exclude=minutely,hourly,alerts&units=imperial&appid=" + apiKey;

    // Fetch data from OpenWeather.
    fetch(oneCall)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // let cityDisplayName = $("<h3>").text(`${data.name}`);
            // $("#todays-weather").append(cityDisplayName);
        })
}

// On clicking the search button, pull the city input value and run the getWeather() function.
$("#search-btn").on("click", function () {
    // User input values.
    let userInput = $("#city-input").val().trim();
    if (userInput === '') {
        // Show try again modal.
        tryAgain.show();
        // Hide try again modal when OK button is clicked.
        $("#ok-btn").on("click", function () {
            tryAgain.hide();
        });
    } else {
        // Run the storeCities() function.
        storeCities(userInput);       
        // Run the getWeather() function.
        getWeather(userInput);
    }
    // Clear input field.
    $("#city-input").val("");
    console.log(userInput);
});

// Get today's current weather for the city searched.
function getWeather(city) {
    // URL for city search queries.
    let queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    // Fetch data from OpenWeather.
    fetch(queryUrl)
        .then(response => response.json())
        .then(data => {
            getLatLong(data.coord.lat, data.coord.lon);
            console.log(data)
        });
}

// Store the city input for users in localStorage.
function storeCities(cityName) {
    let cityBank = JSON.parse(localStorage.getItem("cityBank"));

    if (cityBank === null) {
        cityBank = [cityName];
    } else {
        for (let i = 0; i < cityBank.length; i++) {
            if (cityName === cityBank[i]) {
                return;
            }
            
        }
        // Add the most recent search to the top.
        cityBank.splice(0, 0, cityName);
    }

    localStorage.setItem("cityBank", JSON.stringify(cityBank));
    // Call function to display cities as buttons.
    displayCities();
};

// Display the cities that are in localStorage.
function displayCities() {
    let cityBank = JSON.parse(localStorage.getItem("cityBank"));
    // If the cityBank entry is null, don't add it to localStorage.
    if (cityBank === null) {
        return;
    }

    // Target the cities div with cityList.
    let cityList = $("#cities");

    // Empty the excess cities if they surpass eight searches.
    $("#cities").empty();

    // Display buttons for the last eight cities searched.
    for (let i = 0; i < cityBank.length && i < 8; i++) {
        // Create a new button when a city is searched.
        let cityBtn = $("<button>")
            .addClass("btn btn-primary col-11")
            .attr("id", "city-search" + i)
            .text(cityBank[i]);

        // Append the next city as a button.
        $("#cities").append(cityBtn);

        // When the dynamically created city buttons are clicked, display their search information.
        cityBtn.on("click", function () {
            // getLatLong(cityBtn.text());
            getWeather(cityBtn.text());
        });
    }

    // Create variables for the items to append to the todays-weather div.
    let cityDisName = $("<h3>").text(`${data.name}`);
    let todaysDate = $("<p>").text(new Date(data.coord.dt).format("MM/DD/YYYY"));
    let weatherCond = `http://openweathermap.org/img/wn/${data.daily.weather[0].icon}@2x.png`;
    let temp = $("<p>").text(`Temperature: ${data.main.temp} \xB0F`);
    let humid = $("<p>").text(`Humidity: ${data.main.humidity}%`);
    let windSpeed = $("<p>").text(`Wind Speed: ${data.wind.speed} MPH`);
    let uvi = $("<p>").text(`UV Index: ${data.daily[0].uvi}`);

    // Display today's weather in the todays-weather div.
    $("#todays-weather").append(
        cityDisName,
        todaysDate,
        weatherCond,
        temp,
        humid,
        windSpeed,
        uvi
    );
}

// Display today's weather in the todays-weather div.
// $("#todays-weather").get(function(data) {
//     $("#todays-weather")
//         .append("City: " + data.name)
//         .append("Date: " + data.coord.dt)
//         .append("Weather Conditions: " + data.weather[0].icon)
//         .append("Temperature: " + data.main.temp)
//         .append("Humidity: " data.main.humidity)
//         .append("Wind Speed: " + data.wind.speed)
//         .append("UV Index: " + data.daily[0].uvi);
// });

// $("#todays-weather")
//     .append("City: " + data.name)
//     .append("Date: " + data.coord.dt)
//     .append("Weather Conditions: " + data.weather[0].icon)
//     .append("Temperature: " + data.main.temp)
//     .append("Humidity: " + data.main.humidity)
//     .append("Wind Speed: " + data.wind.speed)
//     .append("UV Index: " + data.daily[0].uvi);

    // WHEN I view the UV index
    // THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
    // WHEN I view future weather conditions for that city
    // THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity

// Display the next five days of forecasts in the 5-day forecast div.


// Loop through future forecasts and end them at five.
// // for loop (stop at 5)
// for (let i = 0; i < 5; i++) {
//     const element = array[i];
    
// }

// Run displayCities() on page load.
displayCities();