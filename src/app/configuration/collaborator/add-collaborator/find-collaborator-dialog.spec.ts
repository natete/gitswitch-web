import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindCollaboratorDialog } from './find-collaborator-dialog.component';

describe('CollaboratorComponent', () => {
  let component: FindCollaboratorDialog;
  let fixture: ComponentFixture<FindCollaboratorDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindCollaboratorDialog]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindCollaboratorDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
