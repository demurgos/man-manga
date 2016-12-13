import * as Bluebird from 'bluebird';
import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {Manga} from "../../../lib/interfaces/manga.interface";

@Injectable()
export class ApiService {

  public getManga(name: string): Bluebird<Manga> {
    return Bluebird.reject(new Error("ApiService.getManga is not implemented yet"));
  }
}