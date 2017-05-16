import { animate, Component, Input, OnInit, style, transition, trigger } from '@angular/core';
import { Repository } from './repository';
import { CollaboratorService } from '../collaborator/collaborator.service';
import { SpinnerService } from '../../shared/providers/spinner.service';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: '0', opacity: '0', transform: 'translateY(-100px)' }),
        animate(".7s ease", style({ height: '*', opacity: '1', transform: 'translateY(0px)' }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: '1', transform: 'translateX(0)'}),
        animate(".7s ease", style({ height: '0', opacity: 0, transform: 'translateY(-100px)' }))
      ])
    ])
  ]
})
export class RepositoryComponent implements OnInit {

  @Input() repository: Repository;
  @Input() userFound: boolean;
  unfolded: boolean = undefined;


  constructor(private collaboratorService: CollaboratorService,
              private spinnerService: SpinnerService,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
  }

  toggleSubsection() {
    (this.unfolded && this.unfolded !== undefined) ? this.unfolded = false : this.unfolded = true;
  }

  /**
   * Select a repository of de list
   * @param repository data of repository.
   */
  selectedRepository(repository){
    repository.selected = !repository.selected;
  }

  deleteCollaborator(username) {
    if (username){
      this.spinnerService.showSpinner();
      this.collaboratorService.deleteCollaborator(this.repository, username)
          .do(() => this.spinnerService.hideSpinner())
          .do(() => this.snackBar.open('Collaborator successfully removed', null, { duration: 2000 } as MdSnackBarConfig))
          .subscribe(
            () => {
              this.repository.collaborators = this.repository.collaborators.filter(col => col.username !== username)
            },
            error => console.error(error),
            () => console.log('completed')
          );
    }
  }
}
