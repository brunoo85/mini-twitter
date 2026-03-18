"use client";

import type { Post, User } from "@/lib/types";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const CURRENT_USER: User = {
  id: "user-1",
  name: "Você",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
};

const INITIAL_POSTS: Post[] = [
  {
    id: "1",
    title: "Bem-vindos ao Feed!",
    content:
      "Este é o primeiro post do nosso feed social. Compartilhe suas ideias e conecte-se com outros usuários!",
    authorId: "user-2",
    authorName: "Maria Silva",
    createdAt: new Date(Date.now() - 3600000),
    likesCount: 15,
    likedByUser: false,
  },
  {
    id: "2",
    title: "Dicas de Produtividade",
    content:
      "Aqui estão algumas dicas para melhorar sua produtividade: 1. Defina metas claras 2. Use a técnica Pomodoro 3. Faça pausas regulares",
    authorId: "user-3",
    authorName: "João Santos",
    createdAt: new Date(Date.now() - 7200000),
    likesCount: 32,
    likedByUser: true,
  },
  {
    id: "3",
    title: "Paisagem incrível",
    content:
      "Olha essa vista que encontrei durante minha viagem! A natureza é simplesmente maravilhosa.",
    authorId: "user-4",
    authorName: "Ana Costa",
    createdAt: new Date(Date.now() - 10800000),
    likesCount: 58,
    likedByUser: false,
  },
  {
    id: "4",
    title: "Novo projeto em andamento",
    content:
      "Estou muito animado com meu novo projeto de desenvolvimento. Mal posso esperar para compartilhar mais detalhes!",
    authorId: "user-1",
    authorName: "Você",
    createdAt: new Date(Date.now() - 14400000),
    likesCount: 8,
    likedByUser: false,
  },
  {
    id: "5",
    title: "Receita do dia",
    content:
      "Fiz um bolo de chocolate delicioso hoje! A receita é super simples e o resultado fica incrível. Quem quer a receita?",
    authorId: "user-5",
    authorName: "Pedro Lima",
    createdAt: new Date(Date.now() - 18000000),
    likesCount: 45,
    likedByUser: true,
  },
];

interface PostsContextType {
  posts: Post[];
  currentUser: User;
  addPost: (
    post: Omit<
      Post,
      | "id"
      | "authorId"
      | "authorName"
      | "authorAvatar"
      | "createdAt"
      | "likes"
      | "likedByUser"
    >,
  ) => void;
  updatePost: (
    id: string,
    data: Partial<Pick<Post, "title" | "content" | "image">>,
  ) => void;
  deletePost: (id: string) => void;
  toggleLike: (id: string) => void;
  loadMorePosts: () => void;
  hasMore: boolean;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

function generateMorePosts(startIndex: number, count: number): Post[] {
  const authors = [
    {
      id: "user-6",
      name: "Lucas Oliveira",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    },
    {
      id: "user-7",
      name: "Fernanda Souza",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fernanda",
    },
    {
      id: "user-8",
      name: "Carlos Mendes",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
    },
    {
      id: "user-9",
      name: "Beatriz Ramos",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=beatriz",
    },
    {
      id: "user-10",
      name: "Gabriel Ferreira",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=gabriel",
    },
  ];

  const titles = [
    "Pensamento do dia",
    "Nova descoberta!",
    "Compartilhando experiências",
    "Momento especial",
    "Reflexões",
    "Atualização importante",
    "Dica rápida",
    "Inspiração diária",
  ];

  const contents = [
    "A vida é feita de pequenos momentos que se tornam grandes memórias.",
    "Acabei de terminar um livro incrível! Recomendo muito para quem gosta de aventura.",
    "O café da manhã de hoje foi especial. Nada como começar o dia com energia!",
    "Trabalhando em algo novo e empolgante. Em breve compartilho mais!",
    "A música tem o poder de transformar nosso humor instantaneamente.",
    "Gratidão por mais um dia cheio de oportunidades.",
    "Aprender algo novo todos os dias nos mantém jovens de espírito.",
    "O importante não é a velocidade, mas a direção que seguimos.",
  ];

  const images = [
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop",
    undefined,
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
    undefined,
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    undefined,
  ];

  return Array.from({ length: count }, (_, i) => {
    const index = startIndex + i;
    const author = authors[index % authors.length];
    const imageUrl = images[index % images.length];
    return {
      id: `generated-${index}`,
      title: titles[index % titles.length],
      content: contents[index % contents.length],
      image: imageUrl ? new URL(imageUrl) : undefined,
      authorId: author.id,
      authorName: author.name,
      createdAt: new Date(Date.now() - (21600000 + index * 3600000)),
      likesCount: Math.floor(Math.random() * 100),
      likedByUser: Math.random() > 0.7,
    };
  });
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [loadedCount, setLoadedCount] = useState(5);
  const [hasMore, setHasMore] = useState(true);

  const addPost = useCallback(
    (
      post: Omit<
        Post,
        | "id"
        | "authorId"
        | "authorName"
        | "authorAvatar"
        | "createdAt"
        | "likes"
        | "likedByUser"
      >,
    ) => {
      const newPost: Post = {
        ...post,
        id: `post-${Date.now()}`,
        authorId: CURRENT_USER.id,
        authorName: CURRENT_USER.name,
        createdAt: new Date(),
        likesCount: 0,
        likedByUser: false,
      };
      setPosts((prev) => [newPost, ...prev]);
    },
    [],
  );

  const updatePost = useCallback(
    (id: string, data: Partial<Pick<Post, "title" | "content" | "image">>) => {
      setPosts((prev) =>
        prev.map((post) => (post.id === id ? { ...post, ...data } : post)),
      );
    },
    [],
  );

  const deletePost = useCallback((id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
  }, []);

  const toggleLike = useCallback((id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              likedByUser: !post.likedByUser,
              likes: post.likedByUser
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post,
      ),
    );
  }, []);

  const loadMorePosts = useCallback(() => {
    if (loadedCount >= 50) {
      setHasMore(false);
      return;
    }
    const newPosts = generateMorePosts(loadedCount, 5);
    setPosts((prev) => [...prev, ...newPosts]);
    setLoadedCount((prev) => prev + 5);
  }, [loadedCount]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        currentUser: CURRENT_USER,
        addPost,
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
