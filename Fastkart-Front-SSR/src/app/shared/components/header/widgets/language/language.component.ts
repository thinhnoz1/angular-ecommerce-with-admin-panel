import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss']
})
export class LanguageComponent {

  @Input() style: string = 'basic';

  public active: boolean = false;
  public languages: any[] = [
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

  public selectedLanguage: any = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }

  constructor(private translate: TranslateService) {
    this.selectLanguage(this.selectedLanguage)
  }

  selectLanguage(language: any){
    this.active = false;
    this.translate.use(language.code);
    this.selectedLanguage = language;
  }


  openDropDown(){
    this.active = !this.active;
  }


  hideDropdown(){
    this.active = false;
  }

}
