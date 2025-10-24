<script lang="ts">
    import { meteoData } from "./lib/api";
    import { onMount } from "svelte";
    import ApiError from "./lib/ApiError.svelte";

    let city = $state("Sofia");
    let weather = $state(null);
    let error = $state(false);
    let units = $state(["c", "kmh", "mm"]);
    let dropdownUnitsShow = $state(false);
    const currentWeekDay = new Date();
    let weekdayShow = $state(currentWeekDay.getDay().toString());
    let hourlyData = $state([]);
    let dailyData = $state([]);

    function logDay() {
        // For each filter we emply the array, so we don't add to existing data
        hourlyData = [];

        weather.hourly.time.forEach((value, i) => {
            if (value.getDay() == weekdayShow) {
                hourlyData.push([
                    value.getHours(),
                    weather.hourly.temperature[i],
                    weather.hourly.weatherCode[i],
                ]);
            }
        });
    }

    function logWeek() {
        // For each filter we emply the array, so we don't add to existing data
        dailyData = [];

        weather.daily.time.forEach((value, i) => {
            dailyData.push([
                value.toLocaleDateString("en-US", { weekday: "short" }),
                weather.daily.weatherCode[i],
                weather.daily.temperatureMax[i],
                weather.daily.temperatureMin[i],
            ]);
        });
    }

    async function handleSearch() {
        if (city.trim()) {
            try {
                weather = await meteoData(city);
                logDay();
                logWeek();
            } catch (err) {
                error = true;
            }
        } else {
            error = true;
        }
    }

    onMount(() => {
        $effect(() => {
            handleSearch();
        });
    });

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
    }

    function showWind(weather, units) {
        if (weather) {
            return units[1] == "kmh"
                ? weather.current.windSpeed.toFixed(0)
                : (weather.current.windSpeed * 0.621371).toFixed(0);
        }
    }

    function showPrecipitation(weather, units) {
        if (weather) {
            return units[2] == "mm"
                ? weather.current.precipitation.toFixed(2)
                : (weather.current.precipitation / 25.4).toFixed(2);
        }
    }

    function weatherCond(code) {
        switch (true) {
            case [0].includes(code):
                return "icon-sunny.webp";
            case [1, 2].includes(code):
                return "icon-partly-cloudy.webp";
            case [3, 4, 5, 6, 7, 8, 9].includes(code):
                return "icon-overcast.webp";
            case [10, 11, 12, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49].includes(
                code,
            ):
                return "icon-fog.webp";
            case [
                21, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74,
                75, 76, 77, 78, 78, 80, 81, 82,
            ].includes(code):
                return "icon-rain.webp";
            case [90, 91, 99].includes(code):
                return "icon-storm.webp";
            case [50, 51, 52, 53, 54, 55, 56, 57, 58, 59].includes(code):
                return "icon-drizzle.webp";
            case [22].includes(code):
                return "icon-snow.webp";
            default:
                return "icon-loading.svg";
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

{#if error}
    <ApiError />
{:else}
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
                            <p>
                                {`${showTemperature(weather, units, "normal")}º`}
                            </p>
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
                            <p>
                                {`${weather ? weather.current.humidity : 46}%`}
                            </p>
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
                <div class="daily">
                    {#if dailyData}
                        {#each dailyData as data}
                            <div>
                                <p>{data[0]}</p>
                                <img
                                    src={weatherCond(data[1])}
                                    class="weather-icon"
                                    alt="weather-icon"
                                />
                                <div class="daily-temp">
                                    <p>
                                        {units[0] == "c"
                                            ? data[2].toFixed(0)
                                            : toFarenheit(data[2]).toFixed(0)}º
                                    </p>
                                    <p>
                                        {units[0] == "c"
                                            ? data[3].toFixed(0)
                                            : toFarenheit(data[3]).toFixed(0)}º
                                    </p>
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </section>
            <section class="hourly">
                <div class="hourly-header">
                    <p>Hourly forecast</p>
                    <!-- TO DO: make the dropdown customizable, using div + ul + li -->
                    <select
                        onchange={(e) => {
                            const select = e.target as HTMLSelectElement;
                            weekdayShow = select.value;
                            logDay();
                        }}
                        name="dropdown-weekday"
                        bind:value={weekdayShow}
                        id="dropdown-weekday"
                        class="dropdown-weekday"
                    >
                        <option value="1">Monday</option>
                        <option value="2">Tuesday</option>
                        <option value="3">Wednesday</option>
                        <option value="4">Thursday</option>
                        <option value="5">Friday</option>
                        <option value="6">Saturday</option>
                        <option value="0">Sunday</option>
                    </select>
                </div>
                <div class="hourly-data">
                    {#if hourlyData.length > 0}
                        {#each hourlyData as data}
                            <div>
                                <div>
                                    <img
                                        src={weatherCond(data[2])}
                                        class="weather-icon"
                                        alt="weather-icon"
                                    />
                                    <div>
                                        {data[0] > 12 ? data[0] - 12 : data[0]}
                                        {data[0] > 12 ? "PM" : "AM"}
                                    </div>
                                </div>
                                <div>
                                    {units[0] == "c"
                                        ? data[1].toFixed(0)
                                        : toFarenheit(data[1]).toFixed(0)}º
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </section>
        </section>
    </main>
{/if}
