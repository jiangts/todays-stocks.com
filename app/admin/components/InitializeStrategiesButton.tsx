"use client";

import apiClient from "@/libs/api";
import { useQueryState } from "nuqs";
import { useState } from "react";
import toast from "react-hot-toast";

interface InitializeStrategiesButtonProps {
  onSuccess?: () => void;
}

export default function InitializeStrategiesButton({
  onSuccess,
}: InitializeStrategiesButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleInitStrategies = async () => {
    setLoading(true);

    try {
      const data: any = await apiClient.post("/admin/init");

      toast.success(
        `Initialized ${data.results?.length || 0} strategies successfully`,
      );

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || "Failed to initialize strategies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleInitStrategies}
        disabled={loading}
        className={`btn btn-primary ${loading ? "loading" : ""}`}
      >
        {loading ? "Initializing..." : "Initialize Default Strategies"}
      </button>
    </div>
  );
}
