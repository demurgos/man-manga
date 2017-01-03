/**
 * Internationalized Resouce Identifier
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-encode-terms
 */
export interface Iri {
  type: "uri";
  value: string;
}

/**
 * Literal
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-encode-terms
 */
export interface Literal {
  type: "literal";
  value: string;
}

/**
 * Literal with language tag
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-encode-terms
 */
export interface TaggedLiteral {
  "type": "literal";
  "value": string;
  "xml:lang": string;
}

/**
 * Literal with datatype IRI
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-encode-terms
 */
export interface TypedLiteral {
  type: "literal";
  value: string;
  datatype: string;
}

/**
 * Blank node
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-encode-terms
 */
export interface BlankNode {
  type: "bnode";
  value: string;
}

export type RdfTerm = Iri | Literal | TaggedLiteral | TypedLiteral | BlankNode;

/**
 * A variables binding
 *
 * https://www.w3.org/TR/sparql11-results-json/#select-bindings
 */
export interface SelectBinding {
  [varName: string]: RdfTerm;
}

/**
 * The result of a Sparql SELECT query
 *
 * https://www.w3.org/TR/sparql11-results-json/
 */
export interface SelectResult {
  head: {
    vars: string[];
    link?: string[];
  };
  results: {
    bindings: SelectBinding[];
  };
}

/**
 * The result of a Sparql ASK query
 *
 * https://www.w3.org/TR/sparql11-results-json/
 */
export interface AskResult {
  head: {
    link?: string[];
  };
  boolean: boolean;
}
