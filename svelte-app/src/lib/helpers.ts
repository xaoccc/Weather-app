export interface Weather {
  current: {
    windSpeed: number;
    precipitation: number;
    feelsLike: number;
    temperature: number;
  };
}

export function weatherCond(code: number) {
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
        case [21, 80, 81, 82, ...[...Array(23).keys()].map(n => 60 + n)].includes(code):
            return "icon-rain.webp";
        case [95, 96, 97, 98, 99].includes(code):
            return "icon-storm.webp";
        case [...Array(10).keys()].map(n => 50 + n).includes(code):
            return "icon-drizzle.webp";
        case [22, 85, 86, 87, 88, 89, 90, 93, 94].includes(code):
            return "icon-snow.webp";
        default:
            return "icon-loading.svg";
    }
}

export function toFarenheit(temp: number) {
    return (temp * 9) / 5 + 32;
}

export function showTemperature(weather: Weather, units: Array<string>, type) {
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

export function showWind(weather: Weather, units: Array<string>) {
    if (weather) {
        return units[1] == "kmh"
            ? weather.current.windSpeed.toFixed(0)
            : (weather.current.windSpeed * 0.621371).toFixed(0);
    }
}

export function showPrecipitation(weather: Weather, units: Array<string>) {
    if (weather) {
        return units[2] == "mm"
            ? weather.current.precipitation.toFixed(2)
            : (weather.current.precipitation / 25.4).toFixed(2);
    }
}