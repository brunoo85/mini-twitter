export interface Post {
  id: string;
  title: string;
  content: string;
  image?: URL;
  authorId: string;
  authorName: string;
  createdAt: Date;
  likesCount: number;
  likedByUser: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
}
