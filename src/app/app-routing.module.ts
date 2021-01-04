import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DzgjComponent } from './dzgj/dzgj.component';

const routes: Routes = [
    { path: '/dzgj', component: DzgjComponent},
    { path: '', redirectTo: '/dzgj', pathMatch: 'full' },
    { path: '**', redirectTo: '/dzgj' },
];

@NgModule({
    imports: [],
    exports: [RouterModule]
})
export class AppRoutingModule { }