
var now = dayjs();

var searchButton = document.getElementById("search-button");
var clearButton = document.getElementById("cities-clear");
var appId = "b3f1aa24ac8904093849c6e0bd81b58f";
const imageUrl = 'https://openweathermap.org';
const helpTitle = document.getElementById("help-title");

document.getElementById("main-interface").style.visibility = "hidden";

// Add the main search button event listener
searchButton.addEventListener('click', function (e) {
    console.log(e.target.textContent);
    searchCity('input')
    document.getElementById("main-interface").style.visibility = "visible";
    helpTitle.remove();
});

clearButton.addEventListener('click', () => {localStorage.clear(); window.location.reload(true)});

loadSavedCity();


function searchCity(element,buttonText) {
    let todayDate = now.format('MM/DD/YYYY');

    if (element === "button") {
        const city = buttonText;
        console.log(city);
        let cityNameEl = document.getElementById("city-name");
        cityNameEl.textContent = city.toUpperCase() + "(" + todayDate + ")";
        const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`
        getCurrWeather(currentWeather);
    }
    else if (element === "input") {
        const city = document.getElementById("city-search").value;
        const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`
        let cityNameEl = document.getElementById("city-name");
        cityNameEl.textContent = city.toUpperCase() + "(" + todayDate + ")";
        getCurrWeather(currentWeather);
        saveCity(city);
        document.getElementById("main-interface").style.visibility = "visible";
    }
}

async function getCurrWeather (url) {
    const response = await fetch(url);

    let data = await response.json();
    console.log(data);
    console.log(data.main.temp);
    let temp = data.main.temp;
    let humidity = data.main.humidity;
    let wind = data.wind.speed;
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let icon = data.weather[0].icon;
    let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${appId}`

    getUvIndex(lat,lon,appId);
    displayIcons(imageUrl,icon,"current-icon","large");   
    populateWeather(temp,wind,humidity);
    getFiveDay(forecastUrl);
}

async function getFiveDay (url) {
    const response = await fetch(url);

    let data = await response.json();
    //console.log(data.list[0]);
    // starts at 0 for html elements and array
    for (let i=1; i < 6; i++) {
        console.log(data.daily[i]);
        let tempEl = document.getElementById(`temp${i}`);
        let windEl = document.getElementById(`wind${i}`);
        let humidityEl = document.getElementById(`humidity${i}`);
        let dateEl = document.getElementById(`day${i}`);
        let timeStamp = data.daily[i].dt;
        let icon = data.daily[i].weather[0].icon;
        dateEl.textContent = dayjs.unix(timeStamp).format('ddd');
        displayIcons(imageUrl,icon,`icon${i}`,"large");   
        tempEl.textContent = "Temp: " + data.daily[i].temp.day; 
        windEl.textContent = `Wind: ${data.daily[i].wind_speed}`; 
        humidityEl.textContent = `Humidity: ${data.daily[i].humidity}`; 
    }
}

async function getUvIndex(lat,lon,appId) {
    const uvIndexUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${appId}`
    let uvIndexEl = document.getElementById("current-uvindex"); 
    const response = await fetch(uvIndexUrl);

    let data = await response.json();
    console.log(data);
    uvIndex = parseInt(data.current.uvi);
    uvIndexEl.textContent = "UV index: " + uvIndex;
    if (uvIndex <= 2){
        uvIndexEl.setAttribute("class", "bg-green-300 rounded-md px-5");
    }
    else if (uvIndex >= 3 && uvIndex <=5) {
        uvIndexEl.setAttribute("class", "bg-yellow-300 rounded-md px-5");
    }
    else if (uvIndex === 6 || uvIndex === 7) {
        uvIndexEl.setAttribute("class", "bg-orange-300 rounded-md px-5");
    }
    else if (uvIndex >=8 && uvIndex < 11) {
        uvIndexEl.setAttribute("class", "bg-red-300 rounded-md px-5");
    }
    else if (uvIndex > 10) {
        uvIndexEl.setAttribute("class", "bg-purple-300 rounded-md px-5");
    }
}

function populateWeather(temp,wind,humidity) {
     let tempEl = document.getElementById("current-temp"); 
     let windEl = document.getElementById("current-wind"); 
     let humidityEl = document.getElementById("current-humidity"); 

     tempEl.textContent = "temp: " + temp;
     windEl.textContent = "wind: " + wind;
     humidityEl.textContent = "humidity: " + humidity;
}


function displayHide () {
    
} 

function loadSavedCity() {
    //load all cities if any and create buttons
    let cityCheck = localStorage.getItem('cities');
    console.log(cityCheck);
    if (!cityCheck) {return};
    // Add event listener to container element
    cityCheck = JSON.parse(cityCheck);
    let cityContainer = document.getElementById("city-container");
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    console.log(storedCities);
    let cityButtonEl = document.getElementById('saved-cities');
    for (let i=0; i<cityCheck.length;i++) {
        let cityButton = document.createElement('button');
        cityButton.setAttribute("class", "w-full mb-2 inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg");
        cityButton.textContent = cityCheck[i];
        cityButtonEl.appendChild(cityButton);
        cityButton.addEventListener('click', function (e){
           let buttonText = e.target.textContent;
           searchCity('button', buttonText);
           document.getElementById("main-interface").style.visibility = "visible";
           helpTitle.remove();
        });
    }
    //localStorage.setItem(cityId,cityName);
}

function saveCity (cityName) {
    // save city name to local storage and generate button 
    // check for cities key in local storage
    let cityCheck = localStorage.getItem('cities')
    if (cityCheck) {
        console.log(cityCheck);
        let storedCities = JSON.parse(localStorage.getItem("cities"));
        storedCities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(storedCities));
    }
    else {
        let cities = [];
        cities.push(cityName);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    let cityContainer = document.getElementById('saved-cities');
    //localStorage.setItem(cityId,cityName);
    let cityButton = document.createElement('button');
    cityButton.setAttribute("class", "w-full mb-2 inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg");
    cityButton.textContent = cityName;
    cityContainer.appendChild(cityButton);
    cityButton.addEventListener('click', function (e){
       let buttonText = e.target.textContent;
        searchCity('button', buttonText);
    })
}

function displayIcons(url, iconId, icon, size) {
  let popIcon = document.getElementById(`${icon}`);
  //console.log(popIcon);
  if (size === "small") {
  popIcon.src = url + `/img/wn/${iconId}.png`
  }
  else if (size === "large") {
  popIcon.src = url + `/img/wn/${iconId}@2x.png`
  }
}