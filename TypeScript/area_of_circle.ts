// Problem: Calculate the area of a circle given its radius.

function calculateArea(radius: number): number {
    return Math.PI * radius * radius;
}

const radius: number = 5;
console.log(`The area of a circle with radius ${radius} is:`, calculateArea(radius).toFixed(2));
