const apiKey = "2c4f2229ada735e2656dc3c301a792a2"; // Min APIKEY
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIntervals = document.getElementById("weatherIntervals");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // Undvika att hemsida laddas om
  const city = cityInput.value;
  getWeather(city);
});

function getWeather(city) {
  const forecastHours = document.getElementById("forecastHours").value;
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=sv&cnt=${forecastHours}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.cod === "404") {
        displayError("Staden hittades inte");
        return;
      }
      //console.log(data.list);

      // Nuvaranade väder:
      const currentWeather = data.list[0]; // Nuvarande tid
      const description = currentWeather.weather[0].description;

      const weatherBackground = document.getElementById("weatherBackground");

      weatherBackground.className = ""; // Raderar klass efter nya sök, undvika CSS style problem

      // replace(/\s/g, "-") = Ersätter mellanslag till "-", behövs för CSS style
      const weatherClass = description.toLowerCase().replace(/\s/g, "-");
      weatherBackground.classList.add(weatherClass)

      const temp = currentWeather.main.temp;
      const windSpeed = currentWeather.wind.speed;
      const weatherIconCode = currentWeather.weather[0].icon;
      const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;

      const weatherInformation = `
        <h1>${city}</h1>
        <h1>Nuvarande väderinformation</h1>
        <p>Beskrivning: ${description}. </p>
        <p>Temperatur: ${temp} °C. </p>
        <p>Vindhastighet: ${windSpeed} m/s</p>
        <img src="${weatherIconUrl}" alt="Weather Icon" class="weather-icon">
      `;

      weatherDescription.innerHTML = weatherInformation;

      // Tidsintervaller
      const forecastList = data.list.slice(1); // Tar bort nuvarande tid

      weatherIntervals.innerHTML = "<h1>Prognos över timmarna</h1>";

      //for (let i = 0; i < forecastList.length; i++) {
        
      for (const forecast of forecastList) {
        const weatherIconCode = forecast.weather[0].icon;
        const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;
        const temp = forecast.main.temp;
        const forecastTime = forecast.dt_txt;
        const description = forecast.weather[0].description;

        const forecastItem = document.createElement("div");
        forecastItem.classList.add("forecast-item");

        const timeElement = document.createElement("p");
        timeElement.textContent = `${forecastTime}: ${description}`;
        forecastItem.appendChild(timeElement);

        const tempElement = document.createElement("p");
        tempElement.textContent = `Temperatur: ${temp} °C`;
        forecastItem.appendChild(tempElement);

        const weatherIcon = document.createElement("img");
        weatherIcon.src = weatherIconUrl;
        weatherIcon.alt = "Weather Icon";
        forecastItem.appendChild(weatherIcon);

        weatherIntervals.appendChild(forecastItem);
      }
    })

    .catch(error => {
      displayError("Ett fel har uppstått. Försök igen!");
    });
}

function displayError(msg) {
  weatherDescription.innerHTML = `<p class="error">${msg}</p>`;
}