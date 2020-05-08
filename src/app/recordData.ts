export class RecordData {
    state:string;
    caseList:Array<LawCase>
    itemList:Array<any>   
}

export class LawCase {
    lawCaseID:string;
    caseName: string
    caseNumber: string;
    caseContent:string;
}

export class DZGJ {
    id:string
    lawCaseID:string
    cause:string
    phoneNumber:string
    requestUser:string
    userPhone:string
    startDate:string
    endDate:string
    createDate:string
}

export class DQZJ {
    id:string
    lawCaseID:string
    number:string
    companyName:string
    evidenceContent:string
    createDate:string
}
