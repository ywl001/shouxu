import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
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
  MatExpansionModule
} from '@angular/material'

import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { DzgjComponent } from './dzgj/dzgj.component';
import { DqzjComponent } from './dqzj/dqzj.component';
import { from } from 'rxjs';
import { RecordsComponent } from './records/records.component';

@NgModule({
  declarations: [
    AppComponent,
    DzgjComponent,
    DqzjComponent,
    RecordsComponent
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
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
