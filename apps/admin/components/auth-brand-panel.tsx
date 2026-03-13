export function AuthBrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-zinc-900 flex-col justify-between p-12">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Coffee Street</h1>
            <p className="text-xs text-zinc-500 tracking-wider">MANAGEMENT CONSOLE</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white leading-tight">
          あなたの焙煎を、
          <br />
          もっと多くの人へ。
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Coffee Streetは、こだわりの自家焙煎コーヒーを
          <br />
          お客様に届けるためのプラットフォームです。
        </p>
      </div>

      <p className="text-xs text-zinc-600">© 2026 Coffee Street. All rights reserved.</p>
    </div>
  );
}
