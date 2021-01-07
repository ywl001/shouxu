import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as moment from 'moment'
import { PhpFunctionName } from '../models/php-function-name';
import { MessageService } from '../services/message.service';
import { SQLService } from '../services/sql.service';
import { State } from '../state';

@Component({
  selector: 'app-add-unfreeze',
  templateUrl: './add-unfreeze.component.html',
  styleUrls: ['./add-unfreeze.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class AddUnfreezeComponent implements OnInit {

  docNumber;
  private _createDate;
  get createDate() {
    if (!this._createDate)
      this._createDate = moment();
    return this._createDate;
  }

  set createDate(value) {
    this._createDate = value;
  }
  constructor(private sql: SQLService, @Inject(MAT_DIALOG_DATA) public data: any, private message: MessageService) { }

  ngOnInit() {
    this.getDocNumber()
  }

  private getDocNumber() {
    this.sql.exec('selectLastDocNumber2', State.djtzs.value).subscribe(
      res => {
        let lastDocNumber = res[0]['docNumber2']
        if (lastDocNumber) {
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
        }else{
          this.docNumber = moment().format('MMDD') + '01'
        }
      }
    )
  }

  onSubmit() {
    let tableData = {
      tableName: State.currentState.value,
      tableData: {
        docNumber2: this.docNumber,
        createDate2: this.createDate,
      },
      id: this.data.shouxuID
    }
    this.sql.exec(PhpFunctionName.UPDATE, tableData).subscribe(
      res => {
        this.message.sendUnfreeze(tableData)
      }
    )
  }
}
