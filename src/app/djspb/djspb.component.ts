import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { Shouxu } from '../models/shouxu';
import * as toastr from 'toastr'
import * as pinyin from 'pinyin'
import { State } from '../state';
import { SQLService } from '../services/sql.service';
import { PhpFunctionName } from '../models/php-function-name';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-djspb',
  templateUrl: './djspb.component.html',
  styleUrls: ['./djspb.component.css'],
  providers: [//和格式化日期相关
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DjspbComponent extends Shouxu {
  //////////////////////////////////////////////////////////和html直接绑定的变量////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  users: Array<any>;
  //冻结通知书最后10条信息
  freezeInfo;
  //法律文书编号
  docNumber: string;
  //冻结类型
  freezeType: string;
  //冻结的账号
  freezeNumber: string;
  //承办人
  private _requestUser1: string = '蒋勉丽';
  public get requestUser1(): string {
    return this._requestUser1;
  }
  public set requestUser1(value: string) {
    this._requestUser1 = value;
    if (this.getUser(value))
      this.userPhone = this.getUser(value).phoneNumber;
  }
  requestUser2: string = '牛萌萌';
  //联系电话
  userPhone: string = '13938860695';

  numList = 10

  //冻结类型，配置文件获取
  @Input() freezeTypes: Array<string>;

  getDocNumbers(value) {
    let year = this.getYear(this.createDate);
    let str = `${this.unit_1}（刑）冻财字[${year}]`;
    if (this.docNumber && this.docNumber.charAt(this.docNumber.length - 1) == '号')
      return `${this.docNumber}，${value}号`
    return str + value + `号`;
  }

  getFreezeNumbers(value){
    if(this.freezeNumber)
      return `${this.freezeNumber}，${value.freezeNumber}`
    return `${value.freezeNumber}`;
  }

  get requestUser() {
    return this.requestUser1 + " " + this.requestUser2;
  }

  get signal_minjing() {
    if (this.requestUser1) {
      return `assets/${pinyin(this.requestUser1, { style: pinyin.STYLE_NORMAL }).join('')}.png`;
    }
    return `assets/jiangmianli.png`
  }

  onImageError(e) {
    toastr.info('没有请求人的签名')
    e.target.src = `assets/jiangmianli.png`;
  }

  ///////////////////////////////////////////////////////////////构造/////////////////////////////////////////////////////////////////////
  numControl  =new FormControl();
  constructor(private sql: SQLService, public dialog: MatDialog) {
    super();
    this.saveComplete = new EventEmitter();
  }

  ngOnInit() {
    this.numControl.valueChanges.subscribe(
      value =>{
        this.getFreezeInfo()
      }
    )
  }

  /////////////////////////////////////////////////////////复写父类的方法///////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set caseData(value){
    this.lawCaseID = value.lawCaseID;
    this.caseName = value.caseName;
    this.caseNumber = value.caseNumber;
    this.caseContent = value.caseContent;
    this.getFreezeInfo()
  }

  getTableData(caseID: any) {
    return {
      createDate: this.createDate.format('YYYY/MM/DD'),
      docNumber: this.docNumber,
      freezeType: this.freezeType,
      freezeNumber: this.freezeNumber,
      requestUser1: this.requestUser1,
      requestUser2: this.requestUser2,
      userPhone: this.userPhone,
      caseID: caseID
    }
  }
  getSqlInstance() {
    return this.sql;
  }

  getDialogInstance() {
    return this.dialog;
  }

  set data(value: any) {
    this.docNumber = value.docNumber;
    this.freezeType = value.freezeType;
    this.freezeNumber = value.freezeNumber;
    this.requestUser1 = value.requestUser1;
    this.requestUser2 = value.requestUser2
    this.userPhone = value.userPhone;
    this.createDate = moment(value.createDate);
  }

  clear() {
    this.freezeNumber = this.docNumber = null;
  }

  validate() {
    if (!this.lawCaseID) {
      toastr.warning('请选择一个案件，没有请先添加案件');
      return false;
    }
    if (this.isEmptyStr(this.freezeNumber)) {
      toastr.warning('冻结账号没有填写');
      return false;
    }
    if (this.isEmptyStr(this.docNumber)) {
      toastr.warning('法律文书号没有填写');
      return false;
    }
    return true;
  }

  getSaveFileName() {
    const re = /\d{6}/g;
    const r = this.docNumber.match(re);
    const name = r[0]+ "--" + r[r.length-1];
    return name + '_冻结审批表'
  }

  
  private getUser(userName) {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.name == userName)
        return user
    }
    return null
  }

  getFreezeInfo() {
    let sql = `select * from ${State.djtzs.value} where caseID = '${this.lawCaseID}' order by id desc limit ${this.numList}`;
    console.log(sql)
    this.sql.exec(PhpFunctionName.GET_SELECT_RESULT, sql).subscribe(
      res => {
        this.freezeInfo = res;
      }
    )
  }
}
