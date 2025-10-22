<script lang="ts">
    import { meteoData } from "./lib/api";

    let city = $state("");
    let weather = $state(null);
    let error = $state(null);
    let units = $state(["c", "kmh", "mm"]);
    let dropdownUnitsShow = $state(false);
    let dropdownWeekdayShow = $state(false);

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
            if (units[0] == "c") {
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

        if (units[0] == "c") {
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
            return units[1] == "kmh"
                ? weather.current.windSpeed.toFixed(0)
                : (weather.current.windSpeed * 0.621371).toFixed(0);
        }
        return units[1] == "kmh" ? 14 : 9;
    }

    function showPrecipitation(weather, units) {
        if (weather) {
            return units[2] == "mm"
                ? weather.current.precipitation.toFixed(2)
                : (weather.current.precipitation / 25.4).toFixed(2);
        }
        return units[2] == "mm" ? 0 : 0;
    }

    function weatherCond(code) {
        switch (true) {
            case [0].includes(code):
                return "icon-sunny.webp";
            case [1, 2, 3].includes(code):
                return "icon-partly-cloudy.webp";
            case [10, 11, 12].includes(code):
                return "icon-fog.webp";
            case [21, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69].includes(code):
                return "icon-rain.webp";
            case [50, 51, 52, 53, 54, 55, 56, 57, 58, 59].includes(code):
                return "icon-drizzle.webp";
            case [22].includes(code):
                return "icon-snow.webp";
            default:
                return "icon-sunny.webp";
        }
    }
</script>

<header>
    <img src="logo.svg" alt="logo" />
    <div class="units">
        <button
            class="units-btn"
            onclick={() => {
                dropdownUnitsShow
                    ? (dropdownUnitsShow = false)
                    : (dropdownUnitsShow = true);
            }}
        >
            <img src="icon-units.svg" alt="settings icon" />
            <p>Units</p>
            <div class="dropdown-btn"></div>
        </button>
        {#if dropdownUnitsShow}
            <div class="dropdown-units">
                <div>Switch to imperial</div>
                <hr />
                <div class="unit-title">Temperature</div>
                <button
                    onclick={() => (units[0] = "c")}
                    class={units[0] == "c" ? "selected" : ""}
                    >Celsius (ºC)</button
                >
                <button
                    onclick={() => (units[0] = "f")}
                    class={units[0] == "f" ? "selected" : ""}
                    >Fahrenheit (ºF)</button
                >
                <hr />
                <div class="unit-title">Wind speed</div>
                <button
                    onclick={() => (units[1] = "kmh")}
                    class={units[1] == "kmh" ? "selected" : ""}>km/h</button
                >
                <button
                    onclick={() => (units[1] = "mph")}
                    class={units[1] == "mph" ? "selected" : ""}>mph</button
                >
                <hr />
                <div class="unit-title">Precipitation</div>
                <button
                    onclick={() => (units[2] = "mm")}
                    class={units[2] == "mm" ? "selected" : ""}
                    >Milimeters (mm)</button
                >
                <button
                    onclick={() => (units[2] = "in")}
                    class={units[2] == "in" ? "selected" : ""}
                    >Inches (in)</button
                >
            </div>
        {/if}
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
                        <img
                            src={weather
                                ? weatherCond(weather.current.weatherCode)
                                : "icon-sunny.webp"}
                            alt="icon-weather"
                        />
                        <p>{`${showTemperature(weather, units, "normal")}º`}</p>
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
                        <p>{`${weather ? weather.current.humidity : 46}%`}</p>
                    </div>
                    <div>
                        <p>Wind</p>
                        <p>
                            {`${showWind(weather, units)} ${units[1] == "kmh" ? " km/h" : " mph"}`}
                        </p>
                    </div>
                    <div>
                        <p>Precipitation</p>
                        <p>
                            {`${showPrecipitation(weather, units)} ${units[2] == "mm" ? " mm" : " in"}`}
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section class="hourly">
            <div class="hourly-header">
                <p>Hourly forecast</p>
                <div class="weekday-btn">
                    <div>
                        <button
                        class="weekday-select-btn"
                            onclick={() =>
                                (dropdownWeekdayShow = !dropdownWeekdayShow)}
                        >Tuesday</button>
                        <img src="icon-dropdown.svg" alt="" />
                    </div>

                    {#if dropdownWeekdayShow}
                        <div class="dropdown-weekday">
                            <button>Monday</button>
                            <button>Tuesday</button>
                            <button>Wednesday</button>
                            <button>Thursday</button>
                            <button>Friday</button>
                            <button>Saturday</button>
                            <button>Sunday</button>
                        </div>
                    {/if}
                </div>
            </div>
        </section>
    </section>
</main>
