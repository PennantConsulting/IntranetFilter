import { TestBed, inject } from '@angular/core/testing';

import { MediadataService } from './mediadata.service';


describe('MediadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediadataService]
    });
  });

  it('should be created', inject([MediadataService], (service: MediadataService) => {
    expect(service).toBeTruthy();
  }));
});
