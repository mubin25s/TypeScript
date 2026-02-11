// Problem: Find the second largest number in an array.

function findSecondLargest(arr: number[]): number | null {
    if (arr.length < 2) return null;

    let largest = -Infinity;
    let secondLargest = -Infinity;

    for (const num of arr) {
        if (num > largest) {
            secondLargest = largest;
            largest = num;
        } else if (num > secondLargest && num !== largest) {
            secondLargest = num;
        }
    }

    return secondLargest === -Infinity ? null : secondLargest;
}

const numbers: number[] = [10, 5, 20, 8, 12];
console.log(`The second largest number in [${numbers.join(", ")}] is:`, findSecondLargest(numbers));
