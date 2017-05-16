import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  private readonly titles = {
    configuration: 'Configuration',
    home: 'Pull Requests',
    accounts: 'Accounts'
  };
  title: string;

  constructor(private router: Router) {
    router.events
          .filter(event => event instanceof NavigationEnd)
          .map((event: any) => event.url)
          .map(url => url.substring(1) || 'home')
          .subscribe(titleKey => this.title = this.titles[titleKey]);
    // .subscribe(titleKey => console.log(titleKey));
  }

  ngOnInit() {
  }

}
