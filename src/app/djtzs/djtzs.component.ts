import { toBase64String } from '@angular/compiler/src/output/source_map';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { PhpFunctionName } from '../models/php-function-name';
import { Shouxu } from '../models/shouxu';
import { SQLService } from '../services/sql.service';
import { State } from '../state';
import * as toastr from 'toastr'
import { AddUnfreezeComponent } from '../add-unfreeze/add-unfreeze.component';

declare var alertify;

@Component({
  selector: 'app-djtzs',
  templateUrl: './djtzs.component.html',
  styleUrls: ['./djtzs.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})

export class DjtzsComponent extends Shouxu {

  //////////////////////////////////////////////////////////和html直接绑定的变量////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  shouxuID;//手续数据的id
  ///冻结的账号
  freezeNumber;
  //冻结金额
  freezeMoney = '全额冻结'
  //冻结的户名
  freezeName;
  //类型
  moneyType = '人民币';
  //金融机构名字
  company: string;
  //文书号
  docNumber: string;
  //其他
  other: string;

  //文书中冻结的开始和结束日期
  year_start;
  month_start;
  day_start;
  year_end;
  month_end;
  day_end;

  //自动完成的选项
  moneyTypes;//种类
  companys;//金融机构
  bankBin;
  filterCompanys: Observable<any>;//过滤后的金融机构
  myControl: FormControl = new FormControl();//绑定金融机构的formControl

  isNew: boolean = true;//是否新建手续
  isUnfreeze: boolean = false;//是否已经解除冻结

  isManual = false//是否手动生成解除冻结的日期和文书编号

  cardIDFromtrol = new FormControl();

  docNumber2;
  createDate2;

  type = '1';

  //绑定表单中的开始和结束时间
  private _startTime;
  get startTime() {
    return this._startTime;
  }

  set startTime(value) {
    this._startTime = value;
    this.year_start = this.getYear(value)
    this.month_start = this.getMonth(value);
    this.day_start = this.getDay(value);
    // this.endTime = this._startTime.add(6,'month')
  }

  private _endTime
  get endTime() {
    return this._endTime;
  }

  set endTime(value) {
    this._endTime = value;
    this.year_end = this.getYear(value);
    this.month_end = this.getMonth(value);
    this.day_end = this.getDay(value);
    console.log(this.endTime)
  }

  //文书中的日期
  get createDate_chinese() {
    return this.type === '1' ? this.toChineseDate(this.createDate) : this.toChineseDate(this.createDate2)
  }
  //冻结金额的大小写
  get freezeMoney2() {
    if (this.freezeMoney != '全额冻结')
      return this.digitUppercase(this.freezeMoney) + ',' + this.freezeMoney + '元';
    return this.freezeMoney
  }

  //////////////////////////////////////////////////其他变量///////////////////////////////////////
  constructor(public dialog: MatDialog, private sql: SQLService) {
    super()
  }

  ngOnInit() {
    this.getDocNumber();
    this.startTime = moment();
    this.endTime = moment().add(6, 'month');
    this.filterCompanys = this.myControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    )

    this.cardIDFromtrol.valueChanges.subscribe(
      res => {
        if (this.getBankNameByCard(res))
          this.company = this.getBankNameByCard(res)
        console.log(res)
      }
    )
  }

  /////////////////////////////////////////////////////////复写父类的方法///////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  set data(value: any) {
    this.shouxuID = value.id;
    this.freezeNumber = value.freezeNumber;
    this.freezeName = value.freezeName;
    this.freezeMoney = value.freezeMoney;
    this.startTime = moment(value.startTime);
    this.endTime = moment(value.endTime);
    this.createDate = moment(value.createDate)
    this.company = value.company;
    this.docNumber = value.docNumber;
    this.isNew = false;
    this.docNumber2 = value.docNumber2;
    this.createDate2 = moment(value.createDate2);
    this.isUnfreeze = this.docNumber2 && this.createDate2;
  }

  set caseData(value) {
    this.lawCaseID = value.lawCaseID;
    this.caseName = value.caseName;
    this.caseNumber = value.caseNumber;
    this.caseContent = value.caseContent;
    this.isNew = true;
    this.isUnfreeze = this.docNumber2 && this.createDate2;
  }

  validate() {
    if (!this.lawCaseID) {
      toastr.warning('请先选择案件');
      return false;
    }
    if (!this.startTime) {
      toastr.warning('冻结开始时间没有填写')
      return false;
    }
    if (!this.endTime) {
      toastr.warning('冻结结束时间没有填写')
      return false;
    }
    // if (!this.freezeName || this.isEmptyStr(this.freezeName)) {
    //   toastr.warning('户名或权利人没有填写')
    //   return false;
    // }
    if (!this.freezeNumber || this.isEmptyStr(this.freezeNumber)) {
      toastr.warning('账号没有填写')
      return false;
    }
    if (!this.company || this.isEmptyStr(this.company)) {
      toastr.warning('开会银行没有填写')
      return false;
    }

    if (!this.freezeMoney || this.isEmptyStr(this.freezeMoney)) {
      toastr.warning('冻结金额没有填写')
      return false;
    }

    return true;
  }

  getTableData(caseID: any) {
    console.log('get table data')
    let data = {
      startTime: this.startTime.format('YYYY/MM/DD'),
      endTime: this.endTime.format('YYYY/MM/DD'),
      freezeNumber: this.freezeNumber,
      freezeMoney: this.freezeMoney,
      freezeName: this.freezeName,
      moneyType: this.moneyType,
      company: this.company,
      docNumber: this.docNumber,
      other: this.other,
      caseID: caseID,
      createDate: this.createDate.format('YYYY/MM/DD')
    }
    console.log(data);
    return data;
  }

  getSqlInstance() {
    return this.sql;
  }

  getDialogInstance() {
    return this.dialog;
  }

  getSaveFileName() {
    return `${this.docNumber}_冻结通知书`
  }

  clear() {
    this.company = this.freezeNumber = this.freezeName = null;
    this.startTime = moment();
    this.endTime = moment().add(6, 'month');
    this.getDocNumber()
  }

  filter(val: string): string[] {
    if (val == '' || !val) return this.companys;
    return this.companys.filter(item => {
      return item['py'].toLowerCase().indexOf(val) >= 0 || item['label'].indexOf(val) >= 0
    })
  }

  private getDocNumber() {
    this.sql.exec(PhpFunctionName.SELECT_LAST_DOCUMENT_NUMBER, State.djtzs.value).subscribe(
      res => {
        if (res.length == 0) {
          this.docNumber = moment().format('MMDD') + '01'
        } else {
          let lastDocNumber = res[0]['docNumber']
          let str = moment().format('MMDD');
          if (str == lastDocNumber.substr(0, 4)) {
            let num = parseInt(lastDocNumber.substr(4, 2))
            console.log(num)
            num += 1;
            let strNum = ''
            num < 10 ? strNum = '0' + num : strNum = '' + num;
            this.docNumber = str + strNum
          } else {
            this.docNumber = moment().format('MMDD') + '01'
          }
        }
      }
    )
  }


  onAddUnfreeze() {
    this.dialog.open(AddUnfreezeComponent, { data: { shouxuID: this.shouxuID } })
  }

  private digitUppercase(n) {
    let fraction = ['角', '分'];
    let digit = [
      '零', '壹', '贰', '叁', '肆',
      '伍', '陆', '柒', '捌', '玖'
    ];
    let unit = [
      ['元', '万', '亿'],
      ['', '拾', '佰', '仟']
    ];
    let head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    n = Math.floor(n);
    for (let i = 0; i < unit[0].length && n > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && n > 0; j++) {
        p = digit[n % 10] + unit[1][j] + p;
        n = Math.floor(n / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  };

  private getBankNameByCard(idCard: string) {
    if (!idCard)
      return;
    for (let i = 10; i > 2; i--) {
      if (this.bankBin[idCard.substr(0, i)])
        return this.bankBin[idCard.substr(0, i)];
    }
    return ""
  }
}
