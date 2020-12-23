import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablerosPrincipalComponent } from './tableros-principal.component';

describe('TablerosPrincipalComponent', () => {
  let component: TablerosPrincipalComponent;
  let fixture: ComponentFixture<TablerosPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablerosPrincipalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablerosPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
