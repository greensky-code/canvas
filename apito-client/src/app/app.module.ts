import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { StudioComponent } from './studio/studio.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { ToastrModule } from 'ngx-toastr';
import { AuthInterceptor } from './services/auth-interceptor'
import { ErrorInterceptor } from './services/error-interceptor';
import { CreateComponent } from './modal/create/create.component'
import { MatDialogModule } from '@angular/material/dialog';
import { AddUserComponent } from './modal/add-user/add-user.component';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { DesignComponent } from './design/design.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';



import { environment } from '../environments/environment';
import { ProfileComponent } from './profile/profile.component';
import { PersonComponent } from './person/person.component';
import { CompanyComponent } from './company/company.component';
import { SubmenuComponent } from './submenu/submenu.component';
import { PersonAddEditComponent } from './dialog/person-add-edit/person-add-edit.component';
import { CompanyAddEditComponent } from './dialog/company-add-edit/company-add-edit.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ConfirmBoxComponent } from './dialog/confirm-box/confirm-box.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    HomeComponent,
    StudioComponent,
    CreateComponent,
    AddUserComponent,
    LandingComponent,
    HeaderComponent,
    DesignComponent,
    ProfileComponent,
    PersonComponent,
    CompanyComponent,
    SubmenuComponent,
    PersonAddEditComponent,
    CompanyAddEditComponent,
    ChangePasswordComponent,
    ConfirmBoxComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    MatDialogModule,
    MatSliderModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatDatepickerModule,
    MatButtonModule,
    MatCardModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    })    
  ],
  providers: [
    {provide: Document, useValue: document},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  entryComponents: [
    CreateComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
