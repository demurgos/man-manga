import {Author, Manga} from "../../../lib/interfaces/resources/index";
import {retrieveAuthor} from "./author";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";
import * as dbpediaUtils from "./utils";

/**
 * A map between a sparql variable and its name
 */
// tslint:disable-next-line:typedef
export const sparqlVariables = {
  title: "mangaTitle",
  author: "mangaAuthor",
  volumes: "mangaVolumes",
  publicationDate: "mangaPublicationDate",
  illustrator: "mangaIllustrator",
  publisher: "mangaPublisher",
  abstract: "mangaAbstract"
};

/**
 * Returns all available information about the manga 'mangaName'.
 *
 * @param mangaName The manga's name.
 */
export async function retrieveManga(mangaName: string): Promise<Manga | null> {
  const manga: Manga | null = await getMangaInfos(mangaName);
  if (manga === null) {
    return null;
  }

  if (manga.author !== undefined) {
    const authorName: string = manga.author.name;
    try {
      const author: Author | null = await retrieveAuthor(authorName);
      if (author !== null) {
        manga.author = author;
      }
    } catch (err) {
      // Ignore error when loading more data: keep only the name and type
    }
  }

  return manga;
}

/**
 * Returns basic information about the manga `resourceIri`.
 *
 * @param resourceIri The manga's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getMangaInfos(resourceIri: string, lang: string = "en"): Promise<Manga | null> {

  const nameIriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: resourceIri};
  const nameIriRefString: string = sparqlQuery.formatIriRef(nameIriRefNode);

  const titleVar: string = `?${sparqlVariables.title}`;
  const authorVar: string = `?${sparqlVariables.author}`;
  const volumesVar: string = `?${sparqlVariables.volumes}`;
  const publicationDateVar: string = `?${sparqlVariables.publicationDate}`;
  const illustratorVar: string = `?${sparqlVariables.illustrator}`;
  const publisherVar: string = `?${sparqlVariables.publisher}`;
  const abstractVar: string = `?${sparqlVariables.abstract}`;
  const langLiteral: string = `'${lang}'`;

  const query: string = `
    SELECT DISTINCT
      ${titleVar} ${authorVar} ${volumesVar} ${publicationDateVar} ${illustratorVar}
      ${publisherVar} ${abstractVar}
    WHERE {
      values ${titleVar} {${nameIriRefString}}.
      ${titleVar} a dbo:Manga.
      OPTIONAL {
        ${titleVar} dbo:author ${authorVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:numberOfVolumes ${volumesVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:firstPublicationDate ${publicationDateVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:illustrator ${illustratorVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:publisher ${publisherVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:abstract ${abstractVar}.
        filter(langMatches(lang(${abstractVar}), ${langLiteral}))
      }. 
    }
  `;

  const sparqlResult: sparql.SelectResult = await dbpediaUtils.selectQuery(query);
  return sparqlToManga(sparqlResult);
}

/**
 * Transforms an object coming from a sparql request's response
 * into a manga.
 * It's fairly recommended to process the function crossArray
 * on the result BEFORE passing it to this function.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export function sparqlToManga(sparqlResult: sparql.SelectResult): Manga | null {
  const data: {[varName: string]: Set<string>} = dbpediaUtils.mergeSelectBindings(sparqlResult.results.bindings);
  const collectedVariables: Set<string> = new Set();

  // title
  let title: string | undefined;
  if (sparqlVariables.title in data) {
    title = data[sparqlVariables.title].values().next().value;
    collectedVariables.add(sparqlVariables.title);
  }

  // publicationDate
  let publicationDate: Date | undefined;
  if (sparqlVariables.publicationDate in data) {
    // Get the earliest date
    for (const dateString of Array.from(data[sparqlVariables.publicationDate])) {
      const dateObj: Date = new Date(dateString);
      if (publicationDate === undefined || dateObj.getTime() < publicationDate.getTime()) {
        publicationDate = dateObj;
      }
    }
    collectedVariables.add(sparqlVariables.publicationDate);
  }

  // author
  let author: Author | undefined;
  if (sparqlVariables.author in data) {
    const authorName: string = data[sparqlVariables.author].values().next().value;
    author = {
      type: "author",
      name: authorName,
      others: {}
    };
    collectedVariables.add(sparqlVariables.author);
  }

  // abstract
  let snippet: string | undefined;
  if (sparqlVariables.abstract in data) {
    snippet = data[sparqlVariables.abstract].values().next().value;
    collectedVariables.add(sparqlVariables.abstract);
  }

  // volumes
  let volumes: number | undefined;
  if (sparqlVariables.volumes in data) {
    // Get the maximum number of volumes
    for (const volumesString of Array.from(data[sparqlVariables.volumes])) {
      const volumesNumber: number = parseInt(volumesString, 10);
      if (!isNaN(volumesNumber) && (volumes === undefined || volumesNumber > volumes)) {
        volumes = volumesNumber;
      }
    }
    collectedVariables.add(sparqlVariables.volumes);
  }

  // others
  const others: {[varName: string]: string[]} = {};
  for (const varName in data) {
    if (!data.hasOwnProperty(varName) || collectedVariables.has(varName)) {
      continue;
    }
    others[varName] = Array.from(data[varName]);
  }

  if (title === undefined) {
    return null;
  }

  return {
    type: "manga",
    title,
    author,
    abstract: snippet,
    volumes,
    others
  };
}
