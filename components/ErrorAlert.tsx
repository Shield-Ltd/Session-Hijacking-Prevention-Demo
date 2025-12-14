import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

type ErrorAlertProps = {
  error: string | null;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

function ErrorAlert({ error, isOpen, onClose, title = "Error" }: ErrorAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-xl bg-black/90 border-white/20 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            {error}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction className="rounded-lg bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={onClose}>
          Close
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ErrorAlert };