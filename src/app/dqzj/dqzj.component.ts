import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MAT_HAMMER_OPTIONS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

import domtoimage from 'dom-to-image';
import * as download from 'downloadjs'
import { SQLService } from '../services/sql.service';
import * as toastr from 'toastr';
import { Shouxu } from '../models/shouxu';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PhpFunctionName } from '../models/php-function-name';

@Component({
  selector: 'app-dqzj',
  templateUrl: './dqzj.component.html',
  styleUrls: ['./dqzj.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DqzjComponent extends Shouxu {
  // html 绑定的变量
  //调取的金融机构
  company: string;
  //调取证据内容


  //金融机构列表
  @Input() companys: Array<string>;
  @Input() tipLabels: Array<object>;
  @Input() dateSelectList: Array<any>;
  //打印表格需要
  // @Input() state: string;

  baseDate: any;

  //隐藏的打印按钮
  @ViewChild('btnPrint', { static: false })
  btnPrint: ElementRef

  @ViewChild('evidence', { static: false })
  evidenceInput: ElementRef;

  filterCompanys: Observable<any>;
  myControl: FormControl = new FormControl();

  constructor(private http: HttpClient, private sql: SQLService, private cdRef: ChangeDetectorRef) {
    super()
    console.log('调取证据 constructor');
    this.saveComplete = new EventEmitter()
  }

  ngOnInit() {
    this.getdocNumber();
    this.filterCompanys = this.myControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    )
  }

  filter(val: string): string[] {
    if(val=='' || !val) return this.companys;
    return this.companys.filter(item => {
      return item['py'].toLowerCase().indexOf(val) >= 0 || item['label'].indexOf(val) >= 0
    })
  }

  private _data: any;
  set data(value) {
    console.log('dqzj set data')
    if (value && this._data != value) {
      this._data = value;
      this.docNumber = value.docNumber;
      this.createDate = moment(value.createDate);
      this.company = value.company;
      this.evidenceContent = value.evidenceContent;
    }
  }

  get data() {
    return this._data;
  }

  evidenceContent: string;

  docNumber: string;
  getdocNumber() {
    this.sql.exec(PhpFunctionName.SELECT_LAST_DOCUMENT_NUMBER,null).subscribe(
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

  //获取填表日期字符串,提交数据库
  get addDate() {
    if (!this.createDate)
      return ''
    return this.toChineseDate(this.createDate)
  }

  //绑定文号中年份
  get year() {
    return new Date().getFullYear()
  }
  //日期转中文
  private toChineseDate(moment) {
    const cn = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
    let s = [];

    let YY = moment.year().toString();
    for (var i = 0; i < YY.length; i++) {
      s.push(cn[YY.charAt(i)]);
    }
    s.push("年");
    let MM = moment.month() + 1;
    if (MM < 10)
      s.push(cn[MM]);
    else if (MM < 20)
      s.push("十" + cn[MM % 10]);
    s.push("月");

    var DD = moment.date();
    if (DD < 10)
      s.push(cn[DD]);
    else if (DD < 20)
      s.push("十" + cn[DD % 10]);
    else
      s.push("二十" + cn[DD % 10]);
    s.push("日");
    return s.join('');
  }

  clear() {
    this.company = this.evidenceContent = this.createDate = this.evidenceContent2 = null;
    this.getdocNumber()
  }

  isShowPrint = 'none'
  toImage() {
    this.isShowPrint = 'block'
    if(!this.createDate) this.createDate = moment()
    setTimeout(() => {
      domtoimage.toPng(document.getElementById('print'), { bgcolor: 'white', style: { display: 'block' } })
        .then(dataUrl => {
          download(dataUrl, `${this.evidenceContent}.jpg`);
          this.isShowPrint = 'none'
        });
    }, 0.5);
  }

  print() {
    if(!this.createDate) this.createDate = moment()
    this.btnPrint.nativeElement.click()
  }
  save(caseID) {
    console.log('save 调取证据')
    if (!this.validate())
      return;
    let tableData = this.getSqlData();
    tableData['caseID'] = caseID;
    let data={
      tableName:'dqzj',
      tableData:tableData
    }

    this.sql.exec(PhpFunctionName.INSERT, data)
      .subscribe(
        res => {
          console.log('save complete')
          if (res > 0) {
            this.saveComplete.emit();
            this.clear();
            toastr.success('手续数据保存成功')
          }
        }
      )
  }

  private validate() {
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

  private getSqlData() {
    if (!this.createDate) this.createDate = moment()
    return {
      docNumber: this.docNumber,
      company: this.company,
      evidenceContent: this.evidenceContent2 ? this.evidenceContent2 : this.evidenceContent,
      createDate: this.createDate.format('YYYY/MM/DD')
    }
  }

  evidenceContent2: string;
  onDateSelect(item) {
    if (item.label == '主题信息') {
      this.evidenceContent2 = `调取账号${this.evidenceContent}的主题信息`;
    } else if(item.label == '流水号'){
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
}
