/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PasajerosComponent } from './pasajeros.component';

describe('PasajerosComponent', () => {
  let component: PasajerosComponent;
  let fixture: ComponentFixture<PasajerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasajerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasajerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
