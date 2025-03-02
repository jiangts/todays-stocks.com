"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";
import config from "@/config";
import toast from "react-hot-toast";
import { fetcher } from "@/libs/api";
import { Strategy } from "@/types";
import apiClient from "@/libs/api";

export const dynamic = "force-dynamic";

type StrategyWithSubscription = Strategy & { subscribed: boolean };

export default function Dashboard() {
  // State to hold merged strategy data
  const [mergedStrategies, setMergedStrategies] = useState<
    StrategyWithSubscription[]
  >([]);

  // Fetch user's subscribed strategies
  const { data: subscribedStrategies = [], error: subscriptionError } = useSWR<
    Strategy[]
  >("/api/user/subscriptions", (url: string) =>
    fetcher(url).then((data) => data.strategies || []),
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
      {/* Navbar */}
      <header className="bg-base-200">
        <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
          <div className="flex">
            <Link
              className="flex items-center gap-2 shrink-0"
              href="/"
              title={`${config.appName} homepage`}
            >
              <Image
                src={logo}
                alt={`${config.appName} logo`}
                className="w-8"
                placeholder="blur"
                priority={true}
                width={32}
                height={32}
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
          </div>

          {/* Center section - can add links here if needed */}
          <div className="hidden lg:flex lg:justify-center lg:gap-12 lg:items-center">
            {/* Navigation links could go here */}
          </div>

          {/* Account button on right */}
          <div className="flex justify-end">
            <ButtonAccount />
          </div>
        </nav>
      </header>

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

          {error && (
            <div className="alert alert-error">
              Failed to load strategies. Please try again.
            </div>
          )}

          {isLoading ? (
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
          ) : mergedStrategies.length > 0 ? (
            <div className="space-y-6">
              {mergedStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="card-body">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title">{strategy.name}</h2>
                        <div className="badge badge-ghost mt-1 mb-2">
                          {strategy.frequency}
                        </div>
                        <p>{strategy.description}</p>
                      </div>
                      <button
                        className={`btn ${strategy.subscribed ? "btn-error" : "btn-primary"}`}
                        onClick={() => toggleSubscription(strategy.id)}
                      >
                        {strategy.subscribed ? "Unsubscribe" : "Subscribe"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">No strategies available.</div>
          )}
        </section>
      </main>
    </>
  );
}
