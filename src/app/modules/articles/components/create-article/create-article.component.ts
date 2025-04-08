import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { firstValueFrom } from 'rxjs';

import { constants } from '@app/app.constants';
import { AuthService } from '@app/shared/authServices/auth.service';
import { ArticlesService } from '@modules/articles/services/articles.service';
import { ButtonComponent } from '@shared/button/button.component';

function descriptionValidator(
  control: AbstractControl
): ValidationErrors | null {
  const words = control.value ? control.value.trim().split(/\s+/) : [];
  return words.length > 1000 ? { maxWordsExceeded: true } : null;
}

function tagsValidator(control: AbstractControl): ValidationErrors | null {
  const tags = (control.value as string[]) || [];

  if (!Array.isArray(tags)) {
    return { invalidType: true };
  }

  if (tags.length > 5) {
    return { maxTagsExceeded: true };
  }

  if (tags.some(tag => tag.length > 12)) {
    return { tagTooLong: true };
  }

  const uniqueTags = new Set(tags.map(tag => tag.toLowerCase()));
  if (uniqueTags.size !== tags.length) {
    return { duplicateTags: true };
  }

  if (tags.some(tag => tag.trim() === '')) {
    return { emptyTag: true };
  }

  return null;
}

@Component({
  selector: 'app-create-article',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  author = '';
  email = '';
  created_at: Date = new Date();
  editMode = false;
  articleID: string | null = '';
  readonly reactiveKeywords = signal<string[]>([]);
  user$;

  constructor(
    private authService: AuthService,
    private articleServices: ArticlesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toast: HotToastService
  ) {
    this.user$ = this.authService.currentUser$;

    this.articleForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      desc: new FormControl('', [Validators.required, descriptionValidator]),
      tags: new FormControl<string[]>([], tagsValidator),
    });
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.author = user.displayName!;
        this.email = user.email!;
      }
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.articleID = params.get(constants.ID);
      if (this.articleID) {
        this.editMode = true;
        this.loadArticle();
      }
    });
  }

  /**
   * function to remove tags entry
   * @param keyword
   */
  removeReactiveKeyword(keyword: string) {
    const updated = this.reactiveKeywords().filter(k => k !== keyword);

    this.reactiveKeywords.set(updated);
    this.articleForm.get('tags')?.setValue(updated);
  }

  get tagsControl(): FormControl {
    return this.articleForm.get('tags') as FormControl;
  }

  /**
   * function to add tags entry
   * @param event
   */
  addReactiveKeyword(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value && !this.reactiveKeywords().includes(value)) {
      const updated = [...this.reactiveKeywords(), value];

      this.reactiveKeywords.set(updated);
      this.articleForm.get('tags')?.setValue(updated);
    }
    event.chipInput!.clear();
  }

  /**
   * populate articles for edit
   * @returns Promise<void>
   */
  async loadArticle(): Promise<void> {
    if (this.articleID) {
      try {
        const article = await this.articleServices.loadArticleByID(
          this.articleID
        );
        if (article) {
          const user = await firstValueFrom(this.user$);
          if (user?.email != article.email) {
            this.toast.error(constants.ERR_UNAUTHORIZED);
            this.router.navigate([
              `${constants.ROUTES.ARTICLE}/${this.articleID}`,
            ]);
            return;
          }
          this.reactiveKeywords.set(article.tags);
          this.articleForm.patchValue({
            title: article.title,
            desc: article.desc,
            tags: article.tags,
          });
        }
      } catch (error) {
        console.error(constants.ERR_LOADING_FOR_EDITING, error);
      }
    }
  }

  /**
   * save or update article in database
   * @param article
   * @returns Promise<void>
   */
  async saveArticle(article: {
    title: string;
    desc: string;
    author: string;
    created_at: Date;
    tags: string[];
  }): Promise<void> {
    try {
      if (this.editMode && this.articleID) {
        await this.articleServices.updateArticle(this.articleID, article);
      } else {
        await this.articleServices.addArticle(article);
      }
    } catch (error) {
      console.error(constants.ERR_SAVING_ARTICLE, error);
    }
  }

  /**
   * creates article
   * @returns Promise<void>
   */
  async createArticle(): Promise<void> {
    if (!this.articleForm.valid) {
      return;
    }
    const newArticle = {
      title: this.articleForm.value.title,
      desc: this.articleForm.value.desc,
      author: this.author,
      created_at: this.created_at,
      tags: this.articleForm.value.tags,
      email: this.email,
    };

    await this.saveArticle(newArticle);
    if (this.articleID) {
      this.router.navigate([`${constants.ROUTES.ARTICLE}/${this.articleID}`]);
    } else {
      this.router.navigate([constants.ROUTES.DASHBOARD]);
    }
  }

  /**
   * cancel and go back
   */
  cancel(): void {
    if (this.articleID) {
      this.router.navigate([`${constants.ROUTES.ARTICLE}/${this.articleID}`]);
    } else {
      this.router.navigate([constants.ROUTES.DASHBOARD]);
    }
  }
}
