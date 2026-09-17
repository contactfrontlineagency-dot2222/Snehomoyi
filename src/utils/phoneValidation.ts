/**
 * Bangladeshi Phone Number Validator & Normalizer
 * Accepts:
 *   017XXXXXXXX, 018XXXXXXXX, 019XXXXXXXX, 016XXXXXXXX,
 *   013XXXXXXXX, 014XXXXXXXX, 015XXXXXXXX
 * Also supports:
 *   +8801XXXXXXXXX or 8801XXXXXXXXX
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalizedNumber: string;
  errorMessageBn?: string;
  errorMessageEn?: string;
}

export function validateBangladeshiPhone(rawInput: string): PhoneValidationResult {
  if (!rawInput || typeof rawInput !== 'string') {
    return {
      isValid: false,
      normalizedNumber: '',
      errorMessageBn: 'মোবাইল নম্বর প্রদান করুন',
      errorMessageEn: 'Please enter a phone number'
    };
  }

  // Remove whitespace, dashes, brackets
  const cleaned = rawInput.replace(/[\s\-\(\)]/g, '');

  // Extract digits
  let digits = cleaned;
  if (digits.startsWith('+88')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('88')) {
    digits = digits.slice(2);
  }

  // Must now be 11 digits starting with 01[3-9]
  if (digits.length < 11) {
    return {
      isValid: false,
      normalizedNumber: digits,
      errorMessageBn: 'মোবাইল নম্বরটি খুব ছোট (১১ সংখ্যার হতে হবে)',
      errorMessageEn: 'Phone number is too short (must be 11 digits)'
    };
  }

  if (digits.length > 11) {
    return {
      isValid: false,
      normalizedNumber: digits,
      errorMessageBn: 'মোবাইল নম্বরটি ১১ সংখ্যার বেশি হওয়া যাবে না',
      errorMessageEn: 'Phone number must be exactly 11 digits'
    };
  }

  // Check valid Bangladeshi mobile operator prefix: 013, 014, 015, 016, 017, 018, 019
  const validOperatorRegex = /^01[3-9]\d{8}$/;
  if (!validOperatorRegex.test(digits)) {
    return {
      isValid: false,
      normalizedNumber: digits,
      errorMessageBn: 'অকার্যকর নম্বর! সঠিক অপারেটর নম্বর দিন (013, 014, 015, 016, 017, 018, 019)',
      errorMessageEn: 'Invalid operator! Must start with 013, 014, 015, 016, 017, 018, or 019'
    };
  }

  // Check for repeated fake numbers (e.g., 01711111111, 01888888888, 01700000000)
  const subscriberPart = digits.slice(3); // 8 digits
  const allSameDigits = subscriberPart.split('').every(ch => ch === subscriberPart[0]);
  if (allSameDigits) {
    return {
      isValid: false,
      normalizedNumber: digits,
      errorMessageBn: 'দয়া করে একটি আসল মোবাইল নম্বর দিন, ভুয়া বা বারবার একই ডিজিট গ্রহণযোগ্য নয়',
      errorMessageEn: 'Please provide a genuine mobile number, repeated fake numbers are rejected'
    };
  }

  // Check obvious placeholder test sequences (e.g. 12345678, 87654321)
  if (subscriberPart === '12345678' || subscriberPart === '87654321' || digits === '01700000000') {
    return {
      isValid: false,
      normalizedNumber: digits,
      errorMessageBn: 'অনুগ্রহ করে সঠিক ব্যক্তিগত মোবাইল নম্বর লিখুন',
      errorMessageEn: 'Please enter a valid personal mobile number'
    };
  }

  return {
    isValid: true,
    normalizedNumber: digits
  };
}

export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-US')}`;
}
