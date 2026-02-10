// Problem: Find the largest number in an array.

function findMax(arr: number[]): number {
    return Math.max(...arr);
}

const numbers: number[] = [23, 56, 12, 89, 43, 9];
console.log(`The largest number in [${numbers.join(", ")}] is:`, findMax(numbers));
