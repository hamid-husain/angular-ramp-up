import { Injectable } from '@angular/core';

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

import { constants } from '@app/app.constants';
import { Article } from '@app/core/models/article.model';
import { Filter } from '@app/core/models/filter.model';

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
      const articlesCollection = collection(this.firestore, constants.ARTICLES);
      let articleQuery = query(
        articlesCollection,
        orderBy(constants.CREATED_AT),
        limit(pageSize)
      );

      if (filter.author) {
        articleQuery = query(
          articleQuery,
          where(constants.AUTHOR, '==', filter.author)
        );
      }

      if (filter.created_at) {
        const selectedDate = new Date(filter.created_at);
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        articleQuery = query(
          articleQuery,
          where(constants.CREATED_AT, '>=', selectedDate),
          where(constants.CREATED_AT, '<', nextDay)
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
          title: article[constants.TITLE],
          desc: article[constants.DESC],
          tags: article[constants.TAGS],
          created_at: article[constants.CREATED_AT].toDate(),
          author: article[constants.AUTHOR],
          email: article[constants.EMAIL],
        });
      });

      const filteredArticles: Article[] = articleList.filter(article => {
        return filter.tags.every(
          tag => article.tags && article.tags.includes(tag)
        );
      });

      return { articleList: filteredArticles, lastVisibleDoc, firstVisibleDoc };
    } catch (error) {
      console.error(constants.ERR_FETCHING_ARTICLE, error);
      return { articleList: [], lastVisibleDoc: null, firstVisibleDoc: null };
    }
  }

  async getArticlesCount(filter: Filter) {
    try {
      const articlesCollection = collection(this.firestore, constants.ARTICLES);
      let articleQuery = query(articlesCollection);

      if (filter.author) {
        articleQuery = query(
          articleQuery,
          where(constants.AUTHOR, '==', filter.author)
        );
      }

      if (filter.created_at) {
        const selectedDate = new Date(filter.created_at);
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setDate(selectedDate.getDate() + 1);
        nextDay.setHours(0, 0, 0, 0);
        articleQuery = query(
          articleQuery,
          where(constants.CREATED_AT, '>=', selectedDate),
          where(constants.CREATED_AT, '<', nextDay)
        );
      }

      let count = 0;
      const articlesSnapshot = await getDocs(articleQuery);
      articlesSnapshot.forEach(doc => {
        const article = doc.data();
        if (
          filter.tags.every(
            tag =>
              article[constants.TAGS] && article[constants.TAGS].includes(tag)
          )
        ) {
          count++;
        }

        if (article[constants.AUTHOR]) {
          this.authors.add(article[constants.AUTHOR]);
        }
        if (article[constants.TAGS]) {
          article[constants.TAGS].forEach((tag: string) => {
            this.tags.add(tag);
          });
        }
      });

      return count;
    } catch (error) {
      console.error(constants.ERR_COUNTING_ARTICLE, error);
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
      const articlesCollection = collection(this.firestore, constants.ARTICLES);
      await addDoc(articlesCollection, article);
    } catch (error) {
      console.error(constants.ERR_ADDING_ARTICLE, error);
    }
  }
}
