<script lang="ts">
    import { meteoData } from "./lib/api";

    let city = $state("");
    let weather = $state(null);
    let error = $state(null);
    let units = $state("metric");

    async function handleSearch() {
        if (city.trim()) {
            try {
                weather = await meteoData(city);
            } catch (err) {
                error = err.message;
            }
        } else {
            alert("Please enter a city name");
        }
    }

    function toFarenheit(temp) {
        return (temp * 9) / 5 + 32;
    }

    function showTemperature(weather, units, type) {
        if (weather) {
            if (units == "metric") {
                if (type == "feelsLike") {
                    return weather.current.feelsLike.toFixed(0);
                }
                return weather.current.temperature.toFixed(0);
            }
            if (type == "feelsLike") {
                return toFarenheit(weather.current.feelsLike).toFixed(0);
            }
            return toFarenheit(weather.current.temperature).toFixed(0);
        }

        if (units == "metric") {
            if (type == "feelsLike") {
                return 18;
            }
            return 20;
        }
        if (type == "feelsLike") {
            return 64;
        }
        return 68;
    }

    function showWind(weather, units) {
        if (weather) {
            return (units == "metric") ? weather.current.windSpeed.toFixed(0) : (weather.current.windSpeed * 0.621371).toFixed(0);
        }
        return (units == "metric") ? 14 : 9;
    }
</script>

<header>
    <img src="logo.svg" alt="logo" />
    <div class="units-btn">
        <img src="icon-units.svg" alt="settings icon" />
        <p>Units</p>
        <button aria-label="dropdown button" class="dropdown-btn"></button>
    </div>
</header>

<main>
    <h1>How's the sky looking today?</h1>
    <div class="search-bar">
        <label for="seach-bar"></label>
        <input
            type="text"
            id="seach-bar"
            placeholder="Search for a place..."
            bind:value={city}
        />
        <button onclick={handleSearch}>Search</button>
    </div>
    <section class="container">
        <section class="left-container">
            <div class="current">
                <div class="current-header">
                    <div class="current-location">
                        <p class="location">
                            {weather
                                ? `${weather.name}, ${weather.country}`
                                : "Berlin, Germany"}
                        </p>
                        <p class="date">
                            {new Date().toLocaleDateString([], {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                    <div class="temperature">
                        {`${showTemperature(weather, units, "normal")}º`}
                    </div>
                </div>
                <div class="current-more-info">
                    <div>
                        <p>Feels Like</p>
                        <p>
                            {`${showTemperature(weather, units, "feelsLike")}º`}
                        </p>
                    </div>
                    <div>
                        <p>Humidity</p>
                        <p></p>
                    </div>
                    <div>
                        <p>Wind</p>
                        <p>{`${showWind(weather, units)} ${(units == "metric") ? " km/h" : " mph"}`}</p>
                    </div>
                    <div>
                        <p>Precipitation</p>
                        <p></p>
                    </div>
                </div>
            </div>
        </section>
        <section class="hourly"></section>
    </section>
</main>
