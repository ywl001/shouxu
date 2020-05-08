import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SQLService } from '../services/sql.service';
import { State } from '../state';
import { MatDialog } from '@angular/material';
import { AddCaseComponent } from '../add-case/add-case.component';
import { PhpFunctionName } from '../models/php-function-name';

declare var alertify;
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent {

  private _data: Array<any>;

  /**
   * 案件列表
   */
  caseList: Array<any>;
  /**
   * 手续列表
   */
  itemList: Array<any>;

  @Input() state: any;
  @Output() clickCase = new EventEmitter()
  @Output() clickItem = new EventEmitter()
  @Output() delComplete = new EventEmitter()

  constructor(private sql: SQLService, private dialog: MatDialog) {

  }

  @Input()
  set data(value: Array<any>) {
    if (value && value != this._data) {
      this._data = value;
      //获取不重复的案件
      this.caseList = [];
      let c = new Map()
      for (let i = 0; i < value.length; i++) {
        let o = value[i];
        c.set(o.lawCaseID, o)
      }
      c.forEach((value) => {
        this.caseList.push(value)
      })
    }
  }

  get data() {
    return this._data;
  }

  onClickCase(lawCase) {
    console.log(lawCase)
    this.clickCase.emit(lawCase)
    // 获取itemList
    this.itemList = this.data.filter(item => {
      if (this.state == State.dzgj) {
        if (item.phoneNumber) {
          let phones = item.phoneNumber.split('|')
          item.desc = phones.length > 2 ? `${phones.slice(0, 2)}　等${phones.length}个号码` : item.phoneNumber;
          return item.lawCaseID == lawCase.lawCaseID && item.id;
        }
        return null;
      }
      else
        return item.lawCaseID == lawCase.lawCaseID && item.id;
    })
    console.log(this.itemList)
  }

  onItemClick(item) {
    console.log('record item click')
    this.clickItem.emit(item)
    // EventBus.dispatch(EventType.SHOW_SHOUXU_DATA, item)
  }

  /**删除记录 */
  onDelete(item) {
    alertify.set({
      labels: {
        ok: "确定",
        cancel: "取消"
      }
    });
    alertify.confirm("确定要删除吗？", e => {
      if (e) {
        this.onDeleteRecord(item);
      }
    });
  }

  private onDeleteRecord(item) {
    console.log('delete')
    let data = {
      tableName: this.state.value,
      id: item.id
    }
    this.sql.exec(PhpFunctionName.DEL, data).subscribe(
      res => { this.delComplete.emit() }
    )

  }

  onDblClick(e) {
    console.log('dbl click');
    let dialogRef = this.dialog.open(AddCaseComponent, { disableClose: false })
    dialogRef.componentInstance.data = e;
  }
}
