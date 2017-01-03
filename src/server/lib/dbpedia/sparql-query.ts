// https://www.w3.org/TR/2013/REC-sparql11-query-20130321/#rIRIREF
export interface IriRef {
  type: "IriRef";
  value: string;
}

/**
 * Stringify an IRIREF node of the Sparql query's AST.
 *
 * https://www.w3.org/TR/2013/REC-sparql11-query-20130321/#rIRIREF
 *
 * @param node
 */
export function formatIriRef(node: IriRef): string {
  return `<${node.value}>`;
}
