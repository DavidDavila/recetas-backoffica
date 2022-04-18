import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ExternalRecipesService } from './external-recipes.service';

@Component({
  selector: 'app-external-recipes',
  templateUrl: './external-recipes.component.html',
  styleUrls: ['./external-recipes.component.scss'],
})
export class ExternalRecipesComponent implements OnInit {
  info: any;
  ingredientsHTML: string = '';
  private url = '';
  constructor(private externalRecipesService: ExternalRecipesService) {}

  async ngOnInit(): Promise<void> {
    this.getUrl();
  }
  async getUrl() {
    this.url = await this.externalRecipesService.getUrl();
    console.log(this.url);
    const recipePage = await this.externalRecipesService.getHtml(this.url);
    const { info, ingredientsHTML } = await this.externalRecipesService.getData(
      recipePage
    );
    this.info = info;
    this.ingredientsHTML = ingredientsHTML;
  }
}
