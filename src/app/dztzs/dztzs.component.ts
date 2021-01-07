import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MAT_HAMMER_OPTIONS, MatDialog } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import { SQLService } from '../services/sql.service';
import * as toastr from 'toastr';
import { Shouxu } from '../models/shouxu';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PhpFunctionName } from '../models/php-function-name';
import { State } from '../state';

@Component({
  selector: 'app-dztzs',
  templateUrl: './dztzs.component.html',
  styleUrls: ['./dztzs.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DztzsComponent extends Shouxu {
  ///////////////////////////////////////和html直接绑定的变量///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  //调取的金融机构
  company: string;
  //调取证据内容
  evidenceContent: string;
  //证据的内容2，如果证据内容2存在，则用证据内容2
  evidenceContent2: string;

  //金融机构列表
  companys: Array<string>;
  tipLabels: Array<object>;
  dateSelectList: Array<any>;

  //查询的基准日期
  baseDate: any;
  docNumber: string;
  bankBin: any;

  //绑定文号中年份
  get year() {
    return new Date().getFullYear()
  }

  //绑定文书的日期
  get addDate() {
    return this.toChineseDate(this.createDate)
  }


  @ViewChild('evidence', { static: false })
  evidenceInput: ElementRef;

  filterCompanys$: Observable<any>;
  myControl: FormControl = new FormControl();

  cardIDControl:FormControl = new FormControl();

  constructor(private http: HttpClient,
    private sql: SQLService,
    public dialog: MatDialog) {
    super()
    console.log('调取证据 constructor');
  }

  ngOnInit() {
    this.getdocNumber();
    this.filterCompanys$ = this.myControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    )

    this.cardIDControl.valueChanges.subscribe(
      res=>{
        if(this.getBankNameByCard(res))
          this.company = this.getBankNameByCard(res)
        // console.log(this.bankBin)
      }
    )
  }

  ////////////////////////////////////////复写父类方法///////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  set data(value) {
    if (value) {
      this.docNumber = value.docNumber;
      this.createDate = moment(value.createDate);
      this.company = value.company;
      this.evidenceContent = value.evidenceContent;
    }
  }
  validate() {
    if (!this.lawCaseID) {
      toastr.warning('请选择一个案件，没有请先添加案件');
      return false;
    }
    if (!this.docNumber || this.docNumber.trim() == '') {
      toastr.warning('文书编号没有填写')
      return false;
    }
    if (!this.evidenceContent || this.evidenceContent.trim() == '') {
      toastr.warning('查询内容没有填写')
      return false;
    }
    return true;
  }

  getTableData(caseID: any) {
    return {
      caseID: caseID,
      docNumber: this.docNumber,
      company: this.company,
      evidenceContent: this.evidenceContent2 ? this.evidenceContent2 : this.evidenceContent,
      createDate: this.createDate.format('YYYY/MM/DD')
    }
  }

  getSqlInstance() {
    return this.sql;
  }

  getDialogInstance() {
    return this.dialog;
  }

  clear() {
    this.company = this.evidenceContent = this.baseDate = this.evidenceContent2 = this.createDate = null;
    this.getdocNumber()
  }

  getSaveFileName() {
    return `${this.docNumber}号调证通知书`
  }

  //辅助选择日期的点击
  onDateSelect(item) {
    if (item.label == '主体信息') {
      this.evidenceContent2 = `调取账号${this.evidenceContent}的主体信息`;
    } else if (item.label == '流水号') {
      this.evidenceContent2 = `调取交易流水号${this.evidenceContent}的账号信息`;
    }
    else if (item.label == '清除') {
      this.evidenceContent2 = null;
    } else {
      if (!this.baseDate) this.baseDate = moment();
      let dayRange = item.value;
      let before = this.baseDate.clone().add(dayRange[0], 'days').format('YYYY年MM月DD日');
      let after = this.baseDate.clone().add(dayRange[1], 'days').format('YYYY年MM月DD日');
      this.evidenceContent2 = `调取账号${this.evidenceContent}自${before}至${after}的交易明细`;
    }
  }


  filter(val: string): string[] {
    if (val == '' || !val) return this.companys;
    return this.companys.filter(item => {
      return item['py'].toLowerCase().indexOf(val) >= 0 || item['label'].indexOf(val) >= 0
    })
  }

  private getdocNumber() {
    this.sql.exec(PhpFunctionName.SELECT_LAST_DOCUMENT_NUMBER, State.dztzs.value).subscribe(
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
  private getBankNameByCard(idCard: string) {
    if(!idCard)
      return;
    if (this.bankBin[idCard.substr(0, 3)])
      return this.bankBin[idCard.substr(0, 3)]
    else if (this.bankBin[idCard.substr(0, 4)])
      return this.bankBin[idCard.substr(0, 4)]
    else if (this.bankBin[idCard.substr(0, 5)])
      return this.bankBin[idCard.substr(0, 5)]
    else if (this.bankBin[idCard.substr(0, 6)])
      return this.bankBin[idCard.substr(0, 6)]
    else if (this.bankBin[idCard.substr(0, 7)])
      return this.bankBin[idCard.substr(0, 8)]
    else if (this.bankBin[idCard.substr(0, 9)])
      return this.bankBin[idCard.substr(0, 9)]
    else if (this.bankBin[idCard.substr(0, 10)])
      return this.bankBin[idCard.substr(0, 10)]
    return ""
  }


}
