"use client";

import React, { useState, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import clsx from "clsx";
import Icon from "@mdi/react";
import { mdiSend, mdiLoading } from "@mdi/js";

const ShareWithFriends = ({ className }: { className?: string }) => {
  const inputRef = useRef(null);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();

    setIsLoading(true);
    try {
      await apiClient.post("/api/placeholder", { email });

      toast.success("Invitation sent successfully!");

      // Remove focus from the input
      inputRef.current.blur();
      setEmail("");
      setIsDisabled(true);

      // Reset the disabled state after a short delay
      setTimeout(() => setIsDisabled(false), 2000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-10 p-6 bg-base-200 rounded-xl">
      <h3 className="text-xl font-bold mb-3">Share with friends</h3>
      <p className="text-gray-600 mb-4">
        Know someone who might be interested in these stock strategies?
      </p>
      <form
        className={clsx("w-full max-w-md space-y-3", className)}
        onSubmit={handleSubmit}
      >
        <input
          required
          type="email"
          value={email}
          ref={inputRef}
          autoComplete="email"
          placeholder="friend@example.com"
          className="input input-bordered w-full placeholder:opacity-60"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={isDisabled || isLoading}
        >
          Send invitation
          {isLoading ? (
            <Icon path={mdiLoading} size={0.8} className="animate-spin" />
          ) : (
            <Icon path={mdiSend} size={0.8} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ShareWithFriends;
