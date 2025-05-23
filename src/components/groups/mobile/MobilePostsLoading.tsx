
export const MobilePostsLoading = () => {
  return (
    <div className="flex-1 px-3 py-4 md:px-6 md:py-8">
      <div className="space-y-3 md:space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-2 md:gap-3 animate-pulse">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-3 md:h-4 bg-slate-200 rounded w-1/3 mb-1 md:mb-2"></div>
              <div className="h-10 md:h-12 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
