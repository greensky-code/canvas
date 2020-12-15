import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudioComponent } from './studio/studio.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './services/auth-guard'
import { LandingComponent } from './landing/landing.component';
import { DesignComponent } from './design/design.component';
import { ProfileComponent } from './profile/profile.component'


const routes: Routes = [
  // {path: 'studio/:image/:id/:name', component: StudioComponent, canActivate: [AuthGuard]},
  // {path: 'studio/:id', component: StudioComponent, canActivate: [AuthGuard]},
  {path: 'design/:image/:id/:name', component: DesignComponent, canActivate: [AuthGuard]},
  {path: 'design/:id', component: DesignComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'sign', component: SignupComponent},
  // {path: 'design', component: DesignComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: '', component: LandingComponent},
  {path: '**', redirectTo: ''}
];

//canActivate: [AuthGuard]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
