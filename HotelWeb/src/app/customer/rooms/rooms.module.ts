import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomsComponent } from './rooms.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: RoomsComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), RoomsComponent],
})
export class RoomsModule {}
