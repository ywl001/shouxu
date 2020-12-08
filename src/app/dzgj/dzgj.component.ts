import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MatDialog } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { SQLService } from '../services/sql.service';
import * as toastr from 'toastr'

import { Shouxu } from '../models/shouxu';
import { PhpFunctionName } from '../models/php-function-name';
import { ChangeDetectorRef } from '@angular/core';
import { State } from '../state';
import { concatAll } from 'rxjs/operators';

@Component({
  selector: 'app-dzgj',
  templateUrl: './dzgj.component.html',
  styleUrls: ['./dzgj.component.css'],
  providers: [//和格式化日期相关
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DzgjComponent extends Shouxu {

  /////////////////////////////////////////////////////////和html绑定的变量/////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //是否手动设置起止日期
  isManual: boolean;
  startDate: any;
  endDate: any;

  // 填表人
  private _requestUser: string;
  public get requestUser(): string {
    return this._requestUser;
  }

  public set requestUser(value: string) {
    this._requestUser = value;
    let user = this.getUser(value);
    if (user) {
      this.userPhone = user.phoneNumber;
      this.feedbackWay = user.email;
    }
  }
  //联系电话
  userPhone: string;
  //反馈方式
  feedbackWay: string;
  //查询说明
  cause: string;
  //文书编号
  docNumber: string;
  // 六个号码
  number1: string;
  number2: string;
  number3: string;
  number4: string;
  number5: string;
  number6: string;

  //查询时间段,表中填写
  get duration() {
    if (this.isManual) {
      if (this.startDate && this.endDate) {
        let before = this.startDate.format('YYYY年MM月DD日');
        let now = this.endDate.format('YYYY年MM月DD日')
        return `${before}至${now}`
      }
    }
    if (this.createDate) {
      let copyDate = this.createDate.clone();
      let before = copyDate.subtract(3, 'months').add(1, 'days').format('YYYY年MM月DD日');
      let now = this.createDate.format('YYYY年MM月DD日')
      return `${before}至${now}`
    }
    return ""
  }

  //号码个数的大写
  get upCount() {
    let count = this.phoneNumbers.split('|').length;
    let arr = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
    return arr[count];
  }

  //////////////////////////////////////////////构造方法////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  constructor(
    private sql: SQLService,
    public dialog: MatDialog) {
    super();
    console.log('dzgj constructor');
  }

  ngOnInit() {
    this.getDocNumber();
  }

  ////////////////////////////////////////复写基类中的方法////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
  set data(value) {
    console.log('dzgj set data')
    if (value) {
      this.createDate = moment(value.createDate);
      this.requestUser = value.requestUser;
      this.userPhone = value.userPhone;
      this.cause = value.cause;
      this.phoneNumbers = value.phoneNumber;
      if (value.startDate && value.endDate) {
        this.isManual = true;
        this.startDate = moment(value.startDate)
        this.endDate = moment(value.endDate)
      }
      this.caseNumber = value.caseNumber;
      this.caseName = value.caseName;
      this.caseContent = value.caseContent;
      this.docNumber = value.docNumber;
      console.log(this.docNumber)
    }
  }

  private set phoneNumbers(phoneNumber) {
    if (phoneNumber) {
      let numbers = phoneNumber.split('|')
      for (let i = 0; i < numbers.length; i++) {
        eval("this.number" + (i + 1) + "= numbers[i]")
      }
    }
  }

  //提交数据库前的验证
  validate() {
    if (!this.lawCaseID) {

      toastr.warning('请选择一个案件，没有请先添加案件');
      return false;
    }
    if (this.phoneNumbers.trim() == '') {
      console.log('fffffffff')
      toastr.warning('没有填写号码')
      return false;
    }
    return true;
  }

  //获取提交的数据
  getTableData(lawcaseID) {
    console.log('get table data')
    let createDate = this.createDate.format('YYYY/MM/DD')
    let endDate = this.endDate ? this.endDate.format('YYYY/MM/DD') : createDate;
    let tableData = {
      caseID: lawcaseID,
      createDate: createDate,
      cause: this.cause,
      phoneNumber: this.phoneNumbers,
      requestUser: this.requestUser ? this.requestUser : '姚伟立',
      userPhone: this.userPhone ? this.userPhone : '15838811277',
      startDate: this.getStartDate(),
      endDate: endDate,
      docNumber: this.docNumber,
      feedbackWay: this.feedbackWay
    }
    return tableData;
  }

  getSqlInstance() {
    return this.sql;
  }

  getDialogInstance() {
    return this.dialog;
  }

  getSaveFileName() {
    return `${this.number1}等号码查询审批表`
  }

  clear() {
    this.requestUser = this.userPhone = this.cause = this.feedbackWay = '';
    this.number1 = this.number2 = this.number3 = this.number4 = this.number5 = this.number6 = '';
    this.startDate = this.endDate = this.createDate = null;
    this.isManual = false;
    this.getDocNumber();
  }

  //////////////////////////////////////////其他方法//////////////////////////////////////////////////////
  // 获取起始时间,提交数据库,手动填写和自动生成的判断
  private getStartDate() {
    if (this.startDate && this.endDate) {
      return this.startDate.format('YYYY/MM/DD');
    }
    let copyDate = this.createDate.clone();
    return copyDate.subtract(3, 'months').add(1, 'days').format('YYYY/MM/DD');
  }

  /**
 * 获取号码列表和号码组成的字符串 13939999999|13838888888
 */
  private get phoneNumbers() {
    let strNumbers = ''
    let arrNumber = [this.number1, this.number2, this.number3, this.number4, this.number5, this.number6];
    for (let index in arrNumber) {
      let number = arrNumber[index]
      if (number !== undefined && number != '' && number != null) {
        strNumbers += number + '|';
      }
    }
    return strNumbers.substr(0, strNumbers.length - 1)
  }

  //获取新建文书的编号
  private getDocNumber() {
    this.sql.exec(PhpFunctionName.SELECT_LAST_DOCUMENT_NUMBER, State.dzgj.value).subscribe(
      res => {
        if (res.length == 0) {
          this.docNumber = moment().get('year') + '-1'
        } else {
          let lastDocNumber = res[0]['docNumber']
          let arr = lastDocNumber.split('-');
          let year = arr[0];
          let xuhao = (year == moment().get('year') + '') ? (parseInt(arr[1]) + 1) + '' : 1 + ''
          this.docNumber = moment().get('year') + '-' + xuhao;
        }
      }
    )
  }

  //获取当前填表人信息
  private getUser(userName) {
    for (let i = 0; i < this.users.length; i++) {
      const user = this.users[i];
      if (user.name == userName)
        return user
    }
    return null
  }
}