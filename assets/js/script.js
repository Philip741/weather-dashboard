
var now = dayjs();

var searchButton = document.getElementById("search-button");
var appId = "b3f1aa24ac8904093849c6e0bd81b58f";


console.log(now.format('MM/DD/YYYY'));
searchButton.addEventListener('click', function () {
    const city = document.getElementById("city-search").value;
    const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${appId}`
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${appId}`
    let cityNameEl = document.getElementById("city-name");
    let todayDate = now.format('MM/DD/YYYY');
    console.log(city);
    cityNameEl.textContent = city.toUpperCase() + "(" + todayDate + ")";
    getCurrWeather(currentWeather);
    getFiveDay(forecast);
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

    getUvIndex(lat,lon,appId);
    populateWeather(temp,wind,humidity,);
}

async function getFiveDay (url) {
    const response = await fetch(url);

    let data = await response.json();
    console.log(data.list[0]);
}

async function getUvIndex(lat,lon,appId) {
    const uvIndexUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${appId}`
    let uvIndexEl = document.getElementById("current-uvindex"); 
    const response = await fetch(uvIndexUrl);

    let data = await response.json();
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

}
