// Problem: Write a function that checks if a number is even or odd.

function isEven(num: number): boolean {
    return num % 2 === 0;
}

const testNumber: number = 7;
if (isEven(testNumber)) {
    console.log(`${testNumber} is Even`);
} else {
    console.log(`${testNumber} is Odd`);
}
