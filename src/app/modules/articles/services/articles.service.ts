import { Injectable } from '@angular/core';
import { constants } from '@app/app.constants';
import { Article } from '@app/core/models/article.model';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private firestore = getFirestore();

  async addArticle(article: {
    title: string;
    desc: string;
    author: string;
    created_at: Date;
    tags: string[];
  }) {
    try {
      const articlesCollection = collection(this.firestore, constants.ARTICLES);
      await addDoc(articlesCollection, article);
    } catch (error) {
      console.error(constants.ERR_ADDING_ARTICLE, error);
    }
  }

  async loadArticleByID(articleID: string) {
    const docRef = doc(this.firestore, constants.ARTICLES, articleID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const article = docSnap.data();
      return {
        id: docSnap.id,
        ...article,
        created_at: article[constants.CREATED_AT].toDate(),
      } as Article;
    } else {
      throw new Error(constants.ERR_ARTICLE_NOT_FOUND);
    }
  }

  async updateArticle(
    id: string,
    article: {
      title: string;
      desc: string;
      author: string;
      created_at: Date;
      tags: string[];
    }
  ): Promise<void> {
    const docRef = doc(this.firestore, constants.ARTICLES, id);
    await updateDoc(docRef, {
      title: article.title,
      desc: article.desc,
      author: article.author,
      created_at: article.created_at,
      tags: article.tags,
    });
  }

  async deleteArticle(id: string): Promise<void> {
    const docRef = doc(this.firestore, constants.ARTICLES, id);
    await deleteDoc(docRef);
  }
}
