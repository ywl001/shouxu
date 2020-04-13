import { Component, ViewChild } from '@angular/core';
import { SQLService } from './sql.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shouxu';


  // ---------------------------------------html直接绑定----------------------------------
  //----------------------------------------一些是和html直接连接的-------------------------
  //简要案情
  //电子轨迹号码查询理由
  cause: string;

  // 手续类型 radiogroup
  formType: string;
  // 手续种类 radiobutton
  formTypes: Array<string> = ['电子轨迹', '调取证据'];

  isSeal: boolean;

  caseName: string;
  caseNumber: string;
  caseContent: string;
  caseID: string;
  caseList: Array<any>;


  @ViewChild('dzgj', { static: false }) dzgj
  @ViewChild('dqzj', { static: false }) dqzj

  constructor(private sql: SQLService) {

  }

  ngOnInit() {
    this.formType = '电子轨迹';
    this.getCases();
  }

  private getCases() {
    this.sql.getCases().subscribe(
      res => {
        this.caseList = res;
      }
    )
  }

  getCaseData(caseData){
    this.caseNumber = caseData.caseNumber;
    this.caseName = caseData.caseName;
    this.caseContent = caseData.caseContent;
    this.caseID = caseData.id;
  }


  onPrint() {
    if (this.formType == '电子轨迹')
      this.dzgj.onPrint()
    else if (this.formType == '调取证据')
      this.dqzj.onPrint()
  }

  onSaveCase() {
    let data = {
      caseNumber: this.caseNumber,
      caseName: this.caseName,
      caseContent: this.caseContent
    }
    this.sql.insertCase(data).subscribe(
      res => {
        if (res != 0) {
          this.caseID = res;
        }
      }
    )
  }

  onSave() {
      if (this.formType == '电子轨迹') {
        this.dzgj.onSave(this.caseID)
      } else if (this.formType == '调取证据') {
        this.dqzj.onSave()
      }
  }


}
