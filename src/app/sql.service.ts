import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SQLService {

  sqlurl = '/shouxu/sql.php'
  constructor(private http: HttpClient) { }

  insertData(tableName:string,tableData: any) {
    let sql = "insert into `" + tableName +  "` (";

    for (const key in tableData) {
      sql += "`"+key+"`" + ',';
    }
    sql = sql.substr(0, sql.length - 1);
    sql += ") values (";

    for (const key in tableData) {
      sql += ("'"+tableData[key] +"',");
    }
    sql = sql.substr(0, sql.length - 1);
    sql += ')'

    console.log(sql)

    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
  }

  insertCase(tableData){
    let sql = `insert into \`lawCase\` (caseNumber,caseName,caseContent) values('${tableData.caseNumber}','${tableData.caseName}','${tableData.caseContent}') ON DUPLICATE KEY UPDATE caseName=VALUES(caseName),caseContent = values(caseContent)`
    console.log(sql)
    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
  }

  getCases(){
    let sql = `select * from lawCase `;
    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
  }

  getDzgjRecords(caseID){
    let sql = `select * from dzgj where caseID = ${caseID} order by addDate desc`;
    console.log(sql)
    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
  }

  delRecord(id){
    let sql = `delete from record where id =  ${id}`;
    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
  }

  getCaseId(caseNumber){
    let sql = `select id from \`case\` where caseNumber = '${caseNumber}'`
    console.log(sql)
    return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
  }
}
