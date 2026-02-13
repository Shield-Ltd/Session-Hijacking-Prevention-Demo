export function DashboardContent() {
  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome to your secure session
          </h1>
          <p className="text-gray-400">Enjoyyyyyyyy!!!</p>
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white mb-3">
            Session Hijacking Protection
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">
                  Browser Fingerprinting Active
                </p>
                <p className="text-gray-400">
                  Your browser fingerprint is being monitored for security
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">Session Verification</p>
                <p className="text-gray-400">
                  Your session is verified on every request
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-green-400"></div>
              <div>
                <p className="text-white font-medium">
                  Automatic Logout Protection
                </p>
                <p className="text-gray-400">
                  If your session is accessed from a different device, you&apos;ll
                  be automatically logged out
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-xs font-medium">
              ⚠️ Security Notice
            </p>
            <p className="text-gray-300 text-xs mt-1">
              This system uses browser fingerprinting to detect session
              hijacking attempts. If you access your account from a different
              browser or device, you&apos;ll need to log in again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
