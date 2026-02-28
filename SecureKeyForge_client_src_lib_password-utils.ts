// Word list for password generation (phonetic alphabet)
export const wordList = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mango', 'nectar', 'omega', 'papa',
  'quartz', 'romeo', 'sierra', 'tango', 'ultra', 'vector', 'whiskey', 'xray',
  'yankee', 'zulu'
];

export const specialChars = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

export function getRandomNumber(): number {
  return Math.floor(Math.random() * (9999 - 10 + 1)) + 10;
}

export interface PasswordOptions {
  length: number;
  includeSpecial: boolean;
  includeNumbers: boolean;
}

export function generatePassword(options: PasswordOptions): string {
  const { length, includeSpecial, includeNumbers } = options;
  const passwordParts: string[] = [];

  for (let i = 0; i < length; i++) {
    const itemTypes = ['word'];
    if (includeSpecial) itemTypes.push('special');
    if (includeNumbers) itemTypes.push('number');

    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    if (itemType === 'word') {
      passwordParts.push(wordList[Math.floor(Math.random() * wordList.length)]);
    } else if (itemType === 'special') {
      passwordParts.push(specialChars[Math.floor(Math.random() * specialChars.length)]);
    } else if (itemType === 'number') {
      passwordParts.push(getRandomNumber().toString());
    }
  }

  // Shuffle the parts
  for (let i = passwordParts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordParts[i], passwordParts[j]] = [passwordParts[j], passwordParts[i]];
  }

  return passwordParts.join('');
}

export interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 25;
  if (/[0-9]/.test(password)) score += 25;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25;

  if (score <= 25) {
    return { score, text: 'Weak', color: 'bg-red-500' };
  } else if (score <= 50) {
    return { score, text: 'Fair', color: 'bg-yellow-500' };
  } else if (score <= 75) {
    return { score, text: 'Good', color: 'bg-blue-500' };
  } else {
    return { score, text: 'Strong', color: 'bg-green-500' };
  }
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;

  return date.toLocaleDateString();
}

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}
