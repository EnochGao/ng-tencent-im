import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { NzFormModule } from 'ng-zorro-antd/form';

import { NzMessageModule } from 'ng-zorro-antd/message';
import { TencentTimModule } from 'ng-tencent-im';
import { extModules } from 'src/environments/environment';
import { LoginComponent } from './login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';

registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzButtonModule,
    NzMessageModule,
    TencentTimModule.forRoot({
      level: 4,
      sdkAppId: 1400440675
    }),
    extModules
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
