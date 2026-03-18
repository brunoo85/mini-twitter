import { useGetPosts } from "@/hooks/query/posts/useGetPosts";
import type { Post, PostsResponse, User } from "@/lib/types";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./authContext";

interface PostsContextType {
  posts: PostsResponse | null;
  currentUser: User | null;
  updatePost: (
    id: string,
    data: Partial<Pick<Post, "title" | "content" | "image">>,
  ) => void;
  deletePost: (id: string) => void;
  toggleLike: (id: string) => void;
  loadMorePosts: () => void;
  hasMore: boolean;
}

// const initialState: PostsContextType = {
//   posts: [], // array vazio por padrão
//   loadMorePosts: () => {},
//   hasMore: true,
// };

const PostsContext = createContext<PostsContextType | undefined>(undefined);

// function generateMorePosts(startIndex: number, count: number): Post[] {
//   const authors = [
//     {
//       id: 77,
//       name: "Lucas Oliveira",
//       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
//     },
//     {
//       id: 88,
//       name: "Fernanda Souza",
//       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda",
//     },
//     {
//       id: 99,
//       name: "Carlos Mendes",
//       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
//     },
//     {
//       id: 101,
//       name: "Beatriz Ramos",
//       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz",
//     },
//     {
//       id: 102,
//       name: "Gabriel Ferreira",
//       avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel",
//     },
//   ];

//   const titles = [
//     "Pensamento do dia",
//     "Nova descoberta!",
//     "Compartilhando experiências",
//     "Momento especial",
//     "Reflexões",
//     "Atualização importante",
//     "Dica rápida",
//     "Inspiração diária",
//   ];

//   const contents = [
//     "A vida é feita de pequenos momentos que se tornam grandes memórias.",
//     "Acabei de terminar um livro incrível! Recomendo muito para quem gosta de aventura.",
//     "O café da manhã de hoje foi especial. Nada como começar o dia com energia!",
//     "Trabalhando em algo novo e empolgante. Em breve compartilho mais!",
//     "A música tem o poder de transformar nosso humor instantaneamente.",
//     "Gratidão por mais um dia cheio de oportunidades.",
//     "Aprender algo novo todos os dias nos mantém jovens de espírito.",
//     "O importante não é a velocidade, mas a direção que seguimos.",
//   ];

//   const images = [
//     "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop",
//     "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
//     "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
//     undefined,
//     "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
//     undefined,
//     "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
//     undefined,
//   ];

//   return Array.from({ length: count }, (_, i) => {
//     const index = startIndex + i;
//     const author = authors[index % authors.length];
//     const imageUrl = images[index % images.length];
//     return {
//       id: index,
//       title: titles[index % titles.length],
//       content: contents[index % contents.length],
//       image: imageUrl ? new URL(imageUrl) : undefined,
//       authorId: author.id,
//       authorName: author.name,
//       createdAt: new Date(Date.now() - (21600000 + index * 3600000)),
//       likesCount: Math.floor(Math.random() * 100),
//       likedByUser: Math.random() > 0.7,
//     };
//   });
// }

export function PostsProvider({ children }: { children: ReactNode }) {
  const [loadedCount, setLoadedCount] = useState(5);
  const [hasMore, setHasMore] = useState(true);
  const { currentUser } = useAuth();
  const { data: posts } = useGetPosts();

  const updatePost = useCallback(
    (id: string, data: Partial<Pick<Post, "title" | "content" | "image">>) => {
      // setPosts((prev) =>
      //   prev.map((post) => (post.id === _id ? { ...post, ..._data } : post)),
      // );
    },
    [],
  );

  const deletePost = useCallback((id: string) => {
    // setPosts((prev) => prev.filter((post) => post.id !== _id));
  }, []);

  const toggleLike = useCallback((id: string) => {
    // setPosts((prev) =>
    //   prev.map((post) =>
    //     post.id === _id
    //       ? {
    //           ...post,
    //           likedByUser: !post.likedByUser,
    //           likes: post.likedByUser
    //             ? post.likesCount - 1
    //             : post.likesCount + 1,
    //         }
    //       : post,
    //   ),
    // );
  }, []);

  const loadMorePosts = useCallback(() => {
    if (loadedCount >= 50) {
      setHasMore(false);
      return;
    }
    // const newPosts = generateMorePosts(loadedCount, 5);
    // setPosts((prev) => [...prev, ...newPosts]);
    setLoadedCount((prev) => prev + 5);
  }, [loadedCount]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        currentUser,
        updatePost,
        deletePost,
        toggleLike,
        loadMorePosts,
        hasMore,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
