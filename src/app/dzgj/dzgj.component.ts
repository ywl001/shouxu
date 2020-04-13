import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { SQLService } from '../sql.service';


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
export class DzgjComponent implements OnInit {

  //和html绑定的变量

  //是否手动设置起止日期
  isManual: boolean;
  startDate: any;
  endDate: any;
  // 填表时间
  createDate: any;
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
  
  //隐藏的打印按钮,因为只有该按钮click才能打印,没有找到代码控制打印
  @ViewChild('btnPrint', { static: false })
  btnPrint: ElementRef

  //从主界面输入的案件属性
  @Input() caseName: string;
  @Input() caseNumber: string;
  @Input() caseContent: string;
  @Input() isSeal: boolean

  constructor(private sql: SQLService) { }

  ngOnInit() {
  }

  //填表时间双击事件
  onDblClickCreateDate(e) {
    console.log(e)
    if (e.ctrlKey) {
      this.createDate = _moment().add(-1, 'days')
    } else if (e.shiftKey) {
      this.createDate = _moment().add(1, 'days')
    } else {
      this.createDate = _moment()
    }
  }

  //对外打印方法
  onPrint() {
    this.btnPrint.nativeElement.click()
  }

  //提交数据库的电子轨迹查询信息
  private getDzgjData() {
    let addDate = this.createDate.format('YYYY/MM/DD')
    let endDate = this.endDate ? this.endDate.format('YYYY/MM/DD') : addDate;
    return {
      addDate: addDate,
      cause: this.cause,
      phoneNumber: this.PhoneNumbers,
      requestUser: this.requestUser,
      userPhone: this.userPhone,
      startDate: this.getStartDate(),
      endDate: endDate
    }
  }

  /**
  * 获取号码列表和号码组成的字符串
  */
  private get PhoneNumbers() {
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

  // 获取起始时间,提交数据库
  private getStartDate() {
    if (this.startDate && this.endDate) {
      return this.startDate.format('YYYY/MM/DD');
    }
    let copyDate = this.createDate.clone();
    return copyDate.subtract(3, 'months').add(1, 'days').format('YYYY/MM/DD');
  }

  //对外onSave方法
  onSave(caseID) {
    this.insertData(caseID)
  }

  private insertData(caseID) {
    let data = this.getDzgjData();
    data['caseID'] = caseID
    this.sql.insertData('dzgj', data)
      .subscribe(
        res => {
          if (res > 0)
            console.log('success')
        }
      )
  }

  private getCaseID(){
    this.sql.getCaseId(this.caseNumber)
    .subscribe(
      res=>{
        let id = res[0].id;
        console.log(id)
        this.insertData(id)
      }
    )
  }
}
