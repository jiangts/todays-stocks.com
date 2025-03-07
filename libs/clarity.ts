"use client";
import Clarity from "@microsoft/clarity";

if (typeof window !== "undefined") {
  Clarity.init(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
}

export default Clarity;