import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SQLService {

  sqlUrl = '/shouxu/sql.php'
  constructor(private http: HttpClient) { }

  exec(phpFunc,data){
    console.log(phpFunc)
    return this.http.post<any>(this.sqlUrl, { 'func': phpFunc, 'data': data })
  }


//   insertData(tableName:string,tableData: any) {
//     let sql = "insert into `" + tableName +  "` (";

//     for (const key in tableData) {
//       sql += "`"+key+"`" + ',';
//     }
//     sql = sql.substr(0, sql.length - 1);
//     sql += ") values (";

//     for (const key in tableData) {
//       sql += ("'"+tableData[key] +"',");
//     }
//     sql = sql.substr(0, sql.length - 1);
//     sql += ')'

//     console.log(sql)

//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
//   }

//   insertCase(tableData){
//     let sql = `insert into \`lawCase\` (caseNumber,caseName,caseContent) values('${tableData.caseNumber}','${tableData.caseName}','${tableData.caseContent}') ON DUPLICATE KEY UPDATE caseName=VALUES(caseName),caseContent = values(caseContent)`
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
//   }

//   getCases(){
//     let sql = `select * from lawCase `;
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }

//   getData(){
//     let sql =  `select lawCase.id lawCaseID,caseNumber,caseName,caseContent,caseContent,dzgj.id,createDate,cause,phoneNumber,requestUser,userPhone,startDate,endDate
//     from lawCase left join dzgj on lawCase.id = dzgj.lawCaseID 
//  `
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }
  
//   getDzgjRecords(){
//     let sql = `select lawcase.id lawCaseID,caseNumber,caseName,caseContent,dzgj.id,createDate,cause,phoneNumber,requestUser,userPhone,startDate,endDate 
//     from dzgj left join lawCase on dzgj.lawCaseID = lawCase.id order by createDate desc`;
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }

//   getDzgjRecords2(){
//     let sql = `select lawcase.id lawCaseID,caseNumber,caseName,caseContent,dzgj.id,createDate,cause,phoneNumber,requestUser,userPhone,startDate,endDate 
//     from lawCase left join dzgj on dzgj.lawCaseID = lawCase.id order by createDate desc`;
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }

//   getDqzjRecords2(){
//     let sql = `select lawcase.id lawCaseID,caseNumber,caseName,caseContent,dqzj.id,docNumber,company,evidenceContent,createDate
//      from lawCase left join dqzj on dqzj.lawCaseID = lawCase.id order by createDate desc`;
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }
//   getDqzjRecords(){
//     let sql = `select lawcase.id lawCaseID,caseNumber,caseName,caseContent,dqzj.id,docNumber,company,evidenceContent,createDate
//      from dqzj left join lawCase on dqzj.lawCaseID = lawCase.id order by createDate desc`;
//     console.log(sql)
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }

//   del(tableName,id){
//     let sql = `delete from ${tableName} where id =  ${id}`;
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
//   }

//   delDzgj(id){
//     let sql = `delete from dzgj where id =  ${id}`;
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
//   }

//   delDqzj(id){
//     let sql = `delete from dqzj where id =  ${id}`;
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'edit'});
//   }

//   getLastDocNumber(){
//     let sql = `select * from dqzj order by id desc limit 1`;
//     return this.http.post<any>(this.sqlurl,{'sql':sql,'action':'select'})
//   }

}
