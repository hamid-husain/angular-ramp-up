import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthServicesService } from '../../../auth/services/auth-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-create-article',
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.scss'
})
export class CreateArticleComponent {
  title: string = '';
  desc: string = '';
  author: string = '';
  created_at: Date = new Date();
  tag: string = '' ;
  editMode: boolean = false;
  articleID: string|null = '';
  user$;

  constructor(private authService:AuthServicesService, private articleServices:ArticlesService, private router:Router, private activatedRoute:ActivatedRoute){
    this.user$=this.authService.currentUser$
  }

  ngOnInit(){
    this.user$.subscribe(user=>{
      if(user){
        this.author=user.displayName!
      }
    });
    this.activatedRoute.paramMap.subscribe((params) => {
      this.articleID = params.get('id');
      if (this.articleID) {
        this.editMode = true;
        this.loadArticle();
      }
    });
  }

  async loadArticle(){
    if (this.articleID) {
      try {
        const article = await this.articleServices.loadArticleByID(this.articleID);
        if (article) {
          console.log(article)
          this.title = article.title;
          this.desc = article.desc;
          this.tag = article.tag;
        }
      } catch (error) {
        console.error('Error loading article for editing:', error);
      }
    }
  }

  async saveArticle(article: { title: string; desc: string, author:string, created_at:Date, tag:string }): Promise<void>{
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

  async createArticle(){
    const newArticle = {
      title: this.title,
      desc: this.desc,
      author: this.author,
      created_at: this.created_at,
      tag: this.tag
    };

    await this.saveArticle(newArticle);
    this.router.navigate(['/dashboard']);
  }

  cancel(){
    this.router.navigate(['/dashboard'])
  }
}
