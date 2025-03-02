import { Strategy } from "@/types";

interface StrategyCardProps {
  strategy: Strategy & { subscribed: boolean };
  onToggleSubscription: (id: string) => Promise<void>;
}

export default function StrategyCard({
  strategy,
  onToggleSubscription,
}: StrategyCardProps) {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
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
            onClick={() => onToggleSubscription(strategy.id)}
          >
            {strategy.subscribed ? "Unsubscribe" : "Subscribe"}
          </button>
        </div>
      </div>
    </div>
  );
}
