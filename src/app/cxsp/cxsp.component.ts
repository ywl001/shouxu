import { variable } from '@angular/compiler/src/output/output_ast';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import * as moment from 'moment';
import { Shouxu } from '../models/shouxu';
import { SQLService } from '../services/sql.service';
import { State } from '../state';
import * as toastr from 'toastr'
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';


@Component({
  selector: 'app-cxsp',
  templateUrl: './cxsp.component.html',
  styleUrls: ['./cxsp.component.css'],
  providers: [//和格式化日期相关
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})

export class CxspComponent extends Shouxu {
  
  users;
  moneyTypes;

  requestUser1:string = '张延峰:13938850777';
  requestUser2:string = '蒋勉丽:13938860695';
  
  cause:string = ''
  needs:string = ''

  constructor(public dialog:MatDialog,private sql:SQLService) {
    super();
    this.saveComplete = new EventEmitter()
  }

  ngOnInit() {
  }

  set data(value: any) {
    this.createDate = moment(value.createDate);
    this.cause = value.cause;
    this.needs = value.needs;
    this.requestUser1 = value.requestUser1;
    this.requestUser2 = value.requestUser2;
  }

  validate() {
    if(!this.lawCaseID){
      toastr.warning('请选择案件')
      return false
    }
    if(this.isEmptyStr(this.cause)){
      toastr.warning('请填写查询依据')
      return false;
    }
    if(this.isEmptyStr(this.needs)){
      toastr.warning('请填写查询需求');
      return false;
    }
    return true;
  }
  getTableData(caseID: any) {
    let createDate = this.createDate.format('YYYY/MM/DD')
    let tableData = {
      caseID:caseID,
      cause:this.cause,
      needs:this.needs,
      createDate:createDate,
      requestUser1:this.requestUser1,
      requestUser2:this.requestUser2
    }
    return tableData;
  }
  getSqlInstance(){
    return this.sql;
  }

  getDialogInstance(){
    return this.dialog;
  }

  getSaveFileName(){
    return '提请反诈中心数据查询审批表'
  }

  clear() {
    this.needs = this.cause = ''
  }
}
