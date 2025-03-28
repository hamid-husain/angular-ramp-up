import { Injectable } from '@angular/core';
import { Article } from '@app/core/models/article.model';
import { Filter } from '@app/core/models/filter.model';
import {
  addDoc,
  collection,
  DocumentSnapshot,
  endBefore,
  getDocs,
  getFirestore,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private firestore = getFirestore();

  authors = new Set<string>();
  tags = new Set<string>();

  async fetchArticles(
    filter: Filter,
    pageSize: number,
    lastVisible: DocumentSnapshot | null,
    firstVisible: DocumentSnapshot | null
  ) {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      let articleQuery = query(
        articlesCollection,
        orderBy('created_at'),
        limit(pageSize)
      );

      if (filter.author) {
        articleQuery = query(
          articleQuery,
          where('author', '==', filter.author)
        );
      }

      if (filter.created_at) {
        const selectedDate = new Date();
        selectedDate.setDate(filter.created_at.getDate());
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date();
        nextDay.setDate(selectedDate.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        articleQuery = query(
          articleQuery,
          where('created_at', '>=', selectedDate),
          where('created_at', '<', nextDay)
        );
      }

      if (lastVisible != null) {
        articleQuery = query(articleQuery, startAfter(lastVisible));
      }

      if (firstVisible != null) {
        articleQuery = query(
          articleQuery,
          endBefore(firstVisible),
          limitToLast(pageSize)
        );
      }

      const articlesSnapshot = await getDocs(articleQuery);
      const articleList: Article[] = [];
      const lastVisibleDoc: DocumentSnapshot | null =
        articlesSnapshot.docs[articlesSnapshot.size - 1];
      const firstVisibleDoc = articlesSnapshot.docs[0];
      articlesSnapshot.forEach(doc => {
        const article = doc.data();
        articleList.push({
          id: doc.id,
          title: article['title'],
          desc: article['desc'],
          tags: article['tags'],
          created_at: article['created_at'].toDate(),
          author: article['author'],
          email: article['email'],
        });
      });

      const filteredArticles: Article[] = articleList.filter(article => {
        return filter.tags.every(
          tag => article.tags && article.tags.includes(tag)
        );
      });

      return { articleList: filteredArticles, lastVisibleDoc, firstVisibleDoc };
    } catch (error) {
      console.error('Error fetching articles:', error);
      return { articleList: [], lastVisibleDoc: null, firstVisibleDoc: null };
    }
  }

  async getArticlesCount(filter: Filter) {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      let articleQuery = query(articlesCollection);

      if (filter.author) {
        articleQuery = query(
          articleQuery,
          where('author', '==', filter.author)
        );
      }

      if (filter.created_at) {
        const selectedDate = new Date();
        selectedDate.setDate(filter.created_at.getDate());
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date();
        nextDay.setDate(selectedDate.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        articleQuery = query(
          articleQuery,
          where('created_at', '>=', selectedDate),
          where('created_at', '<', nextDay)
        );
      }

      let count = 0;
      const articlesSnapshot = await getDocs(articleQuery);
      articlesSnapshot.forEach(doc => {
        const article = doc.data();
        if (
          filter.tags.every(
            tag => article['tags'] && article['tags'].includes(tag)
          )
        ) {
          count++;
        }

        if (article['author']) {
          this.authors.add(article['author']);
        }
        if (article['tags']) {
          article['tags'].forEach((tag: string) => {
            this.tags.add(tag);
          });
        }
      });

      return count;
    } catch (error) {
      console.error('Error counting articles:', error);
      return 0;
    }
  }

  async addArticle(article: {
    title: string;
    desc: string;
    author: string;
    created_at: Date;
  }) {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      await addDoc(articlesCollection, article);
    } catch (error) {
      console.error('Error adding article:', error);
    }
  }
}
