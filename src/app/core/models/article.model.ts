import { User } from './user.model';

export interface Article {
  id: string;
  title: string;
  desc: string;
  author: User;
  created_at: Date;
  updated_at: Date | null;
  tag: string;
}
