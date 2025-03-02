export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <div className="skeleton h-8 w-1/3 mb-2"></div>
                <div className="skeleton h-4 w-16 mb-4"></div>
                <div className="skeleton h-4 w-full mb-2"></div>
                <div className="skeleton h-4 w-5/6"></div>
              </div>
              <div className="skeleton h-10 w-28"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
