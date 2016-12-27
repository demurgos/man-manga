import {assert} from "chai";
import * as googlesearch from "./googlesearch";

describe("googlesearch", function () {
  it.skip("query: goku", async function () {
    const items: googlesearch.Item[] = await googlesearch.query("goku");
    assert.instanceOf(items, Array);
  });
});
