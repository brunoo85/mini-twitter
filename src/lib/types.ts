export interface Post {
  id: number;
  title: string;
  content: string;
  image?: URL;
  authorId: number;
  authorName: string;
  createdAt: Date;
  likesCount: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
