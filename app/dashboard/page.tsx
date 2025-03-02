"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { fetcher } from "@/libs/api";
import { Strategy } from "@/types";
import apiClient from "@/libs/api";
import Header from "./components/Header";
import StrategyList from "./components/StrategyList";

export const dynamic = "force-dynamic";

type StrategyWithSubscription = Strategy & { subscribed: boolean };

export default function Dashboard() {
  // State to hold merged strategy data
  const [mergedStrategies, setMergedStrategies] = useState<
    StrategyWithSubscription[]
  >([]);

  // Fetch user's subscribed strategies
  const { data: subscribedStrategies = [] } = useSWR<Strategy[]>(
    "/api/user/subscriptions",
    (url: string) => fetcher(url).then((data) => data.strategies || []),
  );

  // Fetch all available strategies
  const {
    data: strategies = [],
    error,
    isLoading,
    mutate,
  } = useSWR<Strategy[]>(
    "/api/strategy",
    (url) => fetcher(url).then((data) => data.strategies),
    {
      onError: (err) => {
        console.error("Error fetching strategies:", err);
        toast.error("Failed to load strategies");
      },
    },
  );

  // Merge strategies with subscription status whenever either data changes
  useEffect(() => {
    if (strategies.length > 0) {
      // Create set of subscribed strategy IDs for quick lookup
      const subscribedIds = new Set(
        subscribedStrategies.map((strategy) => strategy.id),
      );

      // Map through all strategies and mark subscription status
      const updated = strategies.map((strategy) => ({
        ...strategy,
        subscribed: subscribedIds.has(strategy.id),
      }));

      setMergedStrategies(updated);
    }
  }, [strategies, subscribedStrategies]);

  const toggleSubscription = async (id: string) => {
    // Update local state immediately for better UX
    const updatedStrategies = mergedStrategies.map((strategy) => {
      if (strategy.id === id) {
        return { ...strategy, subscribed: !strategy.subscribed };
      }
      return strategy;
    });

    // Optimistic update
    setMergedStrategies(updatedStrategies);

    const strategy = mergedStrategies.find((s) => s.id === id);

    if (strategy) {
      const newStatus = !strategy.subscribed;
      try {
        if (newStatus) {
          // Subscribe to strategy
          await apiClient.post("/user/subscribe", { strategyId: id });
          toast.success(`Subscribed to ${strategy.name}`);
        } else {
          // Unsubscribe from strategy
          await apiClient.delete("/user/subscribe", {
            data: { strategyId: id },
          });
          toast.success(`Unsubscribed from ${strategy.name}`);
        }
        // Refresh the data after a successful update
        await mutate();
      } catch (error) {
        // Revert on error - the API client will handle displaying the error toast
        console.error("Subscription update failed:", error);
        mutate(); // Refetch to get the correct state
      }
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen p-8 pb-24">
        <section className="max-w-3xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Stock Strategy Subscriptions
          </h1>
          <p className="text-lg text-gray-600">
            Subscribe to stock mailing lists that match your investment
            strategy.
          </p>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {isLoading
                ? "Loading strategies..."
                : `${strategies.length} strategies available`}
            </p>
          </div>

          <StrategyList
            strategies={mergedStrategies}
            isLoading={isLoading}
            error={error}
            onToggleSubscription={toggleSubscription}
          />
        </section>
      </main>
    </>
  );
}
