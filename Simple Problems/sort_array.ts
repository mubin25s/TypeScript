// Problem: Sort an array of numbers in ascending order.

function sortNumbers(arr: number[]): number[] {
    return arr.slice().sort((a, b) => a - b);
}

const unsorted: number[] = [34, 12, 5, 78, 2, 56];
console.log(`Unsorted: [${unsorted.join(", ")}]`);
console.log(`Sorted:   [${sortNumbers(unsorted).join(", ")}]`);
