import { stockStrategies } from "@/app/dashboard/strategies";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function StrategiesTab() {
  const [strategies, setStrategies] = useState(stockStrategies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStrategies = () => {
    // In a real app, this would fetch from an API
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStrategies(stockStrategies);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg text-gray-600">
          Manage available stock trading strategies.
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={fetchStrategies}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : strategies.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-zebra table-compact w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Frequency</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy.id}>
                  <td className="font-medium">{strategy.name}</td>
                  <td>{strategy.frequency}</td>
                  <td>{strategy.description}</td>
                  <td>
                    <span
                      className={`badge ${strategy.subscribed ? "badge-success" : "badge-ghost"}`}
                    >
                      {strategy.subscribed ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">No strategies found.</div>
      )}
    </div>
  );
}
