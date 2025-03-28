import { Injectable } from '@angular/core';
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
      const articlesCollection = collection(this.firestore, 'articles');
      await addDoc(articlesCollection, article);
    } catch (error) {
      console.error('Error adding article:', error);
    }
  }

  async loadArticleByID(articleID: string) {
    const docRef = doc(this.firestore, 'articles', articleID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const article = docSnap.data();
      return {
        id: docSnap.id,
        ...article,
        created_at: article['created_at'].toDate(),
      } as Article;
    } else {
      throw new Error('Article not found');
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
    const docRef = doc(this.firestore, 'articles', id);
    await updateDoc(docRef, {
      title: article.title,
      desc: article.desc,
      author: article.author,
      created_at: article.created_at,
      tags: article.tags,
    });
  }

  async deleteArticle(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'articles', id);
    await deleteDoc(docRef);
  }
}
