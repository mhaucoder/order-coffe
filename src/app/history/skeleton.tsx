// components/Skeleton.tsx
export default function Skeleton() {
    return (
      <div className="mt-6 space-y-6 animate-pulse">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 shadow bg-white overflow-hidden"
          >
            <div className="bg-gray-100 px-4 py-2 flex justify-between">
              <div className="h-5 w-32 bg-gray-300 rounded" />
              <div className="h-5 w-24 bg-gray-300 rounded" />
            </div>
  
            <ul className="divide-y">
              {[...Array(2)].map((_, index) => (
                <li
                  key={index}
                  className="px-4 py-4 flex justify-between items-start sm:items-center sm:flex-row flex-col gap-2"
                >
                  <div className="flex-1 space-y-1">
                    <div className="h-5 w-48 bg-gray-300 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-16 bg-gray-300 rounded" />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }
  