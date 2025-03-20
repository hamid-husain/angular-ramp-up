import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

interface Article {
  id: string;
  title: string;
  desc: string;
  author: string;
  created_at: Date;
  tag: string;
}

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private firestore = getFirestore();

  constructor() {}

  async addArticle(article: {
    title: string;
    desc: string;
    author: string;
    created_at: Date;
  }) {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      await addDoc(articlesCollection, article);
      console.log('Article added successfully!');
    } catch (error) {
      console.error('Error adding article:', error);
    }
  }

  async loadArticleByID(articleID: string) {
    const docRef = doc(this.firestore, 'articles', articleID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const article = docSnap.data();
      return { id: docSnap.id, ...article } as Article;
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
      tag: string;
    }
  ): Promise<void> {
    const docRef = doc(this.firestore, 'articles', id);
    await updateDoc(docRef, {
      title: article.title,
      desc: article.desc,
      author: article.author,
      created_at: article.created_at,
      tag: article.tag,
    });
  }

  async deleteArticle(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, 'articles', id);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
}
