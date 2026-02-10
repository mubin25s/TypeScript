// Problem: The classic FizzBuzz problem.
// Print numbers from 1 to 50. 
// For multiples of 3, print "Fizz" instead of the number.
// For multiples of 5, print "Buzz".
// For multiples of both 3 and 5, print "FizzBuzz".

function fizzBuzz(n: number): void {
    for (let i = 1; i <= n; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            console.log("FizzBuzz");
        } else if (i % 3 === 0) {
            console.log("Fizz");
        } else if (i % 5 === 0) {
            console.log("Buzz");
        } else {
            console.log(i);
        }
    }
}

console.log("FizzBuzz from 1 to 50:");
fizzBuzz(50);
