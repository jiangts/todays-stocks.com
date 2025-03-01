import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name?: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    fetchUsers();
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  return (
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
          {isLoading ? "Loading..." : "Refresh"}
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
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`badge ${user.isAdmin ? "badge-primary" : "badge-ghost"}`}
                    >
                      {user.isAdmin ? "Admin" : "User"}
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
  );
}
