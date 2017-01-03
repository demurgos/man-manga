import {Anime, Author} from "../../../lib/interfaces/resources/index";
import {retrieveAuthor} from "./author";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";
import * as dbpediaUtils from "./utils";

/**
 * A map between a sparql variable and its name
 */
// tslint:disable-next-line:typedef
export const sparqlVariables = {
  title: "animeTitle",
  author: "animeAuthor",
  abstract: "animeAbstract"
};

/**
 * Returns all available information about the anime 'name'.
 * @param animeName The anime's name.
 */
export async function retrieveAnime(animeName: string): Promise<Anime | null> {
  const anime: Anime | null = await getAnimeInfos(animeName);
  if (anime === null) {
    return null;
  }

  if (anime.author !== undefined) {
    const authorName: string = anime.author.name;
    try {
      const author: Author | null = await retrieveAuthor(authorName);
      if (author !== null) {
        anime.author = author;
      }
    } catch (err) {
      // Ignore error when loading more data: keep only the name and type
    }
  }

  return anime;
}

/**
 * Returns basic information about the anime 'resourceIri'.
 *
 * @param resourceIri The anime's Internationalized Resource Identifier.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getAnimeInfos(resourceIri: string, lang: string = "en"): Promise<Anime | null> {
  // TODO: dbo:numberOfEpisodes via dbr:List_of_<resource>_episodes

  const nameIriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: resourceIri};
  const nameIriRefString: string = sparqlQuery.formatIriRef(nameIriRefNode);

  const titleVar: string = `?${sparqlVariables.title}`;
  const authorVar: string = `?${sparqlVariables.author}`;
  const abstractVar: string = `?${sparqlVariables.abstract}`;
  const langLiteral: string = `'${lang}'`;

  const query: string = `
    SELECT DISTINCT
      ${titleVar} ${authorVar} ${abstractVar}
    WHERE {
      values ${titleVar} {${nameIriRefString}}.
      ${titleVar} a dbo:Anime.
      OPTIONAL {
        ${titleVar} dbo:abstract ${abstractVar}.
        filter(langMatches(lang(${abstractVar}), ${langLiteral}))
      }.
    }
  `;

  const sparqlResult: sparql.SelectResult = await dbpediaUtils.selectQuery(query);
  return sparqlToAnime(sparqlResult);
}

/**
 * Transforms an object coming from a sparql request's response
 * into a anime.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export async function sparqlToAnime(sparqlResult: sparql.SelectResult): Promise<Anime | null> {
  const data: {[varName: string]: Set<string>} = dbpediaUtils.mergeSelectBindings(sparqlResult.results.bindings);
  const collectedVariables: Set<string> = new Set();

  // titleIri
  let titleIri: string | undefined;
  if (sparqlVariables.title in data) {
    titleIri = data[sparqlVariables.title].values().next().value;
    collectedVariables.add(sparqlVariables.title);
  }

  // author
  let author: Author | undefined;
  if (sparqlVariables.author in data) {
    const authorIri: string = data[sparqlVariables.author].values().next().value;
    const authorResult: Author | null = await retrieveAuthor(authorIri);
    if (authorResult !== null) {
      author = authorResult;
    }
    collectedVariables.add(sparqlVariables.author);
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

  if (titleIri === undefined) {
    return null;
  }

  return {
    type: "anime",
    title: await dbpediaUtils.getLabel(titleIri),
    author,
    abstract: snippet,
    others
  };
}
