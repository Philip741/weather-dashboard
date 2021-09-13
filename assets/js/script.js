
var now = dayjs();

var searchButton = document.getElementById("search-button");
var appId = "b3f1aa24ac8904093849c6e0bd81b58f";
var cityId = 0;
const imageUrl = 'https://openweathermap.org';

console.log(now.format('MM/DD/YYYY'));
searchButton.addEventListener('click', function () {
    cityId++;
    const city = document.getElementById("city-search").value;
    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${appId}`
    let cityNameEl = document.getElementById("city-name");
    let todayDate = now.format('MM/DD/YYYY');
    console.log(city);
    cityNameEl.textContent = city.toUpperCase() + "(" + todayDate + ")";
    getCurrWeather(currentWeather);
    saveCity(cityId,city);
} )

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
        console.log('green');
    }
    else if (uvIndex >= 3 && uvIndex <=5) {
        console.log('yellow');
    }
    else if (uvIndex === 6 || uvIndex === 7) {
        console.log('orange');
    }
    else if (uvIndex >=8 && uvIndex < 11) {
        console.log('red');
    }
    else if (uvIndex > 10) {
        console.log('purple')
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

function populateFiveDay (url) {
 console.log(url)
}

function displayHide () {
    
} 

function saveCity (cityId,cityName) {
    // save city name to local storage and generate button 
    localStorage.setItem(cityId,cityName);
    console.log(localStorage);
}

function clearCities () {
    // clear cities from local storage
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