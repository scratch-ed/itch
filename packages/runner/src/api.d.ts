import type { OutputHandler } from 'itch-core/src/output';
import type { Page as PuppeteerPage } from 'puppeteer';
import type { Page as CorePage } from 'puppeteer-core';
import type { LanguageData } from 'itch-core/src/i18n';
import type { Judgement } from 'itch-core/src/output/full-schema';

interface TestplanUrlOptions {
  /** Path to the testplan. */
  testplan: string;
}

interface TestplanDataOptions {
  /** The content of the testplan. */
  testplanData: string;
}

interface Options {
  /** Url to the template sb3 file. */
  template: string;
  /** Url to the submission sb3 file */
  submission: string;
  /** Optional token for authentication */
  token?: string;

  /** Enable support for local file:// */
  isLocalFile?: boolean;

  /** The language of the exercise. */
  language: 'nl' | 'en';
  /** Use the full format or not */
  fullFormat?: boolean;
  /** Path to translations file. Will be used to populate language data. */
  translations?: string | LanguageData;

  /**
   * Handle the output.
   *
   * If `fullFormat` is true, this will be called once with a full Judgement.
   * If it is false, this will be called for every update.
   *
   * @param update An Update object for every update or one Judgement.
   */
  outputHandler: OutputHandler;

  /**
   * If Puppeteer should pause before beginning the execution.
   */
  pause: boolean;
}

interface UrlOptions extends Options, TestplanUrlOptions {}

interface DataOption extends Options, TestplanDataOptions {}

type JudgeOptions = UrlOptions | DataOption;

/**
 * Run the tests on an existing page from puppeteer.
 *
 * This function does not manage puppeteer.
 *
 * @param page - Puppeteer page to run on.
 * @param options - Options for the run.
 *
 * @returns The result of the judge or nothing if using partial format.
 */
export function runOnPage(
  page: CorePage | PuppeteerPage,
  options: JudgeOptions,
): Promise<Judgement | undefined>;
