// import * as url from "url";
// import * as io from "../../lib/interfaces/io";
// import requestIO from "./request-io";
//
// export interface GoogleSearchOptions {
//   noHtml: boolean;
// }
//
// export interface ResultItem {
//   title: string;
//   snippet: string;
//   link: string;
// }
//
// const API_PROTOCOL: string = "https";
// const API_HOST: string = "www.google.fr";
// const API_URI = url.format({protocol: API_PROTOCOL, host: API_HOST});
// const DEFAULT_OPTIONS: GoogleSearchOptions = {
//   noHtml: true
// };
//
// function normalizeOptions(options: GoogleSearchOptions | null): GoogleSearchOptions {
//   const result: GoogleSearchOptions = Object.assign({}, DEFAULT_OPTIONS);
//   if (options !== null) {
//     Object.assign(result, options);
//   }
//   return result;
// }
//
// export async function query(query: string, options: GoogleSearchOptions | null): Promise<ResultItem[]> {
//   options = normalizeOptions(options);
//
//   const ioOptions: io.GetOptions = {
//     uri: API_URI,
//     queryString: {
//       q: query
//     }
//   };
//
//   const response: io.Response = await requestIO.get(ioOptions);
//   return scrapSearchResult(response.body);
// }
//
// export function scrapSearchResult(html: string): ResultItem[] {
//   const resultItems: ResultItem[] = [];
//
//   $ = cheerio.load(html);
//
//   return resultItems;
// }
//
// const runExample = false;
//
// if (runExample) {
//   query("Goku", null)
//     .then(
//       (result) => {
//         console.log(result);
//       },
//       (err) => {
//         console.error(err);
//       }
//     );
// }
