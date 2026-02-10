// Problem: Reverse a given string.

function reverseString(str: string): string {
    return str.split("").reverse().join("");
}

const original: string = "TypeScript";
console.log(`Original: ${original}`);
console.log(`Reversed: ${reverseString(original)}`);
