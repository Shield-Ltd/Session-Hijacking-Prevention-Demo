import Link from "next/link";
import { User, LogOut } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";

type DashboardUser = {
  email: string;
  name?: string;
};

type DashboardHeaderProps = {
  user: DashboardUser | null;
  showProfileMenu: boolean;
  onToggleProfileMenu: () => void;
  onCloseProfileMenu: () => void;
  onLogout: () => void;
};

export function DashboardHeader({
  user,
  showProfileMenu,
  onToggleProfileMenu,
  onCloseProfileMenu,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="px-4 md:px-6 h-14 flex items-center justify-between relative z-50">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <span className="text-lg font-medium">Session Hijacking</span>
      </Link>
      {user && (
        <div className="relative">
          <button
            onClick={onToggleProfileMenu}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-medium transition-all"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">
              {user.name ? user.name : user.email.split("@")[0]}
            </span>
          </button>
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={onCloseProfileMenu}
              />
              <div className="absolute right-0 top-14 z-50 w-64 bg-black/95 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-xl">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Profile</p>
                    <p className="text-white font-medium text-sm">
                      {user.email}
                    </p>
                  </div>
                  <GlassSurface
                    as="button"
                    onClick={() => {
                      onCloseProfileMenu();
                      onLogout();
                    }}
                    borderRadius={10}
                    className="w-full text-white flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </GlassSurface>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}

