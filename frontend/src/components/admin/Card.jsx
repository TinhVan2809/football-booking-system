function Card() {
  return (
    <div class="group relative flex w-80 flex-col rounded-xl bg-slate-950 p-4 shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20">
      <div class="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-sm transition-opacity duration-300 group-hover:opacity-30"></div>
      <div class="absolute inset-px rounded-[11px] bg-slate-950"></div>

      <div class="relative">
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-500">
              <svg
                class="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <h3 class="text-sm font-semibold text-white">
              Performance Analytics
            </h3>
          </div>

          <span class="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Live
          </span>
        </div>

        <div class="mb-4 grid grid-cols-2 gap-4">
          <div class="rounded-lg bg-slate-900/50 p-3">
            <p class="text-xs font-medium text-slate-400">Total Views</p>
            <p class="text-lg font-semibold text-white">24.5K</p>
            <span class="text-xs font-medium text-emerald-500">+12.3%</span>
          </div>

          <div class="rounded-lg bg-slate-900/50 p-3">
            <p class="text-xs font-medium text-slate-400">Conversions</p>
            <p class="text-lg font-semibold text-white">1.2K</p>
            <span class="text-xs font-medium text-emerald-500">+8.1%</span>
          </div>
        </div>

        <div class="mb-4 h-24 w-full overflow-hidden rounded-lg bg-slate-900/50 p-3">
          <div class="flex h-full w-full items-end justify-between gap-1">
            <div class="h-[40%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[60%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[60%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[40%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[75%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[80%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[45%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[50%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[85%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[90%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[65%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[70%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
            <div class="h-[95%] w-3 rounded-sm bg-indigo-500/30">
              <div class="h-[85%] w-full rounded-sm bg-indigo-500 transition-all duration-300"></div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-slate-400">Last 7 days</span>
            <svg
              class="h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>

          <button class="flex items-center gap-1 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 px-3 py-1 text-xs font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-600">
            View Details
            <svg
              class="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
