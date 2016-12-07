declare module "watson-developer-cloud" {
  declare namespace watson {
    export interface AlchemyLanguageOptions {
      api_key: string;
    }

    export interface TextOptions {
      url: string;
    }

    export interface TextResult {
      status: "OK" | "ERROR";
      language: string;
      url: string;
      text: string;
    }

    export class AlchemyLanguage {
      text(params: TextOptions, callback?: (err: Error) => any);
      text(params: TextOptions, callback?: (err: Error | null, res: string) => any);
    }

    export function alchemy_language(options: AlchemyLanguageOptions): AlchemyLanguage;
  }

  export = watson;
}
