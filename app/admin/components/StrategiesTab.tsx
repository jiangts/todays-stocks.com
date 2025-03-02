import toast from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/libs/api";
import InitializeStrategiesButton from "@/app/admin/components/InitializeStrategiesButton";

interface Strategy {
  _id: string;
  name: string;
  description: string;
  createdBy: string | null;
  visibility: "private" | "unlisted" | "public" | "for-sale";
  frequency: "daily" | "weekly" | "monthly" | null;
  createdAt: string;
  updatedAt: string;
}

export default function StrategiesTab() {
  const {
    data: strategies = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Strategy[]>(
    ["/api/admin", { params: { type: "strategies" } }],
    ([url, params]) => fetcher(url, params).then((data) => data.strategies),
    {
      onError: (err) => {
        console.error("Error fetching strategies:", err);
        toast.error("Failed to load strategies");
      },
    },
  );

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  // Helper function to get appropriate badge color for frequency
  const getFrequencyBadgeColor = (frequency: string): string => {
    switch (frequency?.toLowerCase()) {
      case "daily":
        return "badge-primary";
      case "weekly":
        return "badge-secondary";
      case "monthly":
        return "badge-accent";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg text-gray-600">
          Manage available stock trading strategies.
        </p>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => mutate()}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Refresh"}
        </button>
      </div>
      <InitializeStrategiesButton onSuccess={() => mutate()} />

      {error && (
        <div className="alert alert-error mb-4">
          Failed to load strategies. Please try again.
        </div>
      )}

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
                <th>Visibility</th>
                <th>Frequency</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {strategies.map((strategy) => (
                <tr key={strategy._id}>
                  <td className="font-medium">{strategy.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        strategy.visibility === "public"
                          ? "badge-success"
                          : strategy.visibility === "for-sale"
                            ? "badge-warning"
                            : strategy.visibility === "unlisted"
                              ? "badge-info"
                              : "badge-ghost"
                      }`}
                    >
                      {strategy.visibility}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${getFrequencyBadgeColor(strategy.frequency)}`}
                    >
                      {strategy.frequency || "N/A"}
                    </span>
                  </td>
                  <td>{strategy.description}</td>
                  <td>{strategy.createdBy ? "User" : "System"}</td>
                  <td>{formatDate(strategy.createdAt)}</td>
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
