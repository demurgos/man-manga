import {assert} from "chai";
import * as httpIO from "../../lib/interfaces/io";
import {Suite as MochaSuite, Test as MochaTest} from "../../test/mocha-interfaces";
import * as testResources from "../../test/server/resources";
import * as testConfig from "../../test/test-config";
import * as googlesearch from "./googlesearch";

describe("googlesearch", function () {
  // Ensure that `resolveOptions` correctly completes the options
  describe("resolveOptions", function () {
    interface Item {
      options: googlesearch.Options;
      expected: googlesearch.CompleteOptions;
    }
    const items: Item[] = [
      {
        options: {
          query: "test"
        },
        expected: {
          query: "test",
          host: googlesearch.defaultOptions.host,
          language: googlesearch.defaultOptions.language,
          results: googlesearch.defaultOptions.results,
          userAgent: googlesearch.defaultOptions.userAgent,
          httpIO: googlesearch.defaultOptions.httpIO
        }
      },
      {
        options: {
          query: "test",
          host: "www.google.fr",
          language: "fr",
          results: 50
        },
        expected: {
          query: "test",
          host: "www.google.fr",
          language: "fr",
          results: 50,
          userAgent: googlesearch.defaultOptions.userAgent,
          httpIO: googlesearch.defaultOptions.httpIO
        }
      }
    ];

    for (const {options, expected} of items) {
      it(`should resolve the options ${JSON.stringify(options)}`, function() {
        const actual: googlesearch.CompleteOptions = googlesearch.resolveOptions(options);
        assert.deepEqual(actual, expected);
      });
    }
  });

  // Ensure that the html scrapping works
  describe("scrap", function() {
    interface Item {
      name: string;
      htmlFile: string;
      expectedResultsFile: string;
    }

    // The file paths are relative to "test/server".
    const items: Item[] = [
      {
        name: "goku",
        htmlFile: "googlesearch/goku.html",
        expectedResultsFile: "googlesearch/goku.expected-results.json"
      }
    ];

    for (const item of items) {
      it(item.name, async function() {
        const html: string = await testResources.readFile(item.htmlFile);
        const expected: googlesearch.SearchResult[] = JSON.parse(
          await testResources.readFile(item.expectedResultsFile)
        );
        const actual: googlesearch.SearchResult[] = googlesearch.scrap(html);
        assert.deepEqual(actual, expected);
      });
    }
  });

  describe("search - offline (mocked)", function(this: MochaSuite) {
    /**
     * Returns an object mocking Http requests by reading JSON files of previously saved requests.
     * It first compares the query with the expected query (expectedRequestFile) and then
     * returns the data in responseFile. Both files are resolved relatively to "test/server".
     */
    function getMockedHttpIO(expectedRequestFile: string, responseFile: string): httpIO.IO {
      return {
        async get(options: httpIO.GetOptions): Promise<httpIO.Response> {
          const expectedRequest: httpIO.GetOptions = JSON.parse(await testResources.readFile(expectedRequestFile));
          assert.deepEqual(options, expectedRequest);
          return JSON.parse(await testResources.readFile(responseFile));
        },
        async post(options: httpIO.PostOptions): Promise<httpIO.Response> {
          throw new Error("Unexpected HTTP method `POST`");
        },
        async put(options: httpIO.PutOptions): Promise<httpIO.Response> {
          throw new Error("Unexpected HTTP method `PUT`");
        }
      };
    }

    interface Item {
      name: string;
      searchOptionsFile: string;
      expectedRequestFile: string;
      httpResponseFile: string;
      expectedResultsFile: string;
    }

    // The file paths are relative to "test/server".
    const items: Item[] = [
      {
        name: "javascript",
        searchOptionsFile: "googlesearch/javascript.search-options.json",
        expectedRequestFile: "googlesearch/javascript.expected-request.json",
        httpResponseFile: "googlesearch/javascript.http-response.json",
        expectedResultsFile: "googlesearch/javascript.expected-results.json"
      },
      {
        name: "goku",
        searchOptionsFile: "googlesearch/goku.search-options.json",
        expectedRequestFile: "googlesearch/goku.expected-request.json",
        httpResponseFile: "googlesearch/goku.http-response.json",
        expectedResultsFile: "googlesearch/goku.expected-results.json"
      },
      {
        name: "goku, www.google.co.jp",
        searchOptionsFile: "googlesearch/goku.www-google-co-jp.search-options.json",
        expectedRequestFile: "googlesearch/goku.www-google-co-jp.expected-request.json",
        httpResponseFile: "googlesearch/goku.www-google-co-jp.http-response.json",
        expectedResultsFile: "googlesearch/goku.www-google-co-jp.expected-results.json"
      }
    ];

    for (const item of items) {
      it(item.name, async function() {
        const searchOptions: googlesearch.Options = JSON.parse(await testResources.readFile(item.searchOptionsFile));
        searchOptions.httpIO = getMockedHttpIO(item.expectedRequestFile, item.httpResponseFile);
        const expectedResults: googlesearch.SearchResult[] = JSON.parse(
          await testResources.readFile(item.expectedResultsFile)
        );
        const actualResults: googlesearch.SearchResult[] = await googlesearch.search(searchOptions);
        assert.deepEqual(actualResults, expectedResults);
      });
    }
  });

  describe("search - online", function(this: MochaSuite) {
    interface TestFunction {
      (expectation: string, assertion?: () => void): any;
      (expectation: string, assertion?: (done: MochaDone) => void): any;
    }

    const testFunction: TestFunction = testConfig.offline ? it.skip : it;

    testFunction("goku", async function () {
      const items: googlesearch.SearchResult[] = await googlesearch.search({query: "goku"});
      assert.instanceOf(items, Array);
      assert.isAtLeast(items.length, 1);
    });
  });
});
