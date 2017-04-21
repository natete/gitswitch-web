import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-find-collaborator-dialog',
  templateUrl: './find-collaborator-dialog.component.html',
  styleUrls: ['./find-collaborator-dialog.component.scss']
})
export class FindCollaboratorDialog implements OnInit {

  title = 'Find user';

  constructor(public dialogRef: MdDialogRef<FindCollaboratorDialog>) { }

  ngOnInit() {
  }

}
