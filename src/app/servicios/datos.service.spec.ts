/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatosService } from './datos.service';

describe('DatosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatosService]
    });
  });

  it('should ...', inject([DatosService], (service: DatosService) => {
    expect(service).toBeTruthy();
  }));
});
