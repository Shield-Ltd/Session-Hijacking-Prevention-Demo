import Squares from "@/components/ui/Squares";
import GlassSurface from "@/components/ui/GlassSurface";

export function LoadingScreen() {
  return (
    <div className="min-h-screen w-full h-full bg-black text-white">
      <div className="absolute inset-0 z-0">
        <Squares />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
        <GlassSurface borderRadius={20} className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white">Loading...</span>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}

