import { TranslateService } from '@ngx-translate/core';
import { Component } from '@angular/core';

export interface Language {
  language: string;
  code: string;
  icon: string;
}

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent {

  public active: boolean = false;
  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
  ]
  
  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(private translate: TranslateService) {
    this.selectLanguage(this.selectedLanguage);
  }

  selectLanguage(language: Language) {
    this.active = false;
    this.translate.use(language.code);
    this.selectedLanguage = language;
  }

  clickHeaderOnMobile(){
    this.active = !this.active
  }

  hideDropdown(){
    this.active = false;
  }
  
}
