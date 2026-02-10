// Problem: Count the number of vowels in a string.

function countVowels(str: string): number {
    const vowels = str.match(/[aeiou]/gi);
    return vowels ? vowels.length : 0;
}

const sentence: string = "TypeScript is awesome!";
console.log(`Number of vowels in "${sentence}":`, countVowels(sentence));
