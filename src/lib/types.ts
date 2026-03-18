export interface Post {
  id: number;
  title: string;
  content: string;
  image?: URL;
  authorId: number;
  authorName: string;
  createdAt: Date;
  likesCount: number;
  likedByUser: boolean;
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
