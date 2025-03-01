"use client";

import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";
import config from "@/config";
import StrategiesTab from "@/app/admin/components/StrategiesTab";
import LeadsTab from "@/app/admin/components/LeadsTab";
import UsersTab from "@/app/admin/components/UsersTab";
import { useQueryState } from "nuqs";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "users",
  });

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
        <section className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Admin Dashboard
          </h1>

          {/* Tabs */}
          <div className="tabs tabs-boxed w-fit">
            <a
              className={`tab ${activeTab === "strategies" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("strategies")}
            >
              Strategies
            </a>
            <a
              className={`tab ${activeTab === "leads" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("leads")}
            >
              Leads
            </a>
            <a
              className={`tab ${activeTab === "users" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </a>
          </div>

          {/* Tab Content */}
          {activeTab === "strategies" && <StrategiesTab />}
          {activeTab === "leads" && <LeadsTab />}
          {activeTab === "users" && <UsersTab />}
        </section>
      </main>
    </>
  );
}
