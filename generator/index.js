const jsonfile = require('jsonfile');
const path = require('path');
const CHAIN = require('./chain');
const readlineSync = require('readline-sync');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateChain(words) {
  const chain = words.reduce((obj, word) => {
    obj[word] = [];
    return obj;
  }, Object.create(null));
  for (let i = 0; i < words.length - 1; i++) {
    let w1 = words[i];
    let w2 = words[i + 1];
    chain[w1].push(w2);
  }
  return chain;
}

function chooseRandom(chain) {
  return randomKey(chain);
}

function chooseNext(chain, currentState) {
  const options = chain[currentState];
  const n = options.length;
  if (n === 0) {
    return chooseRandom(chain);
  }
  return options[getRandomInt(0, n)];
}

function randomKey(object) {
  const keys = Object.keys(object);
  const n = keys.length;
  return keys[getRandomInt(0, n)];
}

function generatePoem(chain, lines) {
  const startWord = chooseRandom(chain);
  let currentWord = startWord;
  let poem = (() => {
    const arr = [];
    for (let i = 0; i < lines; i++) {
      arr.push('');
    }
    return arr;
  })();
  let linesRemaining = lines;
  return poem.map((lineStr) => {
    return (() => {
      do {
        lineStr += currentWord + ' ';
        currentWord = chooseNext(chain, currentWord);
      } while (currentWord !== '\n');
      return lineStr.trim();
    })();
  }).join('\n');
}

function readPoeticWords(file) {
  return jsonfile.readFileSync(file).words;
}

function parsePoeticLines(file) {
  const lines = jsonfile.readFileSync(file).lines;
  const words = lines.reduce((str, line) => {
    return str += line + ' \n ';
  }).split(' ');
  return words;
}

function writePoeticWords(file, words) {
  jsonfile.writeFileSync(file, { words: words }, { flag: 'w+' });
}

module.exports = function generate(lineCount) {
  return generatePoem(CHAIN, lineCount);
};