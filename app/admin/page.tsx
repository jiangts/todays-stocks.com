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
import Header from "../dashboard/components/Header";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useQueryState("tab", {
    defaultValue: "users",
  });

  return (
    <>
      {/* Navbar */}
      <Header />

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
