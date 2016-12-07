import * as spotlight from "./spotlight";

const text = "First documented in the 13th century, Berlin was the capital of the Kingdom of Prussia (1701–1918), " +
  "the German Empire (1871–1918), the Weimar Republic (1919–33) and the Third Reich (1933–45). Berlin in the 1920s was the third largest " +
  "municipality in the world. After World War II, the city became divided into East Berlin -- the capital of East Germany -- and West Berlin, " +
  "a West German exclave surrounded by the Berlin Wall from 1961–89. Following German reunification in 1990, the city regained its status " +
  "as the capital of Germany, hosting 147 foreign embassies.";

async function test() {
  const results = await spotlight.query(text, "en");
  console.log(results);
}

test();
