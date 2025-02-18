import fs from "fs";
import path from "path";

// Path to the folder containing the dog SVG files
const folderPath = "./destination-dogs"; // Change this to your actual folder path

// Read all files from the folder
const files = fs.readdirSync(folderPath);

// Set to store unique keys
const dogKeys = new Set();

// Extract base names without extensions and add to the Set
files.forEach((file) => {
  const ext = path.extname(file); // Get file extension
  const baseName = path.basename(file, ext); // Get file name without extension
  dogKeys.add(baseName); // Keep the base name as is (kebab-cased)
});

// Convert the Set to an array and format it as a TypeScript type
const dogKeysArray = Array.from(dogKeys);
const formattedDogKeys = dogKeysArray.map((key) => `"${key}"`).join("\n  | ");

// Generate the final TypeScript type declaration
const tsTypeDeclaration = `export type DogKeys =\n  | ${formattedDogKeys};\n`;

// Output the TypeScript type declaration to the console
console.log(tsTypeDeclaration);

// Optionally, write it to a file
const outputFilePath = path.join(folderPath, "dogKeys.ts");
fs.writeFileSync(outputFilePath, tsTypeDeclaration);
console.log(`TypeScript type declaration written to ${outputFilePath}`);
