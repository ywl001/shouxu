import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, ComponentFactoryResolver } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { SQLService } from '../services/sql.service';
import * as toastr from 'toastr'

import domtoimage from 'dom-to-image';
import * as download from 'downloadjs'
import { Shouxu } from '../models/shouxu';
import { PhpFunctionName } from '../models/php-function-name';


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

  //和html绑定的变量

  //是否手动设置起止日期
  isManual: boolean;
  startDate: any;
  endDate: any;

  // 填表人和电话
  requestUser: string;
  userPhone: string;
  //查询说明
  cause: string;
  // 六个号码
  number1: string;
  number2: string;
  number3: string;
  number4: string;
  number5: string;
  number6: string;

  //从主界面输入的案件属性
  @Input() isSeal: boolean
  @Input() users: Array<string>;
  @Input() phones: Array<string>;

  //隐藏的打印按钮,因为只有该按钮click才能打印,没有找到代码控制打印
  @ViewChild('btnPrint', { static: false })
  btnPrint: ElementRef

  constructor(private sql: SQLService, private resolver: ComponentFactoryResolver) {
    super();
    console.log('dzgj constructor');
    this.saveComplete = new EventEmitter()
  }

  private _data: any;
  set data(value) {
    console.log('dzgj set data')
    if (value && this._data != value) {
      this._data = value;
      this.clear()
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
    }
  }

  get data() {
    return this._data;
  }

  get createDate_str() {
    if (!this.createDate)
      return ''
    return this.createDate.format('YYYY年MM月DD日')
  }

  private set phoneNumbers(phoneNumber) {
    if (phoneNumber) {
      let numbers = phoneNumber.split('|')
      for (let i = 0; i < numbers.length; i++) {
        eval("this.number" + (i + 1) + "= numbers[i]")
      }
    }
  }

  //------------------提交数据库的电子轨迹查询信息--------------------------------
  //--------------------------------------------------------------------------

  /**
   * 查询时间段,表中填写
   */
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

  isShowPrint = 'none'
  toImage() {
    if(!this.createDate) this.createDate = moment()
    this.isShowPrint = 'block'
    setTimeout(() => {
      domtoimage.toPng(document.getElementById('print'), { bgcolor: 'white' })
        .then(dataUrl => {
          download(dataUrl, `${this.number1}.jpg`);
          this.isShowPrint = 'none'
        });
    }, 0.5);
  }

  clear(){
    this.requestUser = this.userPhone = this.cause = '';
    this.number1 = this.number2 = this.number3 = this.number4 = this.number5 = this.number6 = '';
    this.startDate = this.endDate = this.createDate = null;
    this.isManual = false;
  }

  print() {
    if(!this.createDate) this.createDate = moment()
    this.btnPrint.nativeElement.click()
  }

  save(caseID) {
    console.log('save 电子轨迹')
    if (!this.validate())
      return;
    let tableData = this.getSqlData();
    tableData['caseID'] = caseID;
    let data={
      tableName:'dzgj',
      tableData:tableData
    }

    this.sql.exec(PhpFunctionName.INSERT,data)
      .subscribe(
        res => {
          if (res > 0) { 
            this.saveComplete.emit();
            this.clear();
            toastr.success('手续数据保存成功')
          }
        }
      )
  }

  private validate() {
    if(!this.caseNumber || this.caseNumber.trim()==''){
      toastr.warning('案件编号随便写一个都行')
      return false;
    }
    if(!this.caseName || this.caseName.trim()==''){
      toastr.warning('案件名称随便写一个都行')
      return false;
    }
    if (this.phoneNumbers.trim() == '') {
      toastr.warning('没有填写号码')
      return false;
    }
    return true;
  }

  private getSqlData() {
    if(!this.createDate) this.createDate = moment()
    let createDate = this.createDate.format('YYYY/MM/DD')
    let endDate = this.endDate ? this.endDate.format('YYYY/MM/DD') : createDate;
    return {
      createDate: createDate,
      cause: this.cause,
      phoneNumber: this.phoneNumbers,
      requestUser: this.requestUser ? this.requestUser : '姚伟立',
      userPhone: this.userPhone ? this.userPhone : '15838811277',
      startDate: this.getStartDate(),
      endDate: endDate
    }
  }

  // 获取起始时间,提交数据库,手动填写和自动生成的判断
  private getStartDate() {
    if (this.startDate && this.endDate) {
      return this.startDate.format('YYYY/MM/DD');
    }
    let copyDate = this.createDate.clone();
    return copyDate.subtract(3, 'months').add(1, 'days').format('YYYY/MM/DD');
  }

  /**
 * 获取号码列表和号码组成的字符串
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

  get upCount(){
    let count = this.phoneNumbers.split('|').length;
    let arr = new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖");
    return arr[count];
  }
}