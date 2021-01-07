import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SQLService } from '../services/sql.service';
import { State } from '../state';
import { MatDialog } from '@angular/material';
import { AddCaseComponent } from '../add-case/add-case.component';
import { PhpFunctionName } from '../models/php-function-name';
import { from, Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { MessageService } from '../services/message.service';

declare var alertify;
@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  private _data: Array<any>;

  /**
   * 案件列表
   */
  caseList: Array<any>;
  /**
   * 手续列表
   */
  itemList: Array<any>;

  itemList$: Observable<any>;

  data$: Observable<any>;

  @Input() state: any;
  @Output() clickCase = new EventEmitter()
  @Output() clickItem = new EventEmitter()
  @Output() delComplete = new EventEmitter()

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

  get data(): Array<any> {
    return this._data;
  }
  constructor(private sql: SQLService, 
    private dialog: MatDialog,
    private cdf:ChangeDetectorRef,
    private message:MessageService) {
  }
  ngOnInit(): void {
    this.message.unfreezeInfo$.subscribe(
      res=>{
        if(!res) return;
        console.log(res);
        // console.log(this.itemList);
        let item = this.itemList.find(item=>item.id == res.id);
        console.log(item)
        item.createDate2 = res.tableData.createDate2;
        item.docNumber2 = res.tableData.docNumber2;
        this.cdf.detectChanges()
      }
    )
  }

  onClickCase(lawCase) {
    this.clickCase.emit(lawCase);
    this.itemList = [];

    for (let i = 0; i < this.data.length; i++) {
      const item = this.data[i];
      if (item.id && item.lawCaseID == lawCase.lawCaseID) {
        if (this.state == State.dzgj) {
          if (item.phoneNumber) {
            let phones = item.phoneNumber.split('|')
            item.desc = phones.length > 2 ? `${phones.slice(0, 2)}　等${phones.length}个号码` : item.phoneNumber;
            console.log(item.desc)
          }
        }
        if (this.state == State.djtzs || this.state == State.dztzs) {
          //按照文书编号排序
          this.itemList.sort((a, b) => {
            return b.docNumber - a.docNumber
          })
        }
        this.itemList.push(item);
      }
    }
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
