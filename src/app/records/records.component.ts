import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SQLService } from '../sql.service';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})
export class RecordsComponent implements OnInit {

  @Input() caseList: Array<any>;
  @Input() type: string;
  @Output() caseData = new EventEmitter<any>();;

  constructor(private sql:SQLService) { }

  dzgjRecords:Array<any>;
  dqzjRecords:Array<any>;

  ngOnInit() {
    console.log(this.type)
  }

  // private getRecords(){
  //   if(this.type == '电子轨迹'){
  //     this.sql.getDzgjRecords()
  //     .subscribe(res=>{
  //       console.log(res)
  //     })
  //   }
  //   else if(this.type == '调取证据'){

  //   }
  // }

  onClickCase(item){
    //向主容器发送案件信息
    this.caseData.emit(item);
    //查询案件下的手续
    this.sql.getDzgjRecords(item.id).subscribe(
      res=>{
        this.dzgjRecords = res;
      }
    )
  }

  onItemClick(){
    console.log('item click')
  }
}
