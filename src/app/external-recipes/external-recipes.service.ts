import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import * as similarity from 'string-similarity';
import { createFeatureSelector, Store } from '@ngrx/store';
import { MIN_SIMILARITY } from 'src/conf/conf';
@Injectable({ providedIn: 'root' })
export class ExternalRecipesService {
  ingredients$: Observable<string[]> = this.store.select(
    createFeatureSelector<string[]>('ingredients')
  );
  page = 0;
  constructor(private httpClient: HttpClient, private store: Store<{}>) {}
  async getHtml(url: string): Promise<HTMLElement> {
    const htmlText = await firstValueFrom(
      this.httpClient.get(url, { responseType: 'text' })
    );
    const htmlNode = document.createElement('html');
    htmlNode.innerHTML = htmlText;
    return htmlNode;
  }
  async getData(page: HTMLElement) {
    const lists = Array.from(page.querySelectorAll('#Container ul'));
    const info = this.li2Object(lists[0]);

    const ingredientsArray = lists
      .filter((el, i) => i !== 0)
      .map((ul) =>
        Array.from(ul.querySelectorAll('li')).map((li) =>
          this.sinDiacriticos(li.textContent?.toLowerCase())
        )
      )
      .flat()
      .filter((v) => v);

    const ingredientsFinded = await this.checkSimilities(ingredientsArray);
    const ingredientsHTML = this.updateStrings(
      ingredientsArray,
      ingredientsFinded
    );
    return { info, ingredientsHTML };
  }
  updateStrings(
    ingredientsArray: (string | undefined)[],
    ingredientsFinded: any
  ) {
    console.log(ingredientsFinded);
    return ingredientsArray
      .map((line, i) => {
        if (!ingredientsFinded[i]) {
          return `<li class="no-ing">${line}</li>`;
        }
        if (ingredientsFinded[i][1].rating === 1 && line) {
          return `
        <li>
        ${line.replace(
          new RegExp(ingredientsFinded[i][0], 'gim'),
          `<span class="ingredient-finded">${ingredientsFinded[i][0]}</span>`
        )}
        </li>`;
        } else {
          return `
        <li>
        ${
          line &&
          line.replace(
            new RegExp(ingredientsFinded[i][0], 'gim'),
            `<span class="ingredient-question">${ingredientsFinded[i][0]}</span>`
          )
        }
        </li>`;
        }
      })
      .join('');
  }
  async checkSimilities(ingredientsPage: (string | undefined)[]) {
    const ingredientsStore = await firstValueFrom(this.ingredients$);

    let result = ingredientsPage.map((ingredientPage) => {
      if (ingredientPage) {
        return ingredientsStore
          .map((ingredientStore: string) => {
            const wordsLength = ingredientStore.split(' ').length;
            const pattern = `\\b[\\w']+(?:[^\\w\\n]+[\\w']+){0,${
              wordsLength - 1
            }}\\b`;
            const numberOfWordsRegExp = new RegExp(pattern, 'g');
            let ingredientPageCopy: string = ingredientPage;
            let result: any = [];
            let ingredientPageCopyArr = ingredientPageCopy.split(' ');

            while (ingredientPageCopyArr.length >= wordsLength) {
              const wordsToCompare = ingredientPageCopyArr
                .join(' ')
                .match(numberOfWordsRegExp);
              if (wordsToCompare) {
                const similarityResult = similarity.findBestMatch(
                  ingredientStore,
                  wordsToCompare
                );

                similarityResult.bestMatch.rating >= MIN_SIMILARITY &&
                  result.push({
                    target: similarityResult.bestMatch.target,
                    rating: similarityResult.bestMatch.rating,
                    compareWord: ingredientStore,
                  });
              }

              ingredientPageCopyArr = ingredientPageCopyArr.filter(
                (word, i) => i !== 0
              );
            }

            const maxRating = Math.max.apply(
              Math,
              result.map((o: any) => {
                return o.rating;
              })
            );

            return result.find((sim: any) => sim.rating === maxRating);
          })
          .filter((v) => v)
          .flat()
          .reduce((acc, el) => {
            if (!acc[el.target] || acc[el.target].rating < el.rating) {
              acc[el.target] = {
                compareWord: el.compareWord,
                rating: el.rating,
              };
            }
            return acc;
          }, {});
      } else {
        return null;
      }
    });

    let res = Object.values(result).map((v) => {
      const ing = Object.entries(v);
      if (ing.length > 1) {
        const maxRating = Math.max.apply(
          Math,
          ing.map((o: any) => {
            return o[1].rating;
          })
        );
        const maxValues = ing.filter((v: any) => v[1].rating === maxRating);

        const maxLength = Math.max.apply(
          Math,
          maxValues.map((o: any) => {
            return o[1].compareWord.split(' ').length;
          })
        );
        const maxLengthResult = maxValues.filter(
          (v: any) => v[1].compareWord.split(' ').length === maxLength
        );

        return maxLengthResult[0];
      } else {
        return ing[0];
      }
    });
    return res;
  }
  li2Object(ul: Element) {
    return Array.from(ul.querySelectorAll('li')).map((li: HTMLLIElement) => {
      const strong = li.querySelector('strong');
      const title = strong?.textContent;
      li.removeChild(strong as Node);
      const value = li.textContent;
      return { title, value: value?.replace('\n: ', '') };
    });
  }
  sinDiacriticos(str?: string) {
    let de = 'ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç',
      a = 'AAAAAEEEEIIIIOOOOUUUUNCaaaaaeeeeiiiioooouuuunc',
      re = new RegExp('[' + de + ']', 'ug');

    return str?.replace(re, (match: any) => a.charAt(de.indexOf(match)));
  }
  async getUrl() {
    const { urls } = (await firstValueFrom(
      this.httpClient.get('../../assets/urls-recipes.json')
    )) as { urls: string[] };
    this.page++;
    return urls[this.page];
  }
}
