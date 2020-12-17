import { Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import domtoimage from 'dom-to-image';
import * as download from 'downloadjs'
import { PreviewComponent } from '../preview/preview.component';
import { PhpFunctionName } from './php-function-name';
import * as toastr from 'toastr'
import { State } from '../state';
import { first } from 'rxjs/operators';

export abstract class Shouxu {

  @Input() isSeal: boolean;
  //填表人选择列表
  users: Array<any>
  //单位
  unit: string;
  //单位的法律文号，例如吉公
  unit_1: string;

  // 填表日期
  private _createDate;
  get createDate() {
    if (!this._createDate)
      this._createDate = moment();
    return this._createDate;
  }

  set createDate(value) {
    this._createDate = value;
  }

  //案件信息
  caseName: string;
  caseNumber: string;
  caseContent: string;
  lawCaseID: string;

  public set caseData(value) {
    console.log('parent set caseData')
    this.lawCaseID = value.lawCaseID;
    this.caseName = value.caseName;
    this.caseNumber = value.caseNumber;
    this.caseContent = value.caseContent;
  }

  //隐藏原始表格的style->display
  isShowPrint: string = 'none';

  @Output() saveComplete: EventEmitter<any>;
  constructor() {
    this.saveComplete = new EventEmitter()
  }

  //子类复写的方法
  //设置数据，当点击案件或具体手续时设置相应数据
  abstract set data(value)

  //清理表单上显示的数据
  abstract clear();

  //保存数据前的验证数据是否有效
  abstract validate();

  //获取提交保存的数据
  abstract getTableData(caseID);

  //子类提供dialog的实例
  abstract getDialogInstance();

  //子类提供sql的实例
  abstract getSqlInstance();

  //子类提供保存的文件名字
  abstract getSaveFileName();

  //设置不选择案件就无法进行
  private isRemove;
  public get rootStyle() {
    // return this.lawCaseID ? :
    if (this.lawCaseID) {
      if (!this.isRemove) {
        toastr.remove()
        this.isRemove = true;
      }
      return { opacity: 1, pointerEvents: 'all' }
    }
    else {
      this.isRemove = false;
      toastr.options.preventDuplicates = true;
      toastr.warning('请先选择案件')
      //半透明，无法点击
      return { opacity: 0.4, pointerEvents: 'none' }
    }
  }


  //保存图片
  toImage() {
    this.isShowPrint = 'block'
    setTimeout(() => {
      domtoimage.toPng(document.getElementById('print'), { bgcolor: 'white' })
        .then(dataUrl => {
          download(dataUrl, `${this.getSaveFileName()}.jpg`);
          this.isShowPrint = 'none';
        });
    }, 0.5);
  }

  //打印
  //隐藏的打印按钮，子类html中必须有个按钮
  @ViewChild('btnPrint', { static: false })
  btnPrint: ElementRef
  print() {
    this.btnPrint.nativeElement.click()
  }

  //预览 子类中预览的内容id必须为print
  preview() {
    this.isShowPrint = 'block'
    setTimeout(() => {
      domtoimage.toPng(document.getElementById('print'), { bgcolor: 'white' })
        .then(dataUrl => {
          console.log(dataUrl);
          this.isShowPrint = 'none';
          let dialog = this.getDialogInstance()
          dialog.open(PreviewComponent, { data: { src: dataUrl } })
        });
    }, 0.5);
  }

  //保存
  save(caseID) {
    console.log('save data')
    if (!this.validate())
      return;
    let tableData = this.getTableData(caseID)
    let data = {
      tableName: State.currentState.value,
      tableData: tableData
    }

    this.getSqlInstance().exec(PhpFunctionName.INSERT, data)
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

  //获取手写的日期
  getYearImg(p, level) {
    let year = this.createDate.get('year') + '';
    let year_p = year.substr(p - 1, 1);
    return `assets/${year_p}_${level}.png`
  }

  getMonthImg(p, level) {
    let month = this.getMonth(this.createDate) + ''
    let month_p = month.substr(p - 1, 1);
    return `assets/${month_p}_${level}.png`;
  }

  getDayImg(p, level) {
    console.log(p, level)
    let day = this.getDay(this.createDate) + ''
    let day_p = day.substr(p - 1, 1);
    return `assets/${day_p}_${level}.png`
  }

  isDoubleDigit_month() {
    return this.getMonth(this.createDate) >= 10;
  }

  isDoubleDigit_day() {
    return this.getDay(this.createDate) >= 10
  }

  get createDate_china() {
    return this.createDate.format('YYYY年MM月DD日')
  }

  //获取年月日
  getYear(moment) {
    if (moment)
      return moment.get('year')
  }

  getMonth(moment) {
    if (moment)
      return moment.get('month') + 1;
  }

  getDay(moment) {
    if (moment)
      return moment.get('date');
  }

  //字符串是否为空
  isEmptyStr(str: string) {
    let str1 = str.trim();
    if (str1 == undefined || str1 == null || str1 == '')
      return true;
    return false;
  }

  //日期转中文
  toChineseDate(moment) {
    const cn = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九", ''];
    let s = [];

    let YY = moment.year().toString();
    for (var i = 0; i < YY.length; i++) {
      s.push(cn[YY.charAt(i)]);
    }
    s.push("年");

    let MM = moment.month() + 1;
    if (MM < 10)
      s.push(cn[MM]);
    else {
      let second = MM % 10;
      s.push("十")
      if (second != 0) s.push(cn[second])
    }
    s.push('月');

    let d = moment.date();
    if (d < 10) {
      s.push(cn[d])
    } else {
      let first = Math.floor(d / 10);
      if(first == 1) first = 10;
      let second = d % 10;
      if(second == 0) second = 10;
      s.push(cn[first] + '十' + cn[second])
    }
    // console.log(s)
    s.push("日");
    return s.join('');
  }

  getValidate(value, warning) {

  }
}
