// Problem: Check if a year is a leap year.

function isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

const year: number = 2024;
console.log(`Is the year ${year} a leap year?`, isLeapYear(year));
