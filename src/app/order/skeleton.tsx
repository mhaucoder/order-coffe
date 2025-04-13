export default function Skeleton() {
  return (
    <div className="font-sans max-w-md mx-auto bg-gray-50 min-h-screen animate-pulse">
      <div className="grid grid-cols-2 gap-3">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div>
              <div className="h-5 w-3/4 bg-gray-300 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
            <div className="mt-3 h-8 bg-gray-300 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
