/// <reference types="jest" />
// @ts-ignore

declare global {
  namespace jest {
    interface Matchers<R> {
      /**
       * @param {string} status
       */
      everyStatusToBe(status: string): R;

      /**
       * @param {string} expected
       * @param {number} amount
       */
      atLeastStatuses(expected: string, amount: number): R;

      /**
       * @param {number} amount
       */
      atLeastStatuses(amount: number): R;

      /**
       * @param {string} expected
       * @param {number} amount
       */
      exactStatuses(expected: string, amount: number): R;

      /**
       * @param {number} amount
       */
      exactStatuses(amount: number): R;

      /**
       * @param {string} command
       * @param {number} amount
       */
      atLeastCommands(command: string, amount: number): R;
    }
  }

  function executePlan(
    template: string,
    solution: string,
    testplan: string,
    options: Object,
  ): Promise<Object[]>;

  function run(
    dir: string,
    solutionName: string,
    level?: string | number,
    planLevel?: string | number,
  ): Promise<Object[]>;

  function execute(
    dir: string,
    templateName: string,
    submissionName: string,
    planName?: string,
  ): Promise<Object[]>;

  function testProject(
    dir: string,
    template: string,
    solution: string,
    plan?: string,
  ): Promise<Object[]>;
}
