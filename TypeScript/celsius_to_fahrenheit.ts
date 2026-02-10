// Problem: Convert temperature from Celsius to Fahrenheit.
// Formula: (Celsius * 9/5) + 32

function celsiusToFahrenheit(celsius: number): number {
    return (celsius * 9 / 5) + 32;
}

const tempCelsius: number = 25;
console.log(`${tempCelsius}°C is equal to ${celsiusToFahrenheit(tempCelsius)}°F`);
