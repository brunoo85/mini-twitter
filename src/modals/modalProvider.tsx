import { useModal } from "@/hooks/use-auth-modal";
import { AuthModal } from "./auth-modal";
import { EditPostModal } from "./edit-post-modal";

export const ModalProvider = () => {
  const { data, type } = useModal();
  const post = data?.post;
  return (
    <>
      <AuthModal />
      <EditPostModal key={post?.id} />
      {/* //   <DeletePostModal /> */}
      {/* Adicione novos modais aqui conforme criar */}
    </>
  );
};
