// Problem: Generate the first N numbers of the Fibonacci sequence.

function generateFibonacci(n: number): number[] {
    const sequence: number[] = [0, 1];
    if (n <= 1) return sequence.slice(0, n);

    for (let i = 2; i < n; i++) {
        sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    return sequence;
}

const count: number = 10;
console.log(`First ${count} Fibonacci numbers:`, generateFibonacci(count).join(", "));
