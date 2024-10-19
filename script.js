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
    this.displayForecast2(data);
    
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
    document.querySelector(".temp-threshold2").innerText = `Select Temperature Threshold °${this.unit} `;
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
    if (this.temperatureThreshold !== null) {
        // Convert the current temperature to Celsius before comparison
        const tempInCelsius = this.convertToCelsius(currentTemp);
        
        // Check the alert using the stored Celsius value
        if (tempInCelsius > this.temperatureThreshold) {
            // Convert the threshold back to the current unit for display
            const alertTemp = this.convertTemp(this.temperatureThreshold, this.unit);
            alert(`Alert: Temperature exceeds ${alertTemp}°${this.unit}!`);
        }
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
    if (tempInput) {
        // Convert the input value based on the current unit to Celsius
        this.temperatureThreshold = this.convertToCelsius(parseFloat(tempInput));
        alert(`Alerts have been set to ${tempInput}°${this.unit}!`);
    } else {
        this.temperatureThreshold = null;
        alert('Alerts have been disabled!');
    }
},
displayForecast2(data) {
  const hourlyData = data.list; // Assume 'data.list' contains hourly weather data (3-hour intervals)
  const labels = [];
  const avgTemps = [];

  // Loop through the hourly data for today (assuming the data is sorted by time)
  hourlyData.forEach(entry => {
    const date = new Date(entry.dt * 1000); // Convert from UNIX timestamp (multiply by 1000 for JavaScript)
    const hours = date.getHours();
    const currentDay = new Date().getDate(); // Get the current day

    if (date.getDate() === currentDay) {
      labels.push(`${hours}:00`); // Add the hour to labels (in 3-hour intervals)
      avgTemps.push(entry.main.temp); // Push temperature into the array
    }
  });
  
  // Call the function to create the hourly summary chart with today's 3-hour interval data
  this.createHourlySummaryChart(labels, avgTemps);
},
createHourlySummaryChart(labels, avgTemps) {
  const ctx = document.getElementById('dailySummaryChart').getContext('2d');

  // Destroy previous chart if it exists to avoid overlap
  if (this.dailySummaryChart) {
    this.dailySummaryChart.destroy();
  }

  // Create a new bar chart with hourly temperatures
  this.dailySummaryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels, // Hourly labels (e.g., 0:00, 1:00, ...)
      datasets: [{
        label: 'Hourly Temperature for Today',
        data: avgTemps, // Temperature data for each hour
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {      
        legend: {
        display: false // Hide the legend
      },

        title: {
          display: true,
          text: 'Temperature Over Time'
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time (Hour)'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        }
      }
    }
  });
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
// Handle unit change to correctly convert and display threshold
document.querySelector("select").addEventListener("change", (evt) => {
  const previousUnit = weather.unit;
  weather.unit = evt.target.value;
  
  // Convert the stored threshold to the new unit for display
  if (weather.temperatureThreshold !== null) {
      // Display the threshold in the new unit, but keep storing it in Celsius
      const thresholdInNewUnit = weather.convertTemp(weather.temperatureThreshold, weather.unit);
      weather.temperatureThreshold = parseFloat(weather.convertToCelsius(thresholdInNewUnit));
  }

  const city = document.querySelector(".city").innerText.split("Weather in ")[1] || "Bangalore";
  weather.fetchWeather(city); // Re-fetch with the new unit
});
document.getElementById('set-alerts').addEventListener('click', () => weather.setAlerts());

// Fetch weather for a default city on page load
window.onload = function () {
  const city = "Bangalore"; // Default city
  weather.fetchWeather(city); 
  
  // Set an interval to refresh weather data every 5 minutes
  weather.startInterval(city);
};