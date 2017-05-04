/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PilotosComponent } from './pilotos.component';

describe('PilotosComponent', () => {
  let component: PilotosComponent;
  let fixture: ComponentFixture<PilotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
