import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';

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
  const tags: string[] = control.value
    ? control.value
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '')
    : [];

  const uniqueTags = new Set(tags);

  if (tags.length > 5) {
    return { maxTagsExceeded: true };
  }

  const invalidTag = tags.find(tag => tag.length > 12);
  if (invalidTag) {
    return { tagTooLong: true };
  }

  if (tags.length !== uniqueTags.size) {
    return { duplicateTags: true };
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
  ],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent implements OnInit {
  titleString = constants.TITLE;

  articleForm: FormGroup;
  author = '';
  email = '';
  created_at: Date = new Date();
  tags: string[] = [];
  editMode = false;
  articleID: string | null = '';
  user$;

  constructor(
    private authService: AuthService,
    private articleServices: ArticlesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user$ = this.authService.currentUser$;

    this.articleForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      desc: new FormControl('', [Validators.required, descriptionValidator]),
      tagInput: new FormControl('', [tagsValidator]),
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

  updateTags() {
    this.tags = this.articleForm.value.tagInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string) => tag !== '');
  }

  async loadArticle() {
    if (this.articleID) {
      try {
        const article = await this.articleServices.loadArticleByID(
          this.articleID
        );
        if (article) {
          const user = await firstValueFrom(this.user$);
          if (user?.displayName != article.author) {
            this.router.navigate([constants.ROUTE_DASHBOARD]);
            return;
          }

          this.articleForm.patchValue({
            title: article.title,
            desc: article.desc,
            tagInput: article.tags.join(', '),
          });
        }
      } catch (error) {
        console.error(constants.ERR_LOADING_FOR_EDITING, error);
      }
    }
  }

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

  async createArticle() {
    if (!this.articleForm.valid) {
      return;
    }
    const newArticle = {
      title: this.articleForm.value.title,
      desc: this.articleForm.value.desc,
      author: this.author,
      created_at: this.created_at,
      tags: this.tags,
      email: this.email,
    };

    await this.saveArticle(newArticle);
    this.router.navigate([constants.ROUTE_DASHBOARD]);
  }

  cancel() {
    this.router.navigate([constants.ROUTE_DASHBOARD]);
  }
}
