<script lang="ts">
    import { meteoData } from "./lib/api"



    
  let city = $state('');

  function handleSearch() {
    if (city.trim()) {
      meteoData(city);
    } else {
      alert('Please enter a city name');
    }
  }
    
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
    <div class="search-bar">
        <label for="seach-bar"></label>
        <input type="text" id="seach-bar" placeholder="Search for a place..." bind:value={city}>
        <button onclick={handleSearch}>Search</button>
    </div>
    <h1>How's the sky looking today?</h1>
</main>

