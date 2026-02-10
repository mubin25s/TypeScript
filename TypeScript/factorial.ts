// Problem: Calculate the factorial of a number.

function factorial(n: number): number {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

const num: number = 5;
console.log(`Factorial of ${num} is:`, factorial(num));
