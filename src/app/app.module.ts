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
  MatDialogModule,
  MatTooltipModule,
} from '@angular/material'

import { MatNativeDateModule } from '@angular/material/core';
import { ClipboardModule } from 'ngx-clipboard'

import { AppComponent } from './app.component';
import { DzgjComponent } from './dzgj/dzgj.component';
import { DztzsComponent } from './dztzs/dztzs.component';
import { RecordsComponent } from './records/records.component';
import { AddCaseComponent } from './add-case/add-case.component';
import { PreviewComponent } from './preview/preview.component';
import { DjspbComponent } from './djspb/djspb.component';
import { CxspComponent } from './cxsp/cxsp.component';
import { DjtzsComponent } from './djtzs/djtzs.component';
import { DzspbComponent } from './dzspb/dzspb.component';
import { AddUnfreezeComponent } from './add-unfreeze/add-unfreeze.component';

@NgModule({
  declarations: [
    AppComponent,
    DzgjComponent,
    DztzsComponent,
    RecordsComponent,
    AddCaseComponent,
    PreviewComponent,
    DjspbComponent,
    CxspComponent,
    DjtzsComponent,
    DzspbComponent,
    AddUnfreezeComponent
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
    MatDialogModule,
    MatTooltipModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DzgjComponent,
    DztzsComponent,
    DzspbComponent,
    AddCaseComponent,
    PreviewComponent,
    DjspbComponent,
    CxspComponent,
    DjtzsComponent,
    AddUnfreezeComponent
  ]
})
export class AppModule { }
