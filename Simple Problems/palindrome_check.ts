// Problem: Check if a given string is a palindrome.

function isPalindrome(str: string): boolean {
    const cleanedStr = str.toLowerCase().replace(/[^a-z0-9]/g, "");
    const reversedStr = cleanedStr.split("").reverse().join("");
    return cleanedStr === reversedStr;
}

const test1: string = "Racecar";
const test2: string = "Hello";

console.log(`"${test1}" is a palindrome?`, isPalindrome(test1));
console.log(`"${test2}" is a palindrome?`, isPalindrome(test2));
