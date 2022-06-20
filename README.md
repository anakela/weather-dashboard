# Homework 6: Server-Side APIs - Weather Dashboard

## Table of Contents

- [Overview](#overview)
  - [The Challenge](#the-challenge)
  - [User Story](#user-story)
  - [Acceptance Criteria](#acceptance-criteria)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [What I Learned](#what-i-learned)
  - [Continued Development](#continued-development)
  - [Useful Resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The Challenge

> Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

> Use the [OpenWeather One Call API](https://openweathermap.org/api/one-call-api) to retrieve weather data for cities. Read through the documentation for setup and usage instructions. You will use `localStorage` to store any persistent data. For more information on how to work with the OpenWeather API, refer to the [Full-Stack Blog on how to use API keys](https://coding-boot-camp.github.io/full-stack/apis/how-to-use-api-keys).

### User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

### Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
```

### Screenshot

![](./assets/images/weather-dashboard-screenshot.png)

### Links

- Solution URL: [Weather Dashboard Repository](https://github.com/anakela/weather-dashboard)
- Live Site URL: [Live Weather Dashboard Site](https://anakela.github.io/weather-dashboard/)

## My Process

### Built With

- Semantic HTML5 markup
- CSS
- [Bootstrap](https://getbootstrap.com/docs/3.3/)
- JavaScript
- [jQuery](https://jquery.com/)

### What I Learned

This challenge was tough!  There were so many moving parts to get working together.  

One of the things I enjoyed about this challenge was getting a chance to create HTML elements dynamically using JavaScript/jQuery, and including data pulled from an API while doing so.  An example of this can be found in the snippet of code below, which I used to pull UVI information and display it on `index.html`.

```JavaScript
 // Fetch data from OpenWeather.
    fetch(oneCall)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Set a variable for the UVI.
            let uvi;

            if (data.daily[0].uvi <= 2) {
                uvi = $("<p id='daily-uvi'>").text(`UV Index: ${data.daily[0].uvi}`).css("background-color", "green");
            } else if (data.daily[0].uvi > 2 && data.daily[0].uvi <= 5) {
                uvi = $("<p id='daily-uvi'>").text(`UV Index: ${data.daily[0].uvi}`).css("background-color", "yellow");
            } else {
                uvi = $("<p id='daily-uvi'>").text(`UV Index: ${data.daily[0].uvi}`).css("background-color", "red");
            }


            // Append the UVI to the weather-deets div.
            $("#weather-deets").append(uvi);
            // Run the fiveDayForecast()function.
            fiveDayForecast(data);
        })
```

This occured once more in my `getWeather()` function, as can be seen below.

```JavaScript
// Fetch data from OpenWeather.
    fetch(queryUrl)
        .then(response => response.json())
        .then(data => {
            getLatLong(data.coord.lat, data.coord.lon);
            console.log(data)

            // Create variables for getWeather API pull.
            $("#city-dis-name").text(`${data.name} (${moment().format('l')})`);
            let weatherCond = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            let temp = $("<p>").text(`Temp: ${data.main.temp} \xB0F`);
            let humid = $("<p>").text(`Humidity: ${data.main.humidity}%`);
            let windSpeed = $("<p>").text(`Wind Speed: ${data.wind.speed} MPH`);

            // Empty the todays-weather div before appending new data.
            $("#weather-deets").html('');

            // Empty forecast-divs.
            $("#forecast-divs").html('');

            // Display today's weather in the todays-weather div.
            $("#weather-deets").append(
                // cityDisName,
                weatherCond,
                temp,
                humid,
                windSpeed,
            );
        });
```

In addition to pulling API data and displaying it dynamically, I also had the opportunity to use additional Bootstrap elements such as a modal.  I enjoyed learning how to activate the modal when a user tries to search for no city.

```JavaScript
// Initially hide the modal.
let tryAgain = $(".modal");
tryAgain.hide();

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
```

Lastly, the ability to practice how to use `localStorage` was much appreciated, despite its difficulty.  I was happy to be able to give this another try and pull from `localStorage` for previously searched cities.

```JavaScript
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

    console.log(cityBank);
    // Target the cities div with cityList.
    let cityList = $("#cities");

    // Empty the excess cities if they surpass eight searches.
    $("#cities").empty();

    // Display buttons for the last eight cities searched.
    for (let i = 0; i < cityBank.length && i < 10; i++) {
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
            // Show main div.
            $("main").show();
            $("#todays-weather").show();
            $("#five-day").show();
        });
    }
}
```

### Continued Development

I would love to continue to develop the weather dashboard to include a few additional features.  These include:
- The ability for users to search for cities by hitting the "Enter" button on their keyboards.
- Updating the list of buttons more thoroughly (e.g., pushing the latest searches to the top of the list of buttons that are created.)

### Useful Resources

- [Convert Milliseconds to a Date using JavaScript](https://bobbyhadz.com/blog/javascript-convert-milliseconds-to-date)
- [EPA's UV Index Scale](https://www.epa.gov/sunsafety/uv-index-scale-0)
- [How to Change the Color of an `<hr>` Element using CSS](https://www.tutorialrepublic.com/faq/how-to-change-the-color-of-an-hr-element-using-css.php)
- [HTML Symbols: Celsius Degrees Symbol](https://www.htmlsymbols.xyz/unicode/U+2103)
- [jQuery: .css()](https://api.jquery.com/css/)
- [jQuery: .show()](https://api.jquery.com/show/)
- [MDN: Date.prototype.toLocaleDateString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString)
- [Moment.js](https://momentjs.com/)
- [OpenWeather: One Call API 1.0](https://openweathermap.org/api/one-call-api)
- [OpenWeather: Current Weather Data](https://openweathermap.org/current)
- [Stack Overflow: toLocalDateString() is not returning dd/mm/yyyy format](https://stackoverflow.com/questions/22719346/tolocaledatestring-is-not-returning-dd-mm-yyyy-format)
- [Stack Overflow: Converting milliseconds to a date (jQuery/JavaScript)](https://stackoverflow.com/questions/4673527/converting-milliseconds-to-a-date-jquery-javascript)
- [Stack Overflow: Convert a Unix timestamp to time in JavaScript](https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript)
- [Stack Overflow: What format is this date value in?](https://stackoverflow.com/questions/23576805/what-format-is-this-date-value-in)
- [W3Schools: CSS Gradients](https://www.w3schools.com/css/css3_gradients.asp)
- [W3Schools: HTML Favicon](https://www.w3schools.com/html/html_favicon.asp)

## Author

- LinkedIn - [Angela Soto](https://www.linkedin.com/in/anakela/)
- GitHub - [@anakela](https://github.com/anakela)

## Acknowledgments

- Fellow Bootcampers:
  - Nolan Spence
  - Nifer Kilakila
  - Ivy Chang
  - Asha Chakre
- TAs:
  - Scott Nelson
  - Matthew Kaus
  - Luigi Campbell
- Bobbi Tarkany (Tutor)
