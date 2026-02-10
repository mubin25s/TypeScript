// Problem: Find the maximum of three numbers.

function findMax(a: number, b: number, c: number): number {
    return Math.max(a, b, c);
}

const n1: number = 15;
const n2: number = 42;
const n3: number = 7;

console.log(`The maximum of ${n1}, ${n2}, and ${n3} is:`, findMax(n1, n2, n3));
