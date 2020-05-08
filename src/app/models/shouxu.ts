import { Input, Output,EventEmitter } from '@angular/core';

export abstract class Shouxu {

    @Input() isSeal:boolean;

    caseName:string;
    caseNumber:string;
    caseContent:string;
    lawCaseID:string;

    createDate:any
    abstract print();
    abstract toImage();
    abstract save(lawCaseID);

    abstract set data(value)
    abstract get data()

    abstract clear()

    @Output() saveComplete:EventEmitter<any>;

}
