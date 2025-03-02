"use client";

import { Strategy } from "@/types";
import StrategyCard from "./StrategyCard";
import LoadingSkeleton from "./LoadingSkeleton";

interface StrategyListProps {
  strategies: (Strategy & { subscribed: boolean })[];
  isLoading: boolean;
  error: any;
  onToggleSubscription: (id: string) => Promise<void>;
}

export default function StrategyList({
  strategies,
  isLoading,
  error,
  onToggleSubscription,
}: StrategyListProps) {
  if (error) {
    return (
      <div className="alert alert-error">
        Failed to load strategies. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (strategies.length === 0) {
    return <div className="alert alert-info">No strategies available.</div>;
  }

  return (
    <div className="space-y-6">
      {strategies.map((strategy) => (
        <StrategyCard
          key={strategy.id}
          strategy={strategy}
          onToggleSubscription={onToggleSubscription}
        />
      ))}
    </div>
  );
}
