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
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      {/* Full-screen blocking overlay to prevent underlying dashboard content from being visible or interactive */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="w-full max-w-2xl rounded-xl bg-red-900/95 border border-red-700 text-white shadow-lg">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-200 mb-4">{error}</p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="rounded-lg bg-white/10 hover:bg-white/20 text-white border-white/20 px-4 py-2"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  );
}

export { ErrorAlert };