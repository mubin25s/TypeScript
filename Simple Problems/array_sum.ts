// Problem: Calculate the sum of all elements in an array.

function sumArray(arr: number[]): number {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

const data: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(`The sum of [${data.join(", ")}] is:`, sumArray(data));
