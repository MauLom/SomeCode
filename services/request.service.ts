import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from '../utilities/constants'

@Injectable({
  providedIn: "root"
})
export class RequestService {
  private google: any;
  private cs = new Constant();
  constructor(
    private httpClient: HttpClient,
   
  ) { }

  getGoogle() {
    return this.google;
  }

  getRequest(apiName: string, params?: any):any {
    let parametros = "";
    if (params) {
      let queryString = "";
      for (let param of params) {
        queryString += "&" + JSON.stringify(param).replace("{", "").replace("}", "").replace(/"/g, '').split(":")[0];
        queryString += "=";
        queryString += JSON.stringify(param).replace("{", "").replace("}", "").replace(/"/g, '').split(":")[1];
      }
      if (queryString != "") {
        parametros += "?b=" + localStorage.getItem("b") + "&s4_key=" + this.cs.S4_KEY + queryString;

      }
    } else {
      parametros += "?b=" + localStorage.getItem("b") + "&s4_key=" + this.cs.S4_KEY;
    }
    return this.httpClient.get(this.cs.URL + apiName + parametros)
  }


  getRequestRemote(projectName: string, apiName: string, params?: any):any {
    let parameters: string = "";
    if (params) {
        let queryString = "";
        for (let param of params) {
            queryString += "&" + JSON.stringify(param).replace("{", "").replace("}", "").replace(/"/g, '').split(":")[0];
            queryString += "=";
            queryString += JSON.stringify(param).replace("{", "").replace("}", "").replace(/"/g, '').split(":")[1];
        }
        if (queryString != "") {
            parameters += "?b=" + localStorage.getItem("b") + "&s4_key=" + this.cs.S4_KEY + queryString;

        }
    } else {
        parameters += "?b=" + localStorage.getItem("b") + "&s4_key=" + this.cs.S4_KEY;
    }
    return this.httpClient.get(projectName + apiName + parameters);
}


}
