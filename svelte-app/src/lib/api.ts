import { fetchWeatherApi } from 'openmeteo';

// Todo: get current geolocation data at loading and get search data after user input
export async function meteoData(city) {
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;

    const geoResponse = await fetch(geocodeUrl);
    const geoData = await geoResponse.json();

    if (!navigator.geolocation) {
        console.error('Geolocation not supported');
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
    })

    // Get position data from input
    const params = {
        latitude: geoData.results[0].latitude,
        longitude: geoData.results[0].longitude,
        current: 'temperature_2m,weather_code,wind_speed_10m,wind_direction_10m',
        hourly: 'temperature_2m,precipitation',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min'
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const current = response.current()!;
    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature: current.variables(0)!.value(), // Current is only 1 value, therefore `.value()`
            weatherCode: current.variables(1)!.value(),
            windSpeed: current.variables(2)!.value(),
            windDirection: current.variables(3)!.value()
        },
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature: hourly.variables(0)!.valuesArray()!, // `.valuesArray()` get an array of floats
            precipitation: hourly.variables(1)!.valuesArray()!,
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            weatherCode: daily.variables(0)!.valuesArray()!,
            temperatureMax: daily.variables(1)!.valuesArray()!,
            temperatureMin: daily.variables(2)!.valuesArray()!,
        }
    };

    // Current weather data
    console.log(weatherData.current)
    // Hourly weather data
    console.log(weatherData.hourly)
    // Daily weather data
    console.log(weatherData.daily)



}


