import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { NotaTotalComponent } from './nota-total/nota-total.component';
import { NotaIndividualComponent } from './nota-individual/nota-individual.component';

export const routes: Routes = [
    { path: 'inicio', component: InicioComponent },
    { path: 'nota-total', component: NotaTotalComponent },
    { path: 'nota-individual', component: NotaIndividualComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'inicio'}
];
