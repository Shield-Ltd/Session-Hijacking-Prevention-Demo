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
};

function ErrorAlert({ error, isOpen, onClose }: ErrorAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Login Error</AlertDialogTitle>
          <AlertDialogDescription>
            {error}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction className="rounded-lg" onClick={onClose}>
          Close
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ErrorAlert };