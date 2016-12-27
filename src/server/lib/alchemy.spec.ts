import {assert} from "chai";
import * as alchemy from "./alchemy";

describe("alchemy", function () {
  it.skip("getTextFromURL: fr.wikipedia.org", async function () {
    const result: alchemy.Result = await alchemy.getTextFromURL("https://fr.wikipedia.org");
    assert.equal(result.language, "TODO");
    assert.equal(result.text, "TODO");
    assert.equal(result.url, "TODO");
  });
});
