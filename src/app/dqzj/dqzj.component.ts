import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment'
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ThrowStmt } from '@angular/compiler';
@Component({
  selector: 'app-dqzj',
  templateUrl: './dqzj.component.html',
  styleUrls: ['./dqzj.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class DqzjComponent implements OnInit {

  // html 绑定的变量
  //金融机构列表
  fananceCompanys: Array<string>
  //调取的金融机构
  company: string;
  //填表日期
  createDate: any;

  //主界面传过来的数据,
  @Input() caseNumber: string;
  @Input() caseName: string;
  @Input() caseContent: string;
  @Input() isSeal: boolean;
  //调取证据内容
  evidenceContent: string = '调取微信号wxid_tcc34fib3vyt12的主体信息'

  //隐藏的打印按钮
  @ViewChild('btnPrint', { static: false })
  btnPrint: ElementRef

  constructor(private http: HttpClient) {
    this.getFananceCompanys();
  }

  ngOnInit() {
  }

  get NO() {
    return moment().format('MMDD') + '01'
  }

  //获取金融机构列表
  private getFananceCompanys() {
    this.http.get('../assets/fananceCompany.json')
      .subscribe(
        res => {
          this.fananceCompanys = res as Array<string>;
        }
      )
  }

  //填表日期双击事件
  onDblClickCreateDate(e) {
    console.log(e)
    if (e.ctrlKey) {
      this.createDate = moment().add(-1, 'days')
    } else if (e.shiftKey) {
      this.createDate = moment().add(1, 'days')
    } else {
      this.createDate = moment()
    }
    console.log(this.createDate)
  }

  //获取填表日期字符串,提交数据库
  get addDate() {
    if (!this.createDate)
      return ''
    return this.toChineseDate(this.createDate)
  }

  onPrint() {
    this.btnPrint.nativeElement.click()
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
    console.log(YY)
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
    console.log(s)
    return s.join('');
  }

  onSave() {
    console.log('dqzj save')
  }
}
