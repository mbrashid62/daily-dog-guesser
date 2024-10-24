export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

export function kebabToTitleCase(str: string): string {
  return str
    .split("-") // Split the string by the hyphen
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words with a space
}

export function isFirstCharVowel(str: string): boolean {
  // Check if string is not empty
  if (!str) {
    return false;
  }

  // Define a string of vowels (both lowercase and uppercase)
  const vowels = "aeiouAEIOU";

  // Check if the first character of the string is in the vowels list
  return vowels.includes(str[0]);
}
