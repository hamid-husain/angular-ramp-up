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
import { ArticlesService } from '@modules/articles/services/articles.service';
import { AuthServicesService } from '@modules/auth/services/auth-services.service';
import { firstValueFrom } from 'rxjs';

function tagsValidator(control: AbstractControl): ValidationErrors | null {
  const tags: string[] = control.value
    ? control.value
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '')
    : [];

  if (tags.length > 5) {
    return { maxTagsExceeded: true };
  }

  const invalidTag = tags.find(tag => tag.length > 12);
  if (invalidTag) {
    return { tagTooLong: true };
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
  ],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss',
})
export class CreateArticleComponent implements OnInit {
  articleForm: FormGroup;
  author = '';
  created_at: Date = new Date();
  tags: string[] = [];
  editMode = false;
  articleID: string | null = '';
  user$;

  constructor(
    private authService: AuthServicesService,
    private articleServices: ArticlesService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.user$ = this.authService.currentUser$;

    this.articleForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(40),
      ]),
      desc: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      tagInput: new FormControl('', [tagsValidator]),
    });
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.author = user.displayName!;
      }
    });
    this.activatedRoute.paramMap.subscribe(params => {
      this.articleID = params.get('id');
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
            this.router.navigate(['/dashboard']);
            return;
          }

          console.log(article);
          this.articleForm.patchValue({
            title: article.title,
            desc: article.desc,
            tagInput: article.tags.join(', '),
          });
        }
      } catch (error) {
        console.error('Error loading article for editing:', error);
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
        console.log('Updated article:', article);
      } else {
        await this.articleServices.addArticle(article);
        console.log('Saved new article:', article);
      }
    } catch (error) {
      console.error('Error saving article:', error);
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
    };

    await this.saveArticle(newArticle);
    this.router.navigate(['/dashboard']);
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }
}
