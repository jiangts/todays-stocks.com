"use client";

import { useState } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";
import config from "@/config";
import toast from "react-hot-toast";
import { stockStrategies } from "./strategies";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [strategies, setStrategies] = useState(stockStrategies);

  const toggleSubscription = (id: number) => {
    setStrategies(
      strategies.map((strategy) => {
        if (strategy.id === id) {
          const newSubscriptionState = !strategy.subscribed;

          if (newSubscriptionState) {
            toast.success(`Subscribed to ${strategy.name}`);
          } else {
            toast.success(`Unsubscribed from ${strategy.name}`);
          }

          return { ...strategy, subscribed: newSubscriptionState };
        }
        return strategy;
      }),
    );
  };

  return (
    <>
      {/* Navbar */}
      <header className="bg-base-200">
        <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
          {/* Logo/name */}
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

          <div className="space-y-6">
            {strategies.map((strategy) => (
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
        </section>
      </main>
    </>
  );
}
