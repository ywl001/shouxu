import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { Shouxu } from '../models/shouxu';
import { SQLService } from '../services/sql.service';
import * as toastr from 'toastr';
import * as pinyin from 'pinyin'
import { PhpFunctionName } from '../models/php-function-name';
import * as moment from 'moment';
import { State } from '../state';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dzspb',
  templateUrl: './dzspb.component.html',
  styleUrls: ['./dzspb.component.css'],
  providers: [//和格式化日期相关
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DzspbComponent extends Shouxu {
  //////////////////////////////////////////////////////////和html直接绑定的变量////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  users: Array<any>;
  //获取调证通知书最后十条内容
  dztzsInfo;
  //法律文书编号
  docNumber: string;
  //冻结类型
  queryType: string;
  //冻结的账号
  queryContent: string;
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

  numList = 10;

  //冻结类型，配置文件获取
  queryTypes: Array<string>;

  getDocNumbers(value) {
    let year = this.getYear(this.createDate);
    let str = `${this.unit_1}（刑）调证字[${year}]`;
    if (this.docNumber && this.docNumber.charAt(this.docNumber.length - 1) == '号')
      return `${this.docNumber}，${value}号`
    return str + value + `号`;
  }

  getQueryContent(value) {
    // const re = /[\w\@\.]{6,}(\(?（?[\u4e00-\u9fa5]{2,4}\)?）?)?/g
    const re = /[\w\@\.]{6,}/g
    let arr = value.match(re);
    if(!arr || arr.length ===0)
      return ""
    
    let r = arr.join(",");
    if (this.queryContent)
      return this.queryContent + '，' + r;
    return r;
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
  numControl:FormControl = new FormControl()
  constructor(private sql: SQLService, public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    console.log(this.createDate)
    this.getDztzsInfo();
    this.numControl.valueChanges.subscribe(
      value =>{
        this.getDztzsInfo()
      }
    )
  }

  /////////////////////////////////////////////////////////复写父类的方法///////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  set caseData(value){
    console.log('child set caseData')
    this.lawCaseID = value.lawCaseID;
    this.caseName = value.caseName;
    this.caseNumber = value.caseNumber;
    this.caseContent = value.caseContent;
    this.getDztzsInfo()
  }

  getTableData(caseID: any) {
    return {
      createDate: this.createDate.format('YYYY/MM/DD'),
      docNumber: this.docNumber,
      queryType: this.queryType,
      queryContent: this.queryContent,
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
    this.queryType = value.queryType;
    this.queryContent = value.queryContent;
    this.requestUser1 = value.requestUser1;
    this.requestUser2 = value.requestUser2
    this.userPhone = value.userPhone;
    this.createDate = moment(value.createDate);
  }

  clear() {
    this.docNumber = this.queryType = this.queryContent = null;
    this.createDate = null
  }

  validate() {
    if (!this.lawCaseID || this.isEmptyStr(this.lawCaseID)) {
      toastr.warning('请选择一个案件，没有请先添加案件');
      return false;
    }
    if (!this.queryContent || this.isEmptyStr(this.queryContent)) {
      toastr.warning('请填写查询内容');
      return false;
    }
    if (!this.queryType || this.isEmptyStr(this.queryType)) {
      toastr.warning('请填写查询类型');
      return false;
    }
    if (!this.docNumber || this.isEmptyStr(this.docNumber)) {
      toastr.warning('请填写法律文书号');
      return false;
    }
    return true;
  }

  getSaveFileName() {
    const re = /\d{6}/g;
    const r = this.docNumber.match(re);
    const name = r[0]+ "--" + r[r.length-1];
    return name + '_查询审批表'
  }

  //根据名字获取uer对象
  private getUser(userName) {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.name == userName)
        return user
    }
    return null
  }

  //获取调取证据通知书最后十条记录
  getDztzsInfo() {
    let sql = `select * from ${State.dztzs.value} where caseID = '${this.lawCaseID}' order by id desc limit ${this.numList}`;
    this.sql.exec(PhpFunctionName.GET_SELECT_RESULT, sql).subscribe(
      res => {
        this.dztzsInfo = res;
      }
    )
  }

}
