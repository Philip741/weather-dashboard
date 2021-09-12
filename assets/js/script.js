
const city = "New York"
const currentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b3f1aa24ac8904093849c6e0bd81b58f`
const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=b3f1aa24ac8904093849c6e0bd81b58f`
var now = dayjs();

var searchButton = document.getElementById("search-button");


console.log(now.format('MM/DD/YYYY'));
searchButton.addEventListener('click', function () {
    let citySearch = document.getElementById("city-search").value;
    let cityNameEl = document.getElementById("city-name");
    let todayDate = now.format('MM/DD/YYYY');
    console.log(citySearch);
    cityNameEl.textContent = citySearch.toUpperCase() + "(" + todayDate + ")";

} )

async function getapi (url) {
    const response = await fetch(url);

    var data = await response.json();
    console.log(data);
    console.log(data.main.temp);
}

getapi(currentWeather);