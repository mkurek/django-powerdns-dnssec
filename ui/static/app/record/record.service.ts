import { Injectable } from "@angular/core";
import { URLSearchParams, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { ConfigService } from "../config.service";
import { Record } from "./record";
import { HttpClient } from "../http-client";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";


@Injectable()
export class RecordService {

  constructor(
    private http: HttpClient,
    private configervice: ConfigService
  ) { }

  getRecords(search: URLSearchParams): Observable<Response>  {
    let url: string = this.configervice.apiRecord;
    return this.http.get(url, search).catch(this.handleError);
  }

  getRecordById(id: string): Observable<Record> {
    let url: string = `${this.configervice.apiRecord}${id}/`;
    return this.http.get(url).map(
        this.extractSingleData
    ).catch(this.handleError);
  }

  updateOrCreateRecord(record: Record): Observable<Record> {
    let url: string = this.configervice.apiRecord;
    let body = JSON.stringify(record);
    let request: any;
    if (record.id) {
      url = `${this.configervice.apiRecord}${record.id}/`;
      request = this.http.patch(url, body);
    } else {
      request = this.http.post(url, body);
    }

    return request.map(
        this.extractSingleData
    ).catch(this.handleError);
  }

  deleteRecord(record: Record) {
    let url: string = `${this.configervice.apiRecord}${record.id}/`;
    return this.http.delete(url).catch(this.handleError);
  }

  private extractSingleData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
        throw new Error("Bad response status: " + res.status);
    }
    let body = res.json();
    return body || {};
  }

  private handleError(response: any) {
    if (response.status === 400) {
      let errors: string = "";
      let body = JSON.parse(response._body);
      for (let i in body) {
        errors += `${i}: ${body[i][0]}`;
      }
      return Observable.throw(errors);
    }
    let errMsg = response.message || "Server error";
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
