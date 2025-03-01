"use client";

import { useState, useEffect } from "react";
import ButtonAccount from "@/components/ButtonAccount";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";
import config from "@/config";
import toast from "react-hot-toast";
import { stockStrategies } from "../dashboard/page";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const [strategies, setStrategies] = useState(stockStrategies);
  const [activeTab, setActiveTab] = useState("strategies");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStrategies = () => {
    // In a real app, this would fetch from an API
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStrategies(stockStrategies);
      setIsLoading(false);
    }, 300);
  };

  const fetchLeads = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin?type=leads");
      if (!response.ok) {
        throw new Error("Failed to fetch leads");
      }
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again.");
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin?type=users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users. Please try again.");
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "leads") {
      fetchLeads();
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "strategies") {
      fetchStrategies();
    }
  }, [activeTab]);

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
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
        <section className="max-w-5xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Admin Dashboard
          </h1>

          {/* Tabs */}
          <div className="tabs tabs-boxed w-fit">
            <a
              className={`tab ${activeTab === 'strategies' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('strategies')}
            >
              Strategies
            </a>
            <a
              className={`tab ${activeTab === 'leads' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('leads')}
            >
              Leads
            </a>
            <a
              className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </a>
          </div>

          {/* Strategies Tab Content */}
          {activeTab === 'strategies' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-600">
                  Manage available stock trading strategies.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={fetchStrategies}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {error && <div className="alert alert-error mb-4">{error}</div>}

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
                        <th>Frequency</th>
                        <th>Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {strategies.map((strategy) => (
                        <tr key={strategy.id}>
                          <td className="font-medium">{strategy.name}</td>
                          <td>{strategy.frequency}</td>
                          <td>{strategy.description}</td>
                          <td>
                            <span className={`badge ${strategy.subscribed ? 'badge-success' : 'badge-ghost'}`}>
                              {strategy.subscribed ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No strategies found.</div>
              )}
            </div>
          )}

          {/* Leads Tab Content */}
          {activeTab === 'leads' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-600">
                  Manage leads from landing page registrations.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={fetchLeads}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {error && <div className="alert alert-error mb-4">{error}</div>}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : leads.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra table-compact w-full">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead._id}>
                          <td>{lead.email}</td>
                          <td>{formatDate(lead.createdAt)}</td>
                          <td>
                            <button
                              className="btn btn-xs btn-ghost"
                              onClick={() => {
                                // Copy email to clipboard
                                navigator.clipboard.writeText(lead.email);
                                toast.success("Email copied to clipboard");
                              }}
                            >
                              Copy Email
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No leads found.</div>
              )}
            </div>
          )}

          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg text-gray-600">
                  Manage registered users of the platform.
                </p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={fetchUsers}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </button>
              </div>

              {error && <div className="alert alert-error mb-4">{error}</div>}

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner loading-lg"></span>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="table table-zebra table-compact w-full">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td>{user.name || 'N/A'}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.isAdmin ? 'badge-primary' : 'badge-ghost'}`}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td>{formatDate(user.createdAt)}</td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-xs btn-ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(user.email);
                                  toast.success("Email copied to clipboard");
                                }}
                              >
                                Copy Email
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No users found.</div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
