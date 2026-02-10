// Problem: Calculate Simple Interest.
// Formula: (Principal * Rate * Time) / 100

function calculateSimpleInterest(principal: number, rate: number, time: number): number {
    return (principal * rate * time) / 100;
}

const p: number = 1000;
const r: number = 5;
const t: number = 2;

console.log(`Simple Interest for P=${p}, R=${r}%, T=${t} years is:`, calculateSimpleInterest(p, r, t));
