// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login"); // redirect to login page
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          TaoTracker
        </h4>
        <div className="spinner"></div>
      </div>
    );

  return <>{children}</>;
}
