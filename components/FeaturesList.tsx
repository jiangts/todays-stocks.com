"use client";
import React from "react";
import { mdiClock, mdiBrain, mdiBell, mdiTrendingUp } from "@mdi/js";
import Icon from "@mdi/react";

const features = [
  {
    icon: <Icon path={mdiClock} size={1.5} className="text-primary" />,
    title: "Save time",
    description: "Automated research and analysis specific to your strategy or portfolio.",
  },
  {
    icon: <Icon path={mdiBrain} size={1.5} className="text-primary" />,
    title: "Smarter decisions",
    description: "AI-powered analysis reduces bias.",
  },
  {
    icon: <Icon path={mdiBell} size={1.5} className="text-primary" />,
    title: "Customizable alerts",
    description: "Define custom investment strategies and alerting criteria.",
  },
  {
    icon: <Icon path={mdiTrendingUp} size={1.5} className="text-primary" />,
    title: "Daily insights",
    description:
      "Absorb the latest market trends & opportunities in a couple minutes each day.",
  },
];

export default function FeaturesList() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Make better trades with AI
          </h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex gap-6 items-start p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
