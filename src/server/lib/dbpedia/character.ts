import {Author, Character} from "../../../lib/interfaces/resources/index";
import {retrieveAuthor} from "./author";
import * as sparql from "./sparql";
import * as sparqlQuery from "./sparql-query";
import * as dbpediaUtils from "./utils";

/**
 * A map between a sparql variable and its name
 */
// tslint:disable-next-line:typedef
export const sparqlVariables = {
  title: "characterTitle",
  author: "characterAuthor",
  abstract: "characterAbstract"
};

/**
 * Returns all available information about the character `characterName`.
 *
 * @param characterName The character's name.
 */
export async function retrieveCharacter(characterName: string): Promise<Character | null> {
  const character: Character | null = await getCharacterInfos(characterName);
  if (character === null) {
    return null;
  }

  if (character.creator !== undefined) {
    const creatorName: string = character.creator.name;
    try {
      const creator: Author | null = await retrieveAuthor(creatorName);
      if (creator !== null) {
        character.creator = creator;
      }
    } catch (err) {
      // Ignore error when loading more data: keep only the name and type
    }
  }

  return character;
}

/**
 * Returns basic information about the character 'resourceIri'.
 * @param resourceIri The character's name.
 * @param lang The lang in which the abstract is wanted. Default to english.
 */
export async function getCharacterInfos(resourceIri: string, lang: string = "en"): Promise<Character | null> {
  // TODO: dbo:voiceActor

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
      ${titleVar} a dbo:FictionalCharacter.
      OPTIONAL {
        ${titleVar} dbo:creator ${authorVar}
      }.
      OPTIONAL {
        ${titleVar} dbo:abstract ${abstractVar}.
        filter(langMatches(lang(${abstractVar}), ${langLiteral}))
      }.
    }
  `;

  const sparqlResult: sparql.SelectResult = await dbpediaUtils.selectQuery(query);
  return sparqlToCharacter(sparqlResult);
}

/**
 * Transforms an object coming from a sparql request's response
 * into a character.
 *
 * @param sparqlResult The result coming from a response to a sparql request.
 */
export async function sparqlToCharacter(sparqlResult: sparql.SelectResult): Promise<Character | null> {
  const data: {[varName: string]: Set<string>} = dbpediaUtils.mergeSelectBindings(sparqlResult.results.bindings);
  const collectedVariables: Set<string> = new Set();

  // name
  let name: string | undefined;
  if (sparqlVariables.title in data) {
    name = data[sparqlVariables.title].values().next().value;
    collectedVariables.add(sparqlVariables.title);
  }

  // creator
  let creator: Author | undefined;
  if (sparqlVariables.author in data) {
    const creatorIri: string = data[sparqlVariables.author].values().next().value;
    const creatorResult: Author | null = await retrieveAuthor(creatorIri);
    if (creatorResult !== null) {
      creator = creatorResult;
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

  if (name === undefined) {
    return null;
  }

  return {
    type: "character",
    name: await dbpediaUtils.getLabel(name),
    creator,
    abstract: snippet,
    others
  };
}
