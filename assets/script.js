const apiKey = '8a62076cbde15f9ae6605e30d03e4917';
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');

// Function to fetch weather data
async function getWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching current weather:', error);
    }
}

// Function to display current weather
function displayCurrentWeather(data) {
    const { name, main, weather, wind } = data;
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

    const currentWeatherInfo = document.createElement('div');
    currentWeatherInfo.classList.add('weather-info');
    currentWeatherInfo.innerHTML = `
        <h2>${name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;

    currentWeather.innerHTML = '';
    currentWeather.appendChild(currentWeatherInfo);
}

// Function to fetch 5-day forecast data
async function getForecastData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Function to display 5-day forecast
function displayForecast(data) {
    const forecastList = data.list;

    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = '';

    for (let i = 0; i < forecastList.length; i += 8) {
        const { dt_txt, main, weather, wind } = forecastList[i];
        const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;

        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        forecastDay.innerHTML = `
            <p>Date: ${new Date(dt_txt).toLocaleDateString()}</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
        `;

        forecastContainer.appendChild(forecastDay);
    }
}

// Event listener for form submission
cityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city) {
        const currentWeatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);

        // Display current weather and forecast
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);

        // Add the city to search history
        const searchItem = document.createElement('div');
        searchItem.textContent = city;
        searchHistory.appendChild(searchItem);

        // Clear the input field
        cityInput.value = '';
    }
});

// Event listener for clicking on a city in the search history
searchHistory.addEventListener('click', async (e) => {
    if (e.target.tagName === 'DIV') {
        const city = e.target.textContent;
        const currentWeatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);

        // Display current weather and forecast for the selected city
        displayCurrentWeather(currentWeatherData);
        displayForecast(forecastData);
    }
});
