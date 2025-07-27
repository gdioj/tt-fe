'use client';
import React from "react";
import DashboardLayout from "./dashboard.layout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
        <p className="text-lg">Welcome to your dashboard!</p>
      </div>
    </DashboardLayout>
  );
}
