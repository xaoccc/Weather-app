<script lang="ts">
    import { weatherData } from "./lib/api"

    // Current weather data
    console.log(weatherData.current)
    // Hourly weather data
    console.log(weatherData.hourly)
    // Daily weather data
    console.log(weatherData.daily)
    
</script>
<header>
    <img src="logo.svg" alt="logo">
    <div class="units-btn">
        <img src="icon-units.svg" alt="settings icon">
        <p>Units</p>
        <button aria-label="dropdown button" class="dropdown-btn"></button>
    </div>
</header>

<main>
    <h1>How's the sky looking today?</h1>
</main>

