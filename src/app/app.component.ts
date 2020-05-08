import { Component, ViewChild, ElementRef, ViewContainerRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { SQLService } from './services/sql.service';
import { HttpClient } from '@angular/common/http';
import * as toastr from 'toastr';
import { State } from './state';
import { DzgjComponent } from './dzgj/dzgj.component';
import { Shouxu } from './models/shouxu';
import { DqzjComponent } from './dqzj/dqzj.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddCaseComponent } from './add-case/add-case.component';
import { PhpFunctionName } from './models/php-function-name';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shouxu';

  // ---------------------------------------html直接绑定----------------------------------
  state: any;
  states: Array<any> = [State.dzgj, State.dqzj];

  caseName: string;
  caseNumber: string;
  caseContent: string;

  lawCaseID: string;


  private _lawcases: Array<any>;


  companys: Array<string>;
  users: Array<string>;;
  phoneNumbers: Array<string>;
  dateSelectList:Array<any>

  @ViewChild('shouxuContainer', { static: false, read: ViewContainerRef }) shouxuContainer: ViewContainerRef;
  shouxu: Shouxu;

  filterCase:string = ''
  filterCase$: Observable<any>;
  caseControl = new FormControl();
  constructor(
    private sql: SQLService,
    private http: HttpClient,
    private resolver: ComponentFactoryResolver, 
    private message:MessageService,
    private dialog:MatDialog) {
  }

  ngOnInit() {
    this.state = State.dzgj;
    this.getConfigData()
    this.getData();
    this.message.refresh$.subscribe(
      res=>{this.getData()}
    )
  }

  /**创建动态组件 */
  private createComponent(state) {
    this.shouxuContainer.clear();
    if (this.state == State.dzgj) {
      let factory = this.resolver.resolveComponentFactory(DzgjComponent)
      let componentRef = this.shouxuContainer.createComponent(factory);
      this.shouxu = <DzgjComponent>componentRef.instance;
      this.shouxu.isSeal = this.isSeal;
      (<DzgjComponent>this.shouxu).users = this.users;
      (<DzgjComponent>this.shouxu).phones = this.phoneNumbers;
    } else if (this.state == State.dqzj) {
      let factory = this.resolver.resolveComponentFactory(DqzjComponent)
      let componentRef = this.shouxuContainer.createComponent(factory);
      this.shouxu = <DqzjComponent>componentRef.instance;
      this.shouxu.isSeal = this.isSeal;
      (<DqzjComponent>this.shouxu).companys = this.companys;
      (<DqzjComponent>this.shouxu).dateSelectList = this.dateSelectList;
    }
    this.shouxu.saveComplete.subscribe(res => {this.getData() })
  }

  /**获取配置数据 */
  private getConfigData() {
    this.http.get('assets/data.json')
      .subscribe(res => {
        console.log(res)
        this.companys = res['company'];
        this.users = res['user'];
        this.phoneNumbers = res['phoneNumber'];
        this.dateSelectList = res['dateSelect']
        this.createComponent(this.state)
      })
  }

  /**手续类型选择 */
  onStateChange(e) {
    this.state = e.value;
    this.getData()
    this.isSeal = true;
    this.createComponent(e.value);
    this.clear()
  }

  /**获取数据 */
  getData() {
    let data = {
      isShouxu:this.isShouxu,
      tableName:this.state.value
    }
    this.sql.exec(PhpFunctionName.SELECT_RECORDS,data).subscribe(res=>{
      this.lawCases = res;
    })
  }

  set lawCases(value){
    this._lawcases = value;
    this.filterCase$ = this.caseControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    )
  }

  filter(val: string): string[] {
    if(val=='') return this._lawcases;
    return this._lawcases.filter(item => {
      console.log(item.caseName)
      return item['caseName'].indexOf(val) >= 0
    })
  }

  get lawCase(){
    return this._lawcases;
  }

  /**绑定checkbox仅显示有手续的案件 */
  private _isShouxu: boolean = false;
  get isShouxu() {
    return this._isShouxu;
  }

  set isShouxu(value) {
    this._isShouxu = value;
    this.getData();
  }

  /**绑定checkbox印章 */
  private _isSeal: boolean;
  get isSeal() {
    return this._isSeal;
  }

  set isSeal(value) {
    this._isSeal = value;
    this.shouxu.isSeal = this.isSeal;
  }

  onAddCase(){
    const dialogRef = this.dialog.open(AddCaseComponent,{disableClose:false});
  }

  // 列表点击,显示案件信息
  showCaseData(caseData) {
    console.log('show case data')
    this.clear()
    this.shouxu.clear()
    this.caseNumber = caseData.caseNumber;
    this.caseName = caseData.caseName;
    this.caseContent = caseData.caseContent;

    this.lawCaseID = caseData.lawCaseID;
    this.shouxu.caseName = caseData.caseName;
    this.shouxu.caseNumber = caseData.caseNumber;
    this.shouxu.caseContent = caseData.caseContent;
  }

  clear(){
    this.caseName = this.caseNumber = this.caseContent = this.lawCaseID = null;
  }

  showShouxuData(itemData) {
    console.log('click item')
    // this.shouxu.clear()
    this.shouxu.data = itemData;
  }

  onPrint() {
    this.shouxu.print()
  }

  onSave() {
    this.shouxu.lawCaseID = this.lawCaseID;
    this.shouxu.save(this.lawCaseID)
  }

  onToImage() {
    this.shouxu.toImage()
  }

}
