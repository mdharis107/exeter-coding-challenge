const fs = require("fs");

const initialFile = fs.readFileSync("t8.shakespeare.txt", "utf-8");

const findWordsFile = fs.readFileSync("find_words.txt", "utf-8");
const findWords = findWordsFile.split("\n");

const dictionaryFile = fs.readFileSync("french_dictionary.csv", "utf-8");

const updatedWords = {};
const lines = dictionaryFile.split("\n");
for (const line of lines) {
  const [englishWord, frenchWord] = line.split(",");
  updatedWords[englishWord] = frenchWord;
}

const convertedWords = {};

let translatedText = initialFile;

for (const word of findWords) {
  if (updatedWords[word]) {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    translatedText = translatedText.replace(regex, (match) => {
      convertedWords[match] = convertedWords[match]
        ? convertedWords[match] + 1
        : 1;
      return updatedWords[word];
    });
  }
}

fs.writeFileSync("t8.shakespeare.translated.txt", translatedText);

let frequencyFile = "English word,French word,Frequency\n";
for (const [englishWord, frequency] of Object.entries(convertedWords)) {
  const frenchWord = updatedWords[englishWord];
  frequencyFile += `${englishWord},${frenchWord},${frequency}\n`;
}
fs.writeFileSync("frequency.csv", frequencyFile);


const performanceData = process.resourceUsage();
const timeTaken = `${performanceData.userCPUTime / 1000000} seconds`;
const memoryUsed = `${performanceData.maxRSS / 1024 / 1024} MB`;
const performanceTxt = `Time to process: ${timeTaken}\nMemory used: ${memoryUsed}`;
fs.writeFileSync("performance.txt", performanceTxt);

