import "angular2-universal-polyfills";

import {assert} from "chai";
import {getCharacterUri} from "./api.service";

const apiBaseUri: string = "http://example.com/api";

describe("getCharacterUri", function() {
  it("should return the URI for: foo?bar", function() {
    const expected: string = "http://example.com/api/character/foo%3Fbar";
    const actual: string = getCharacterUri(apiBaseUri, "foo?bar");
    assert.strictEqual(actual, expected);
  });
});
