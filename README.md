# Real-Time Data Processing System for Weather Monitoring
The application is hosted on GitHub. You can access it [here](https://github.com/athifal/weather-monitoring).

## Objective
The objective of this application is to monitor weather conditions in real-time using the OpenWeatherMap API. Users can view current weather, 5-day forecasts, and configure alerting thresholds for temperature. The weather data is automatically updated every 5 minutes, and users can set their preferences for the temperature unit (Celsius, Kelvin, or Fahrenheit).
## Repository Structure
- `index.html`: Main HTML file for the application.
- `style.css`: Stylesheet for the application's interface.
- `script.js`: JavaScript file containing the application logic.


## Data Processing
The system retrieves weather data from the OpenWeatherMap API every 5 minutes for the city specified by the user. The data includes the current weather, 5-day forecast, and other relevant parameters such as temperature, humidity, and wind speed.

### Key Data Processing Features:
- Converting temperature units from Kelvin (default) to Celsius or Fahrenheit based on user selection.
- Aggregating weather data to compute average, maximum, and minimum temperatures for daily summaries.

## Rollups and Aggregates
The system provides the following aggregated data:
- **Average Temperature**: The average temperature for the current day based on available data points.
- **Maximum and Minimum Temperature**: The highest and lowest temperatures for the day.
- **Weather Forecast**: A 5-day weather forecast, including icons representing the weather conditions.

## Alerting Thresholds
Users can set a temperature threshold that triggers an alert when breached. The threshold is stored in Celsius internally, even if the user selects another unit. If the current temperature exceeds the threshold, an alert is displayed.

**Example**: If a user sets a threshold of 30°C and the temperature rises above this value, an alert is triggered and shown on the screen.

## Visualization
Daily summaries and trends, including average, maximum, and minimum temperatures, are displayed directly on the application’s interface. Weather conditions are visually represented using icons fetched from the OpenWeatherMap API. The 5-day forecast is displayed with corresponding temperature readings and dates.

### Key Components of the Application:
- **City Search**: Users can search for the weather in a specific city.
- **Unit Selector**: Users can toggle between Celsius, Fahrenheit, and Kelvin for temperature units.
- **Weather Data Display**: Current weather information, including temperature, humidity, and wind speed, is displayed alongside a 5-day forecast.
- **Alert Configuration**: Users can set temperature thresholds and receive alerts when the temperature exceeds the set value.

## Configuration

### Clone the Repository
To clone the repository, use the following command:

```bash
git clone https://github.com/athifal/weather-monitoring.git
```
Navigate to the Cloned Directory
Open your terminal or command prompt and change to the project directory:
```bash
cd weather-monitoring
```
Open the Application
Locate the index.html file in the cloned directory and open it in your web browser. You can do this by either:
Double-clicking the index.html file, or
Right-clicking the file, selecting "Open with," and choosing your preferred browser.
Now you should be able to view and interact with the Weather Monitoring Application!

## Testing and Validation

### Test Cases
The following test cases were implemented for both the rule engine application and the weather monitoring system:

- **Weather Monitoring:**
    - Simulating weather updates by fetching data from the OpenWeatherMap API and verifying the accuracy of weather details displayed.
    - Testing daily weather summaries, including average, minimum, and maximum temperatures.
    - Verifying the functionality of user-configurable temperature thresholds and triggering alerts when thresholds are exceeded.
    - Cross-validating temperature unit conversions between Celsius, Fahrenheit, and Kelvin to ensure consistent display.



---

