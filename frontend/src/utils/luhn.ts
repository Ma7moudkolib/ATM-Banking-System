/**
 * Validates a card number using the Luhn algorithm.
 * @param cardNumber - The card number string (digits only)
 * @returns true if the card number is valid
 */
export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length === 0) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Masks a card number, showing only the last 4 digits.
 * @param cardNumber - The full card number
 * @returns Masked card number like ****-****-****-0366
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `****-****-****-${last4}`;
}

/**
 * Formats a card number with dashes every 4 digits.
 * @param value - Raw input value
 * @returns Formatted card number like 4532-0151-1283-0366
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join('-') : digits;
}
