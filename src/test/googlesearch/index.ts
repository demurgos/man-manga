import * as fs from "fs";
import * as path from "path";

export function readFile(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const absolutePath: string = path.join(__dirname, filename);
    fs.readFile(absolutePath, "utf8", function(err: Error | null, data: string) {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });
}
