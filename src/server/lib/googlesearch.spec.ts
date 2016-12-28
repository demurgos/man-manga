import {assert} from "chai";
import * as testGooglesearch from "../../test/googlesearch/index";
import * as googlesearch from "./googlesearch";

describe("googlesearch", function () {
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
          results: googlesearch.defaultOptions.results
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
          results: 50
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

  describe("scrap", function() {
    it("goku", async function () {
      const html: string = await testGooglesearch.readFile("goku.html");
      const expected: googlesearch.SearchResult[] = JSON.parse(await testGooglesearch.readFile("goku.json"));
      const actual: googlesearch.SearchResult[] = googlesearch.scrap(html);
      assert.deepEqual(actual, expected);
    });
  });

  describe.skip("search", function() {
    it("goku", async function () {
      const items: googlesearch.SearchResult[] = await googlesearch.search({query: "goku"});
      assert.instanceOf(items, Array);
      assert.isAtLeast(items.length, 1);
    });
  });
});
