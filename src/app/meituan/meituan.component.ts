import { Component, OnInit } from '@angular/core';
import { DateAdapter, MatDialog, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Shouxu } from '../models/shouxu';
import { SQLService } from '../services/sql.service';

class User {
  name: string = '';
  id: string = '';
  phone: string = '';
}

@Component({
  selector: 'app-meituan',
  templateUrl: './meituan.component.html',
  styleUrls: ['./meituan.component.scss'],
  providers: [//和格式化日期相关
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class MeituanComponent extends Shouxu {

  targetUsers: User[];

  cause: string = '';

  //联系电话
  userPhone: string;
  //反馈方式
  feedbackWay: string;

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

  constructor(public dialog: MatDialog, private sql: SQLService) {
    super();
    this.targetUsers = [];
    for (let i = 0; i < 10; i++) {
      this.targetUsers.push(new User())
    }
  }
  ngOnInit() {
   
  }
  set data(value: any) {
    throw new Error('Method not implemented.');
  }

  clear() {
  }

  validate() {
    throw new Error('Method not implemented.');
  }

  getTableData(caseID: any) {
    console.log('get table data')
    let createDate = this.createDate.format('YYYY/MM/DD')
    let tableData = {
      caseID: caseID,
      createDate: createDate,
      cause: this.cause,
      targetUser: this.getTargetUserString(),
      requestUser: this.requestUser ? this.requestUser : '姚伟立',
      userPhone: this.userPhone ? this.userPhone : '15838811277',
      feedbackWay: this.feedbackWay
    }
    return tableData;
  }

  getDialogInstance() {
    return this.dialog;
  }

  getSqlInstance() {
    return this.sql;
  }

  getSaveFileName() {
    throw new Error('Method not implemented.');
  }


  private getTargetUserString(): string {
    return JSON.stringify(this.targetUsers);
  }

  onChange() {
    console.log(this.targetUsers)
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

