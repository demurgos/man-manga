import {SearchResult} from "../../../lib/interfaces/api/search";
import {IO as HttpIO} from "../../../lib/interfaces/io";
import {requestIO} from "../request-io";
import * as animeSparql from "./anime";
import * as authorSparql from "./author";
import * as characterSparql from "./character";
import * as mangaSparql from "./manga";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";
import * as dbpediaUtils from "./utils";

/**
 * A map between a sparql variable and its name
 */
// tslint:disable-next-line:typedef
export const sparqlVariables = {
  type: "x"
};

/**
 * A map between a sparql literal and its value
 */
// tslint:disable-next-line:typedef
export const sparqlLiterals = {
  animeType: "anime",
  authorType: "author",
  characterType: "character",
  mangaType: "manga"
};

/**
 * Returns basic information about the resource `resourceIri`.
 *
 * @param resourceIri The resource's resourceIri.
 * @param lang The lang in which information are wanted. Default to english.
 * @param httpIO override the default `request`-based http requests library
 */
// TODO: Further abstract query in order to reuse directly the parts from the specific modules
export async function search(resourceIri: string, lang: string = "en",
                             httpIO: HttpIO = requestIO): Promise<SearchResult | null> {

  const nameIriRefNode: sparqlQuery.IriRef = {type: "IriRef", value: resourceIri};
  const nameIriRefString: string = sparqlQuery.formatIriRef(nameIriRefNode);

  const typeVar: string = `?${sparqlVariables.type}`;
  // anime
  const animeTitleVar: string = `?${animeSparql.sparqlVariables.title}`;
  const animeAuthorVar: string = `?${animeSparql.sparqlVariables.author}`;
  const animeAbstractVar: string = `?${animeSparql.sparqlVariables.abstract}`;
  // author
  const authorTitleVar: string = `?${authorSparql.sparqlVariables.title}`;
  const authorAbstractVar: string = `?${authorSparql.sparqlVariables.abstract}`;
  const authorEmployerVar: string = `?${authorSparql.sparqlVariables.employer}`;
  const authorBirthDateVar: string = `?${authorSparql.sparqlVariables.birthDate}`;
  // character
  const characterTitleVar: string = `?${characterSparql.sparqlVariables.title}`;
  const characterAuthorVar: string = `?${characterSparql.sparqlVariables.author}`;
  const characterAbstractVar: string = `?${characterSparql.sparqlVariables.abstract}`;
  // manga
  const mangaTitleVar: string = `?${mangaSparql.sparqlVariables.title}`;
  const mangaAuthorVar: string = `?${mangaSparql.sparqlVariables.author}`;
  const mangaVolumesVar: string = `?${mangaSparql.sparqlVariables.volumes}`;
  const mangaPublicationDateVar: string = `?${mangaSparql.sparqlVariables.publicationDate}`;
  const mangaIllustratorVar: string = `?${mangaSparql.sparqlVariables.illustrator}`;
  const mangaPublisherVar: string = `?${mangaSparql.sparqlVariables.publisher}`;
  const mangaAbstractVar: string = `?${mangaSparql.sparqlVariables.abstract}`;

  // literals
  const animeTypeLiteral: string = `'${sparqlLiterals.animeType}'`;
  const authorTypeLiteral: string = `'${sparqlLiterals.authorType}'`;
  const characterTypeLiteral: string = `'${sparqlLiterals.characterType}'`;
  const mangaTypeLiteral: string = `'${sparqlLiterals.mangaType}'`;
  const langLiteral: string = `'${lang}'`;

  const query: string = `
    SELECT
      ${typeVar}
      ${animeTitleVar} ${animeAuthorVar} ${animeAbstractVar}
      ${authorTitleVar} ${authorAbstractVar} ${authorEmployerVar} ${authorBirthDateVar}
      ${characterTitleVar} ${characterAuthorVar} ${characterAbstractVar}
      ${mangaTitleVar} ${mangaAuthorVar} ${mangaVolumesVar} ${mangaPublicationDateVar}
      ${mangaIllustratorVar} ${mangaPublisherVar} ${mangaAbstractVar}
    WHERE {
      {
        values ${animeTitleVar} {${nameIriRefString}}.
        bind(exists {${animeTitleVar} a dbo:Anime.} as ?is).
        bind(IF(?is=1, ${animeTypeLiteral}, 0) as ${typeVar}).
        OPTIONAL {
          ${animeTitleVar} dbo:writer ${animeAuthorVar}
        }.
        OPTIONAL {
          ${animeTitleVar} dbo:abstract ${animeAbstractVar}.
          filter(langMatches(lang(${animeAbstractVar}), ${langLiteral}))
        }.
      } UNION {
        values ${authorTitleVar} {${nameIriRefString}}.
        bind(exists {?m a dbo:Anime. ?m dbo:writer ${authorTitleVar}.} as ?is).
        bind(IF(?is=1, ${authorTypeLiteral}, 0) as ${typeVar}).
        OPTIONAL {
          ${authorTitleVar} dbo:employer ${authorEmployerVar}
        }.
        OPTIONAL {
          ${authorTitleVar} dbo:birthDate ${authorBirthDateVar}
        }.
        OPTIONAL {
          ${authorTitleVar} dbo:abstract ${authorAbstractVar}.
          filter(langMatches(lang(${authorAbstractVar}), ${langLiteral}))
        }.
      } UNION {
        values ${authorTitleVar} {${nameIriRefString}}.
        bind(exists {?m a dbo:Manga. ?m dbo:author ${authorTitleVar}.} as ?is).
        bind(IF(?is=1, ${authorTypeLiteral}, 0) as ${typeVar}).
        OPTIONAL {
          ${authorTitleVar} dbo:employer ${authorEmployerVar}
        }.
        OPTIONAL {
          ${authorTitleVar} dbo:birthDate ${authorBirthDateVar}
        }.
        OPTIONAL {
          ${authorTitleVar} dbo:abstract ${authorAbstractVar}.
          filter(langMatches(lang(${authorAbstractVar}), ${langLiteral}))
        }.
      } UNION {
        values ${characterTitleVar} {${nameIriRefString}}.
        bind(exists {${characterTitleVar} a dbo:FictionalCharacter.} as ?is).
        bind(IF(?is=1, ${characterTypeLiteral}, 0) as ?x).
        OPTIONAL {
          ${characterTitleVar} dbo:creator ${characterAuthorVar}
        }.
        OPTIONAL {
          ${characterTitleVar} dbo:abstract ${characterAbstractVar}.
          filter(langMatches(lang(${characterAbstractVar}), ${langLiteral}))
        }.
      } UNION {
        values ${mangaTitleVar} {${nameIriRefString}}.
        bind(exists {${mangaTitleVar} a dbo:Manga.} as ?is).
        bind(IF(?is=1, ${mangaTypeLiteral}, 0) as ?x).
        OPTIONAL {
          ${mangaTitleVar} dbo:author ${mangaAuthorVar}
        }.
        OPTIONAL {
          ${mangaTitleVar} dbo:numberOfVolumes ${mangaVolumesVar}
        }.
        OPTIONAL {
          ${mangaTitleVar} dbo:firstPublicationDate ${mangaPublicationDateVar}
        }.
        OPTIONAL {
          ${mangaTitleVar} dbo:illustrator ${mangaIllustratorVar}
        }.
        OPTIONAL {
          ${mangaTitleVar} dbo:publisher ${mangaPublisherVar}
        }.
        OPTIONAL {
          ${mangaTitleVar} dbo:abstract ${mangaAbstractVar}.
          filter(langMatches(lang(${mangaAbstractVar}), ${langLiteral}))
        }.
      }
      filter(?is != 0).
    }
  `;

  const sparqlResult: sparql.SelectResult = await dbpediaUtils.selectQuery(query, httpIO);
  return sparqlToResult(sparqlResult);
}

/**
 * Transform a sparql raw search result into a usable search result.
 *
 * @param sparqlResult The raw sparql result.
 */
export function sparqlToResult(sparqlResult: sparql.SelectResult): SearchResult | null {
  const bindings: sparql.SelectBinding[] = sparqlResult.results.bindings;

  for (const binding of bindings) {
    if (!binding[sparqlVariables.type]) {
      continue;
    }
    const type: sparql.RdfTerm = binding[sparqlVariables.type];
    switch (type.value) {
      case sparqlLiterals.mangaType:
        return mangaSparql.sparqlToManga(sparqlResult);
      case sparqlLiterals.animeType:
        return animeSparql.sparqlToAnime(sparqlResult);
      case sparqlLiterals.authorType:
        return authorSparql.sparqlToAuthor(sparqlResult);
      case sparqlLiterals.characterType:
        return characterSparql.sparqlToCharacter(sparqlResult);
      default:
        console.warn(`Got unexpected type: ${type.value}`);
    }
  }

  return null;
}
