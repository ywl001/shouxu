import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AngularDraggableModule } from 'angular2-draggable'
import { NgxPrintModule } from 'ngx-print'
import {
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatRadioModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatAutocompleteModule,
  MatListModule,
  MatExpansionModule,
  MatDialogModule
} from '@angular/material'

import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { DzgjComponent } from './dzgj/dzgj.component';
import { DqzjComponent } from './dqzj/dqzj.component';
import { from } from 'rxjs';
import { RecordsComponent } from './records/records.component';
import { AddCaseComponent } from './add-case/add-case.component';
import { PreviewComponent } from './preview/preview.component';
import { DjspComponent } from './djsp/djsp.component';
import { CxspComponent } from './cxsp/cxsp.component';
import { DjtzsComponent } from './djtzs/djtzs.component';

@NgModule({
  declarations: [
    AppComponent,
    DzgjComponent,
    DqzjComponent,
    RecordsComponent,
    AddCaseComponent,
    PreviewComponent,
    DjspComponent,
    CxspComponent,
    DjtzsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularDraggableModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatRadioModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxPrintModule,
    MatAutocompleteModule,
    MatListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DzgjComponent,DqzjComponent,AddCaseComponent,PreviewComponent,DjspComponent,CxspComponent,DjtzsComponent]
})
export class AppModule { }
