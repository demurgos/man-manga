// These are temporary definitions until types/env-mocha#9 is fixed

/**
 * Type of the `this` context of spec functions (suite definition)
 */
export interface Suite extends Mocha.ISuite {}

/**
 * Type of the `this` context of assertion functions (test definition)
 */
export interface Test extends Mocha.ITest {
  /**
   * Tell Mocha to simply ignore this test case.
   * It’s important to note that calling this.skip() will effectively abort the test.
   */
  skip(): void;
}
