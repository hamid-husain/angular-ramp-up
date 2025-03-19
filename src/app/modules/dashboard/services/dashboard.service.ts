import { Injectable } from '@angular/core';
import { getDocs, getFirestore, collection, addDoc, query, where, orderBy, limit, startAfter, DocumentSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private firestore=getFirestore()

  authors = new Set<string>
  tags = new Set<string>

  constructor() { }

  async fetchArticles(filter:{author: string, tag: string, created_at: Date | null}, pageSize:number, lastVisible:DocumentSnapshot|null){
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      let articleQuery = query(articlesCollection, orderBy('created_at'), limit(pageSize))

      if(filter.author){
        articleQuery = query(articleQuery,where('author','==',filter.author))
      }
      if(filter.tag){
        articleQuery = query(articleQuery, where('tag', '==', filter.tag));
      }
      if(filter.created_at){
        const selectedDate= new Date()
        selectedDate.setDate(filter.created_at.getDate());
        selectedDate.setHours(0, 0, 0, 0);
        const nextDay = new Date();
        nextDay.setDate(selectedDate.getDate() + 1);
        nextDay.setHours(0,0,0,0);
        articleQuery = query(articleQuery, where('created_at', '>=', selectedDate), where('created_at','<',nextDay));
      }

      if(lastVisible){
        articleQuery = query(articleQuery, startAfter(lastVisible))
      }
      const articlesSnapshot = await getDocs(articleQuery);
      const articleList: any[] = [];
      let lastVisibleDoc: DocumentSnapshot | null = null;
      articlesSnapshot.forEach((doc) => {
        const article=doc.data()
        articleList.push({
          id: doc.id,
          ...article,
          created_at: article['created_at'].toDate()
        });
        lastVisibleDoc = doc;
        if(article['author']){
          this.authors.add(article['author'])
        }
        if(article['tag']){
          this.tags.add(article['tag'])
        }
      });
      console.log(articleList);
      console.log(lastVisibleDoc)
      return {articleList, lastVisibleDoc};
    } catch (error) {
      console.error('Error fetching articles:', error);
      return { articleList: [], lastVisibleDoc: null };
    }
  }

  async getArticlesCount(filter:{author: string, tag: string, created_at: Date|null}){
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      let articleQuery = query(articlesCollection)

      if(filter.author){
        articleQuery = query(articleQuery,where('author','==',filter.author))
      }
      if(filter.tag){
        articleQuery = query(articleQuery, where('tag', '==', filter.tag));
      }
      if(filter.created_at){
        const selectedDate=new Date(filter.created_at);
        selectedDate.setUTCHours(0, 0, 0, 0);
        const nextDay = new Date(selectedDate);
        nextDay.setUTCDate(selectedDate.getUTCDate() + 1);
        articleQuery = query(articleQuery, where('created_at', '>=', selectedDate.getTime()), where('created_at','<',nextDay.getTime()));
      }

      const articlesSnapshot = await getDocs(articleQuery);
      return articlesSnapshot.size;
    } catch (error) {
      console.error('Error counting articles:', error);
      return 0;
    }
  }


  async addArticle(article: { title: string; desc: string, author:string, created_at:Date }) {
    try {
      const articlesCollection = collection(this.firestore, 'articles');
      await addDoc(articlesCollection, article);
      console.log('Article added successfully!');
    } catch (error) {
      console.error('Error adding article:', error);
    }
  }
}
