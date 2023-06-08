const fs = require("fs");

const initialFile = fs.readFileSync("t8.shakespeare.txt", "utf-8");

const findWordsFile = fs.readFileSync("find_words.txt", "utf-8");
const findWords = findWordsFile.split("\n");

const dictionaryFile = fs.readFileSync("french_dictionary.csv", "utf-8");

const startTime = new Date();

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

const endTime = new Date();
const convertedTime = endTime - startTime;

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${minutes} minutes ${remainingSeconds} seconds`;
  
  return formattedTime;
}

const finalTime = formatTime(convertedTime);

const memoryUsed = process.memoryUsage().heapUsed / 1024 / 1024;
const performanceTxt = `Time to process: ${finalTime} \nMemory used: ${memoryUsed} MB`;

fs.writeFileSync("performance.txt", performanceTxt);
