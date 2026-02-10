// Problem: Print the multiplication table of a given number.

function printMultiplicationTable(n: number): void {
    console.log(`Multiplication Table for ${n}:`);
    for (let i = 1; i <= 10; i++) {
        console.log(`${n} x ${i} = ${n * i}`);
    }
}

printMultiplicationTable(5);
