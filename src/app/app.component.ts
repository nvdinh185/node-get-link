import { Component } from '@angular/core';
import { HomeNewsPage } from '../pages/home-news/home-news';
import { Events } from 'ionic-angular';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage: any = HomeNewsPage;

  constructor(public events: Events) { }

  ngOnInit() {
    setTimeout(() => {
      this.events.publish('event-main-login-checked', "766777123");
    }, 10);
  }
}

