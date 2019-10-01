import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { ApiAuthService } from '../../services/apiAuthService';
import { ApiContactService } from '../../services/apiContactService';

@Component({
  selector: 'page-home-news',
  templateUrl: 'home-news.html'
})
export class HomeNewsPage {

  server = "http://localhost:9239/site-manager/news"
  userInfo: any;
  contacts = {}
  isShow = false

  constructor(private events: Events
    , private auth: ApiAuthService
    , private apiContact: ApiContactService
  ) { }

  ngOnInit() {
    setTimeout(() => {
      console.log(this.dynamicCards.items)
    }, 2000);
    this.refreshNews();
    this.events.subscribe('event-main-login-checked'
      , (data) => {
        console.log("789", data)
        this.userInfo = data
        this.contacts = this.apiContact.getUniqueContacts();
        Object.defineProperty(this.contacts, data, {
          value: {},
          writable: true, enumerable: true, configurable: true
        });

        this.getHomeNews();
      })
  }

  dynamicCards = {
    title: ""
    , buttons: [
      { color: "primary", icon: "photos", next: "ADD" }
    ]
    , items: []
  }

  async refreshNews() {
    console.log("1")
    //chay ham nay de KHOI TAO CAC USER PUBLIC
    await this.apiContact.getPublicUsers(true);
    console.log("2")
    //lay cac danh ba public
    this.contacts = this.apiContact.getUniqueContacts();
    //neu chua dang nhap thi lay cac tin cua user public
    if (!this.userInfo) this.getHomeNews();
    console.log("4")
  }

  getHomeNews() {
    console.log("456", this.contacts)
    this.getJsonPostNews()
      .then(data => {
        data.forEach(el => {
          this.dynamicCards.items.push(el);
        })
      })
      .catch(err => console.log(err))
  }

  getJsonPostNews() {
    let offset = 0;
    let limit = 2;
    let follows = [];
    for (let key in this.contacts) {
      follows.push(key);
    }

    let json_data = {
      limit: limit,
      offset: offset,
      follows: follows
    }
    return this.auth.postDynamicForm(this.server + "/get-news", json_data, true)
      .then(data => {
        let items = [];
        data.forEach(el => {
          items.push(el);
        });
        return items;
      })
      .catch(err => { return [] })
  }
}