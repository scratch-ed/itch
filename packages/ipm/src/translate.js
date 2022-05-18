import fs from 'fs';
import os from 'os';
import path from 'path';

import zl from 'zip-lib';

const REGEXP = /:[A-zÀ-ú\-?]+:/g;
const PREFIX = 'itch';

/**
 * Translate a string by replacing all occurrences by words from the dictionary.
 *
 * @param {Object|Map} dictionary - Map of codes to text in one language.
 * @param {string} text - The text to translate.
 * @param {boolean} quiet - Show warnings or not
 */
function translate(dictionary, text, quiet) {
  if (typeof dictionary === 'object') {
    dictionary = new Map(Object.entries(dictionary));
  }
  text = text.toString();
  return text.replaceAll(REGEXP, (match) => {
    if (!dictionary.has(match) && !quiet) {
      console.warn(`Untranslated key: ${match} in json.`);
    }
    return dictionary.get(match) || match;
  });
}

/**
 * Translate an SB3 file.
 *
 * @param {string} originalSb3 - Path to the original SB3 file.
 * @param {string} translatedSb3 - Where to save the new SB3 file.
 * @param {string} dictionaryPath - Where to get the dictionary.
 * @param {"nl"|"en"} language - The language.
 * @param {boolean} quiet - Show warnings or not.
 */
export async function translateSb3(
  originalSb3,
  translatedSb3,
  dictionaryPath,
  language,
  quiet,
) {
  const dictionary = JSON.parse(fs.readFileSync(dictionaryPath))[language];
  let tempDir;
  try {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), PREFIX));
    await zl.extract(originalSb3, tempDir);

    // File is called project.json.
    const translatable = path.join(tempDir, 'project.json');
    const projectText = fs.readFileSync(translatable);
    const translatedText = translate(dictionary, projectText, quiet);
    fs.writeFileSync(translatable, translatedText);

    // Re-zip the file to the path.
    await zl.archiveFolder(tempDir, translatedSb3);
  } finally {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true });
    }
  }
}
