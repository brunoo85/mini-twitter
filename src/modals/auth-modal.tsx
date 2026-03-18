import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-auth-modal";
import { useNavigate } from "react-router-dom";

export const AuthModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "auth";
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose();
    navigate("/");
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Autenticação necessária</DialogTitle>
          <DialogDescription>
            Você precisa estar logado para realizar esta ação.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancelar</button>
          <Button onClick={handleRedirect}>Login/cadastro</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
