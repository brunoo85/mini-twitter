import { useModal } from "@/hooks/use-auth-modal";
import { AuthModal } from "./auth-modal";
import { EditPostModal } from "./edit-post-modal";
import { DeletePostModal } from "./delete-post-modal";

export const ModalProvider = () => {
  const { data } = useModal();
  const post = data?.post;
  return (
    <>
      <AuthModal />
      <EditPostModal key={post?.id} />
      <DeletePostModal />
    </>
  );
};
