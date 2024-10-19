const weather = {
  apiKey: "5f2e3cf9e84f1d58cd2fdc6761b878fa",
  unit: "C", // Default unit
  temperatureThreshold: null, // Alert threshold
  intervalId: null, // Interval ID for refreshing weather data

  fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          alert("No weather found.");
          throw new Error("No weather found.");
        }
        return response.json();
      })
      .then((data) => {
        this.displayWeather(data);
        this.checkAlerts(data.list[0].main.temp); // Check alerts for the current temperature
      })
      .catch((error) => console.error(error));
  },

  displayWeather(data) {
    const city = data.city.name;
    const currentWeather = data.list[0];
    const { icon, description } = currentWeather.weather[0];
    const { temp, feels_like, humidity, temp_min, temp_max } = currentWeather.main;
    const windSpeed = currentWeather.wind.speed;
    const datetime = currentWeather.dt_txt;

    // Update UI
    this.updateWeatherUI({ city, icon, description, datetime, temp, feels_like, temp_min, temp_max, humidity, windSpeed });

    // Display 5-day forecast
    this.displayForecast(data);
  },

  updateWeatherUI({ city, icon, description, datetime, temp, feels_like, temp_min, temp_max, humidity, windSpeed }) {
    const tempFormatted = (t) => this.convertTemp(t, this.unit);
    document.querySelector(".city").innerText = `Weather in ${city}`;
    document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
    document.querySelector(".description").innerText = description;
    document.querySelector(".dt").innerText = `Last updated: ${datetime}`;
    
    // Temperature display
    document.querySelector(".temp").innerText = `${tempFormatted(temp)} °${this.unit}`;
    document.querySelector(".temp-feels-like").innerText = `Feels like: ${tempFormatted(feels_like)} °${this.unit}`;
    document.querySelector(".temp-avg").innerText = `Avg Temp: ${tempFormatted((temp_min + temp_max) / 2)} °${this.unit}`;
    document.querySelector(".temp-min").innerText = `Min Temp: ${tempFormatted(temp_min)} °${this.unit}`;
    document.querySelector(".temp-max").innerText = `Max Temp: ${tempFormatted(temp_max)} °${this.unit}`;
    
    document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
    document.querySelector(".wind").innerText = `Wind speed: ${windSpeed} km/h`;
    document.querySelector(".weather").classList.remove("loading");
  },

  displayForecast(data) {
    for (let i = 1; i <= 5; i++) {
      const forecast = data.list[i * 6];
      document.querySelector(`.icon${i}`).src = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
      document.querySelector(`.temp${i}`).innerText = `${this.convertTemp(forecast.main.temp, this.unit)} °${this.unit}`;
      document.querySelector(`.dt${i}`).innerText = forecast.dt_txt;
    }
  },

  convertTemp(temp, unit) {
    switch (unit) {
      case "F":
        return ((temp * 9) / 5 + 32).toFixed(2);
      case "K":
        return (temp + 273.15).toFixed(2);
      default:
        return temp.toFixed(2); // Celsius
    }
  },

  checkAlerts(currentTemp) {
    const tempInCelsius = this.convertToCelsius(currentTemp);
    if (this.temperatureThreshold !== null && tempInCelsius > this.temperatureThreshold) {
      alert(`Alert: Temperature exceeds ${this.temperatureThreshold}°C!`);
    }
  },

  convertToCelsius(temp) {
    if (this.unit === "F") {
      return (temp - 32) * 5 / 9;
    } else if (this.unit === "K") {
      return temp - 273.15;
    } else {
      return temp;
    }
  },

  setAlerts() {
    const tempInput = document.getElementById('temp-threshold').value;
    this.temperatureThreshold = tempInput ? parseFloat(tempInput) : null;
    alert('Alerts have been set!');
  },

  search() {
    const city = document.querySelector(".search-bar").value;
    this.stopInterval();
    this.fetchWeather(city);
    this.startInterval(city);
  },

  startInterval(city) {
    this.intervalId = setInterval(() => this.fetchWeather(city), 300000); // Every 5 minutes
  },

  stopInterval() {
    clearInterval(this.intervalId);
  }
};

// Event listeners for search and unit change
document.querySelector(".search button").addEventListener("click", () => weather.search());
document.querySelector(".search-bar").addEventListener("keyup", (event) => {
  if (event.key === "Enter") weather.search();
});
document.querySelector("select").addEventListener("change", (evt) => {
  weather.unit = evt.target.value;
  const city = document.querySelector(".city").innerText.split("Weather in ")[1] || "Bangalore";
  weather.fetchWeather(city); // Re-fetch with the new unit
});
document.getElementById('set-alerts').addEventListener('click', () => weather.setAlerts());

// Fetch weather for a default city on page load
window.onload = function () {
  const city = "Bangalore"; // Default city
  weather.fetchWeather(city); // Fetch weather for Bangalore
  
  // Set an interval to refresh weather data every 5 minutes
  weather.startInterval(city);
};
