// Problem: Capitalize the first letter of each word in a string.

function capitalizeWords(str: string): string {
    return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
}

const text: string = "hello world from typescript";
console.log(`Original: "${text}"`);
console.log(`Capitalized: "${capitalizeWords(text)}"`);
