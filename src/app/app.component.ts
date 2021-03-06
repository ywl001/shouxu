import { Component, ViewChild, ElementRef, ViewContainerRef, ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { SQLService } from './services/sql.service';
import { HttpClient } from '@angular/common/http';
import * as toastr from 'toastr';
import { State } from './state';
import { DzgjComponent } from './dzgj/dzgj.component';
import { Shouxu } from './models/shouxu';
import { DztzsComponent } from './dztzs/dztzs.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { AddCaseComponent } from './add-case/add-case.component';
import { PhpFunctionName } from './models/php-function-name';
import { MessageService } from './services/message.service';
import { DjspbComponent } from './djspb/djspb.component';
import { CxspComponent } from './cxsp/cxsp.component';
import { DjtzsComponent } from './djtzs/djtzs.component';
import { DzspbComponent } from './dzspb/dzspb.component';
import * as pinyin from 'pinyin'
import { MeituanComponent } from './meituan/meituan.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shouxu';

  // ---------------------------------------html直接绑定----------------------------------
  state: any;
  states: Array<any> = [State.dzgj, State.meituan,State.dztzs, State.dzspb, State.djtzs, State.djspb];
  // 案件信息
  caseName: string;
  caseNumber: string;
  caseContent: string;
  lawCaseID: string;

  //绑定印章复选框
  private _isSeal = true;
  public get isSeal() {
    return this._isSeal;
  }
  public set isSeal(value) {
    this._isSeal = value;
    this.shouxu.isSeal = value;
  }

  private _lawcases: Array<any>;

  ////////////////////////////////////////////////配置文件获取的信息////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //银行列表
  private companys: Array<string>;
  //填表人列表
  private users: Array<string>;
  //钱的类型
  private moneyTypes: any;
  // 调取证据时，日期选择的列表
  private dateSelectList: Array<any>
  // 冻结的类型
  private freezeTypes: Array<string>;
  //单位名称
  private unit: string;
  //单位名称简写
  private unit_1: string;
  //部平台查询类型
  private queryTypes: Array<string>;
  //银行bin码
  private bankBin
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  @ViewChild('shouxuContainer', { static: false, read: ViewContainerRef }) shouxuContainer: ViewContainerRef;
  shouxu: Shouxu;

  filterCase: string = ''
  filterCase$: Observable<any>;
  caseControl = new FormControl();

  constructor(
    private sql: SQLService,
    private http: HttpClient,
    private resolver: ComponentFactoryResolver,
    private message: MessageService,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.state = State.dzgj;
    State.currentState = State.dzgj;
    this.getConfigData()
    this.getCaseData();
    this.message.refresh$.subscribe(
      res => { this.getCaseData() }
    )
  }

  /**创建动态组件 */
  private createComponent(state) {
    this.shouxuContainer.clear();
    //电子轨迹
    if (this.state == State.dzgj) {
      this.shouxu = this.getShouxuInstance(DzgjComponent);
    }
    else if (this.state == State.meituan) {
      this.shouxu = this.getShouxuInstance(MeituanComponent);
    }
    //调证通知书
    else if (this.state == State.dztzs) {
      this.shouxu = this.getShouxuInstance(DztzsComponent);
      (<DztzsComponent>this.shouxu).companys = this.companys;
      (<DztzsComponent>this.shouxu).dateSelectList = this.dateSelectList;
      (<DztzsComponent>this.shouxu).bankBin = this.bankBin;
    }
    //调证审批表
    else if (this.state == State.dzspb) {
      this.shouxu = this.getShouxuInstance(DzspbComponent);
      (<DzspbComponent>this.shouxu).queryTypes = this.queryTypes;
    }
    //冻结通知书
    else if (this.state == State.djtzs) {
      this.shouxu = this.getShouxuInstance(DjtzsComponent);
      (<DjtzsComponent>this.shouxu).moneyTypes = this.moneyTypes;
      (<DjtzsComponent>this.shouxu).companys = this.companys;
      (<DjtzsComponent>this.shouxu).bankBin = this.bankBin;
    }
    //冻结审批表
    else if (this.state == State.djspb) {
      this.shouxu = this.getShouxuInstance(DjspbComponent);
      (<DjspbComponent>this.shouxu).freezeTypes = this.freezeTypes;
    }
    //反诈中心查询审批
    else if (this.state == State.cxsp) {
      this.shouxu = this.getShouxuInstance(CxspComponent);
    }
    this.shouxu.users = this.users;
    this.shouxu.isSeal = this.isSeal;
    this.shouxu.unit = this.unit;
    this.shouxu.unit_1 = this.unit_1
    this.shouxu.saveComplete.subscribe(res => { this.getCaseData() })
  }

  //获取各种手续的实例
  private getShouxuInstance(className) {
    let factory = this.resolver.resolveComponentFactory(className)
    let componentRef = this.shouxuContainer.createComponent(factory);
    return <Shouxu>componentRef.instance;
  }

  /**获取配置数据 */
  private getConfigData() {
    this.http.get('assets/data.json')
      .subscribe(res => {
        console.log(res)
        this.companys = res['company'];
        this.users = res['user'];
        this.dateSelectList = res['dateSelect'];
        this.freezeTypes = res['freezeType'];
        this.moneyTypes = res['moneyType'];
        this.unit = res['unit'];
        this.unit_1 = res['unit_1'];
        this.queryTypes = res['queryType'];
        this.bankBin = res['bankBin']
        this.createComponent(this.state)
      })
  }


  /**手续类型选择 */
  onStateChange(e) {
    this.state = e.value;
    State.currentState = e.value;
    console.log(State.currentState)
    this.getCaseData()
    this.createComponent(e.value);
    this.clear()
  }

  /**获取案件数据 */
  getCaseData() {
    let data = {
      isShouxu: this.isShouxu,
      tableName: this.state.value
    }
    this.sql.exec(PhpFunctionName.SELECT_RECORDS, data).subscribe(res => {
      this.lawCases = res;
    })
  }

  set lawCases(value) {
    this._lawcases = value;
    this.filterCase$ = this.caseControl.valueChanges.pipe(
      startWith(''),
      map(val => this.filter(val))
    )
  }

  filter(val: string): string[] {
    if (val == '') return this._lawcases;
    return this._lawcases.filter(item => {
      const py = pinyin(item['caseName'],{style:pinyin.STYLE_FIRST_LETTER}).join('');
      return item['caseName'].indexOf(val) >= 0 || py.indexOf(val)>=0
    })
  }

  get lawCase() {
    return this._lawcases;
  }

  /**绑定checkbox仅显示有手续的案件 */
  private _isShouxu: boolean = false;
  get isShouxu() {
    return this._isShouxu;
  }

  set isShouxu(value) {
    this._isShouxu = value;
    this.getCaseData();
  }

  onAddCase() {
    const dialogRef = this.dialog.open(AddCaseComponent, { disableClose: false });
  }

  // 列表点击,显示案件信息
  showCaseData(caseData) {
    console.log('show case data')
    this.clear()
    this.shouxu.clear();
    this.caseNumber = caseData.caseNumber;
    this.caseName = caseData.caseName;
    this.caseContent = caseData.caseContent;

    this.lawCaseID = caseData.lawCaseID;
    this.shouxu.caseData = caseData;
  }

  clear() {
    this.caseName = this.caseNumber = this.caseContent = this.lawCaseID = null;
  }

  showShouxuData(itemData) {
    console.log('click item')
    // this.shouxu.clear()
    this.shouxu.data = itemData;
  }

  /////////////////////////////////////////按钮click事件/////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////////////
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

  onPreview() {
    this.shouxu.preview()
  }

  onCbSuccess(){
    console.log('aaaaa')
    toastr.success('复制成功')
  }
}
