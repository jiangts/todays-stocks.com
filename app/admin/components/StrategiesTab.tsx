import toast from "react-hot-toast";
import useSWR from "swr";
import { fetcher } from "@/libs/api";
import InitializeStrategiesButton from "@/app/admin/components/InitializeStrategiesButton";
import { useState, useEffect } from "react";

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

interface Subscriber {
  _id: string;
  userId: string;
  email: string;
  name: string;
  subscribedAt: string;
}

export default function StrategiesTab() {
  const [openStrategyId, setOpenStrategyId] = useState<string | null>(null);
  const [subscribersMap, setSubscribersMap] = useState<
    Record<string, Subscriber[]>
  >({});
  const [loadingSubscribers, setLoadingSubscribers] = useState<
    Record<string, boolean>
  >({});

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

  // Function to load subscribers for a specific strategy
  const loadSubscribers = async (strategyId: string) => {
    try {
      setLoadingSubscribers((prev) => ({ ...prev, [strategyId]: true }));

      const params = new URLSearchParams({
        type: "subscribers",
        strategyId,
      }).toString();

      const response = await fetch(`/api/admin?${params}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setSubscribersMap((prev) => ({
        ...prev,
        [strategyId]: data.subscribers || [],
      }));
    } catch (err) {
      console.error(
        `Error fetching subscribers for strategy ${strategyId}:`,
        err,
      );
      toast.error("Failed to load subscribers");
    } finally {
      setLoadingSubscribers((prev) => ({ ...prev, [strategyId]: false }));
    }
  };

  // Load subscribers when accordion is opened
  useEffect(() => {
    if (openStrategyId && !subscribersMap[openStrategyId]) {
      loadSubscribers(openStrategyId);
    }
  }, [openStrategyId]);

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

  const toggleAccordion = (strategyId: string) => {
    setOpenStrategyId(openStrategyId === strategyId ? null : strategyId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("ID copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        toast.error("Failed to copy ID");
      });
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
      <div className="mb-4">
        <InitializeStrategiesButton onSuccess={() => mutate()} />
      </div>

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
        <div className="space-y-4">
          {strategies.map((strategy) => {
            const subscribers = subscribersMap[strategy._id] || [];
            const isLoadingSubscribers =
              loadingSubscribers[strategy._id] || false;
            const subscriberCount = subscribers.length;

            return (
              <div
                key={strategy._id}
                className="collapse collapse-arrow bg-base-200"
              >
                <input
                  type="checkbox"
                  checked={openStrategyId === strategy._id}
                  onChange={() => toggleAccordion(strategy._id)}
                />
                <div className="collapse-title font-medium">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold mr-2">{strategy.name}</span>
                      <span
                        className={`badge ${strategy.visibility === "public" ? "badge-success" : strategy.visibility === "for-sale" ? "badge-warning" : strategy.visibility === "unlisted" ? "badge-info" : "badge-ghost"} mx-2`}
                      >
                        {strategy.visibility}
                      </span>
                      <span
                        className={`badge ${getFrequencyBadgeColor(strategy.frequency)} mx-2`}
                      >
                        {strategy.frequency || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {strategy.createdBy
                          ? "Created by user"
                          : "System generated"}{" "}
                        • {formatDate(strategy.createdAt)}
                      </span>
                      {/* Only show subscriber count when accordion is open and data is loaded */}
                      {subscribersMap[strategy._id] && (
                        <span className="badge badge-sm">
                          {subscribers.length} subscribers
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="collapse-content">
                  <div className="text-xs text-gray-500 mt-1 inline-flex items-center">
                    <button
                      className="ml-1 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        copyToClipboard(strategy._id);
                      }}
                    >
                      ID:
                      <span className="font-mono bg-gray-100 px-1 rounded mx-1">
                        {strategy._id}
                      </span>
                    </button>
                  </div>
                  <div className="mb-4">{strategy.description}</div>

                  <div className="divider">Subscribers</div>

                  {isLoadingSubscribers ? (
                    <div className="flex justify-center py-4">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : subscribers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="table table-zebra table-compact w-full">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subscribed At</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((subscriber) => (
                            <tr key={subscriber._id}>
                              <td>{subscriber.name}</td>
                              <td>{subscriber.email}</td>
                              <td>{formatDate(subscriber.subscribedAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info">
                      No subscribers for this strategy.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert-info">No strategies found.</div>
      )}
    </div>
  );
}
