import { Input, Output,EventEmitter } from '@angular/core';

export abstract class Shouxu {

    @Input() isSeal:boolean;

    caseName:string;
    caseNumber:string;
    caseContent:string;
    caseID:string;

    createDate:any
    abstract print();
    abstract toImage();
    abstract save(caseID);

    abstract set data(value)
    abstract get data()

    abstract clear()

    @Output() saveComplete:EventEmitter<any>;

}
