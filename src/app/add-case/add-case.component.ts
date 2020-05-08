import { Component, OnInit } from '@angular/core';
import * as toastr from 'toastr';
import { SQLService } from '../services/sql.service';
import { PhpFunctionName } from '../models/php-function-name';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-add-case',
  templateUrl: './add-case.component.html',
  styleUrls: ['./add-case.component.css']
})
export class AddCaseComponent implements OnInit {

  constructor(private sqlService: SQLService, private message: MessageService) { }

  lawCaseID: string;
  caseName: string;
  caseNumber: string;
  caseContent: string;

  isEdit: boolean;

  private _data;

  set data(value) {
    this._data = value;
    this.lawCaseID = value.lawCaseID;
    this.caseName = value.caseName;
    this.caseNumber = value.caseNumber;
    this.caseContent = value.caseContent;
    this.isEdit = true;
  }

  ngOnInit() {
  }

  onSubmit() {
    if (this.isEdit) {
      let data = {
        tableName: 'law_case',
        tableData: this.sqlData,
        id: this.lawCaseID
      }
      this.sqlService.exec(PhpFunctionName.UPDATE, data).subscribe(
        res => {
          toastr.info('编辑案件成功');
          this.message.sendRefresh()
        }
      )
    } else {
      let data = {
        tableName: 'law_case',
        tableData: this.sqlData
      }
      this.sqlService.exec(PhpFunctionName.INSERT, data).subscribe(
        res => {
          if (res > 0) {
            toastr.info('插入案件成功');
            this.message.sendRefresh()
          }
        }
      )
    }
  }

  get sqlData() {
    if (!this.caseNumber || this.caseNumber.trim() == '') {
      toastr.warning('没有案件编号')
      return;
    }
    return {
      caseName: this.caseName,
      caseNumber: this.caseNumber,
      caseContent: this.caseContent
    }
  }
}
