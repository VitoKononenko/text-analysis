let textarea = document.getElementById('flesch-text');
let button = document.getElementById('flesch-submit');
let flesch = document.getElementById('flesch-value');
let textParseInfo = document.getElementById('text-parse-info');
let paragraphCount = document.getElementById('paragraph-count');

function calculateFlesch(totalSentences, totalWords, totalSyllables) {
  return (206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords)));
}

function getSyllables(word) {
  word = word.toLowerCase();
  if (word.length <= 3) { return 1; }
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  let syl = word.match(/[aeiouy]{1,2}/g);
  return (syl && syl.length) || 0;
}

function getSentances(text) {
  const expression = new RegExp(/\b((?!=|\; |\. |\! |\? ).)+(.)\b/g);
  const sentences = [...text.matchAll(expression)].map(function(oof) {
    return oof[0]
  });
  return sentences;
}

function getParagraphs(text) {
  const paragraphsArray = text.split("\n\n");
  const strip_whitespace = /\s+/gi;
  return paragraphsArray.filter(function(paragraph) {
    const trimmedParagraph = paragraph.replace(strip_whitespace, "");
    if (trimmedParagraph && trimmedParagraph.length > 1) {
      return paragraph;
    }
  });
}

function generateHTMLReport(paragraph, index) {
  const sentances = getSentances(paragraph);
  const sentancesCount = sentances.length;
  const wordsCount = getWords(paragraph).length;

  const paragraphBlock = document.createElement('div');
  paragraphBlock.className = "paragraph";
  const paragraphElem = document.createElement('p');
  const sentancesElem = document.createElement('b');
  const wordsElem = document.createElement('b');
  const sentancesBlock = document.createElement('div');
  sentancesBlock.className = "sentence";
  sentances.forEach(function(sentence, index) {
    const sencanceElem = document.createElement('p');
    const sentanceWordsElem = document.createElement('b');
    sentanceWordsElem.textContent = ` (words count: ${getWords(sentence).length})`;
    sencanceElem.textContent = `${index + 1}. ${sentence}`
    sencanceElem.appendChild(sentanceWordsElem);
    sentancesBlock.appendChild(sencanceElem);
  })

  paragraphElem.textContent = `${index + 1}. ${paragraph}`;
  sentancesElem.textContent = `Sentances: ${sentancesCount || 0}`;
  wordsElem.textContent = `Words: ${wordsCount || 0}`;

  paragraphBlock.appendChild(paragraphElem);
  paragraphBlock.appendChild(sentancesElem);
  paragraphBlock.appendChild(sentancesBlock);
  paragraphBlock.appendChild(wordsElem);
  textParseInfo.appendChild(paragraphBlock);
}

function getWords(text) {
  return text.trim().split(/\s+/)
}

function getFleschInfo(text) {
  let totalSentences = 0, totalWords = 0, totalSyllables = 0;
  const paragraphs = getParagraphs(text);
  const paragraphsAmount = paragraphs.length;

  let sentences = getSentances(text);
  totalSentences = sentences.length;
  sentences.forEach(function (sentence) {
    let words = getWords(sentence);
    totalWords += words.length;
    words.forEach(function(word) {
      totalSyllables += getSyllables(word);
    });
  });

  return {
    totalSentences,
    totalWords,
    totalSyllables,
    paragraphs,
    paragraphsAmount,
    flesch: Math.round(calculateFlesch(totalSentences, totalWords, totalSyllables), 2)
  }
}

function displayFlesch() {
  let text = textarea.value

  textParseInfo.innerHTML = "";
  const textData = getFleschInfo(text);
  const fleschValue = textData.flesch;
  if (fleschValue > 100) {
    flesch.innerHTML = 100;
  } else if (fleschValue < 0) {
    flesch.innerHTML = 0;
  } else {
    flesch.innerHTML = fleschValue;
  }

  paragraphCount.innerHTML = textData.paragraphsAmount;
  textData.paragraphs.forEach(generateHTMLReport)
}
