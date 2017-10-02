import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import {Http, Response} from '@angular/http'


@Injectable()
export class ProcessHttpmsgService {

  constructor() { }

  public extractData(res: Response){
    let body = res.json()

    return body || { }
  }

}
