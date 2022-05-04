import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { loginReducer } from 'src/app/reducers/login.reducer';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';


const routes: Routes = [
  {
    path: '', component: LoginComponent
  }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('login', loginReducer),
    // EffectsModule.forRoot([AppEffect]),
    SharedModule
  ]
})
export class LoginModule { }
