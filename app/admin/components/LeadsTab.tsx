import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface Lead {
  _id: string;
  email: string;
  createdAt: string;
}

export default function LeadsTab() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    fetchLeads();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
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
          {isLoading ? "Loading..." : "Refresh"}
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
  );
}
