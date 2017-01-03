import "angular2-universal-polyfills";

import {assert} from "chai";
import {getCharacterUri} from "./api.service";
import {getMangaUri} from "./api.service";

const apiBaseUri: string = "http://example.com/api";

describe("getCharacterUri", function() {
  it("should return the URI for: foo?bar", function() {
    const expected: string = "http://example.com/api/character/foo%3Fbar";
    const actual: string = getCharacterUri(apiBaseUri, "foo?bar");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%20Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon\"Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%22Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon\"Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon#Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%23Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon#Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon$Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%24Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon$Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon%Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%25Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon%Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon&Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%26Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon&Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon'Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%27Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon'Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon+Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%2BBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon+Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon,Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%2CBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon,Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon/Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%2FBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon/Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon:Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%3ABall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon:Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon;Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%3BBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon;Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon<Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%3CBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon<Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon=Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%3DBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon=Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon>Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon%3EBall";
    const actual: string = getMangaUri(apiBaseUri, "Dragon>Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon!Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon!Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon!Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon(Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon(Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon(Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon)Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon)Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon)Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon*Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon*Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon*Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon-Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon-Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon-Ball");
    assert.strictEqual(actual, expected);
  });
});

describe("getMangaUri", function() {
  it("should return the URI for: Dragon.Ball", function() {
    const expected: string = "http://example.com/api/manga/Dragon.Ball";
    const actual: string = getMangaUri(apiBaseUri, "Dragon.Ball");
    assert.strictEqual(actual, expected);
  });
});
