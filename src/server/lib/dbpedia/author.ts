import {Author} from "../../../lib/interfaces/resources/index";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";
import * as dbpediaUtils from "./utils";

/**
 * A map between a sparql variable and its name
 */
// tslint:disable-next-line:typedef
export const sparqlVariables = {
  title: "authorTitle",
  abstract: "authorAbstract",
  employer: "authorEmployer",
  birthDate: "authorBirthDate"
};

/**
 * Returns all available information about the author `authorName`.
 *
 * @param authorName The author's name.
 */
export async function retrieveAuthor(authorName: string): Promise<Author | null> {
  return getAuthorInfos(authorName);
}

/**
 * Returns basic information about the author 'resourceIri'.
 *
 * @param resourceIri The author's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getAuthorInfos(resourceIri: string, lang: string = "en"): Promise<Author | null> {
  // TODO: dbo:numberOfEpisodes via dbr:List_of_<resource>_episodes

  const nameIriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: resourceIri};
  const nameIriRefString: string = sparqlQuery.formatIriRef(nameIriRefNode);

  const titleVar: string = `?${sparqlVariables.title}`;
  const abstractVar: string = `?${sparqlVariables.abstract}`;
  const employerVar: string = `?${sparqlVariables.employer}`;
  const birthDateVar: string = `?${sparqlVariables.birthDate}`;
  const langLiteral: string = `'${lang}'`;

  const query: string = `
    SELECT DISTINCT
      ${titleVar} ${abstractVar} ${employerVar} ${birthDateVar}
    WHERE {
      values ${titleVar} {${nameIriRefString}}.
      {
        ?m a dbo:Manga.
        ?m dbo:author ${titleVar}.
      } UNION {
        ?m a dbo:Anime.
        ?m dbo:writer ${titleVar}.
      }
      OPTIONAL {
        ${titleVar} dbo:employer ${employerVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:birthDate ${birthDateVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:abstract ${abstractVar}.
        filter(langMatches(lang(${abstractVar}), ${langLiteral}))
      }.
    }
  `;

  const sparqlResult: sparql.SelectResult = await dbpediaUtils.selectQuery(query);
  return sparqlToAuthor(sparqlResult);
}

/**
 * Transforms an object coming from a sparql request's response
 * into an author.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export function sparqlToAuthor(sparqlResult: sparql.SelectResult): Author | null {
  const data: {[varName: string]: Set<string>} = dbpediaUtils.mergeSelectBindings(sparqlResult.results.bindings);
  const collectedVariables: Set<string> = new Set();

  // name
  let name: string | undefined;
  if (sparqlVariables.title in data) {
    name = data[sparqlVariables.title].values().next().value;
    collectedVariables.add(sparqlVariables.title);
  }

  // employer
  let employer: string | undefined;
  if (sparqlVariables.employer in data) {
    employer = data[sparqlVariables.employer].values().next().value;
    collectedVariables.add(sparqlVariables.employer);
  }

  // abstract
  let snippet: string | undefined;
  if (sparqlVariables.abstract in data) {
    snippet = data[sparqlVariables.abstract].values().next().value;
    collectedVariables.add(sparqlVariables.abstract);
  }

  // others
  const others: {[varName: string]: string[]} = {};
  for (const varName in data) {
    if (!data.hasOwnProperty(varName) || collectedVariables.has(varName)) {
      continue;
    }
    others[varName] = Array.from(data[varName]);
  }

  if (name === undefined) {
    return null;
  }

  return {
    type: "author",
    name,
    employer,
    abstract: snippet,
    others
  };
}
