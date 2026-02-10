// Problem: Write a function to check if a number is prime.

function isPrime(num: number): boolean {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
}

const n: number = 17;
console.log(`Is ${n} a prime number?`, isPrime(n));
