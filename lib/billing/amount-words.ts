/** Rupee amounts in words, Indian numbering (thousand, lakh, crore), as printed on invoices. */

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function belowHundred(n: number): string {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : "");
}

function belowThousand(n: number): string {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} Hundred` : "", rest ? belowHundred(rest) : ""].filter(Boolean).join(" ");
}

/** A whole number in words, e.g. 123694 → "One Lakh Twenty-Three Thousand Six Hundred Ninety-Four". */
export function numberInWords(n: number): string {
  const value = Math.floor(Math.abs(n));
  if (value === 0) return "Zero";
  const crore = Math.floor(value / 10_000_000);
  const lakh = Math.floor((value % 10_000_000) / 100_000);
  const thousand = Math.floor((value % 100_000) / 1000);
  const rest = value % 1000;
  return [
    crore ? `${numberInWords(crore)} Crore` : "",
    lakh ? `${belowHundred(lakh)} Lakh` : "",
    thousand ? `${belowHundred(thousand)} Thousand` : "",
    rest ? belowThousand(rest) : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/** Integer paise in words, e.g. 12369450 → "Rupees One Lakh Twenty-Three Thousand Six Hundred Ninety-Four and Fifty Paise Only". */
export function amountInWords(paise: number): string {
  const abs = Math.abs(Math.round(paise));
  const rupees = Math.floor(abs / 100);
  const remainder = abs % 100;
  const words = `Rupees ${numberInWords(rupees)}${remainder ? ` and ${belowHundred(remainder)} Paise` : ""} Only`;
  return paise < 0 ? `Minus ${words}` : words;
}
