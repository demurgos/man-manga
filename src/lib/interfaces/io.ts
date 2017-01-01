import {Dictionary} from "../utils";

export interface BaseOptions {
  uri: string;
  // jar: request.CookieJar;
  headers?: Dictionary<any>;
  queryString?: Dictionary<any>;

  /**
   * Encoding of the response, use `null` to get a Buffer instead of a string.
   *
   * Default: "utf8"
   */
  encoding?: "utf8" | null;
}

export interface GetOptions extends BaseOptions {

}

export interface PostOptions extends BaseOptions {
  form?: any;
  body?: any;
}

export type PutOptions = PostOptions;

export interface Response {
  statusCode: number;
  body: string;
  headers: Dictionary<any>;
}

export interface IO {
  get (options: GetOptions): PromiseLike<Response>;
  post (options: PostOptions): PromiseLike<Response>;
  put (options: PutOptions): PromiseLike<Response>;
}
