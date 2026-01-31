function CardSkeleton() {
  return (
    <>
      <div className="relative flex w-full animate-pulse gap-2 p-4 bg-white rounded-lg shadow-lg">
        <div className="h-12 w-12 rounded-full bg-slate-200"></div>
        <div className="flex-1">
          <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-200 text-lg"></div>
          <div className="h-5 w-[90%] rounded-lg bg-slate-200 text-sm"></div>
        </div>
        <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-200"></div>
      </div>
    </>
  );
}

export default CardSkeleton;
