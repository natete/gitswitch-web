import {Component, OnInit, Input, style, animate, transition, trigger} from '@angular/core';
import {Repository} from "./repository";
import { User } from '../collaborator/user/user';
import { CollaboratorService } from '../collaborator/collaborator.service';

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
  selectedIcon: string ='plus';


  constructor(private collaboratorService: CollaboratorService) {
  }

  ngOnInit() {

  }

  toggleSubsection() {
    (this.unfolded && this.unfolded !== undefined) ? this.unfolded = false : this.unfolded = true;
  }

  selectedRepository(repository){
    repository.selected = !repository.selected;
    if(repository.selected){
      this.selectedIcon = 'check';
    }else{
      this.selectedIcon = 'plus';
    }
  }

  getUserDelete(event) {
    if (event){
      this.collaboratorService.deleteCollaborator(this.repository, event);
    }
  }
}
