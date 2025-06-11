import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import ProtectedRoute from "@/components/protected-route";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 bg-muted">
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <header className="p-4 shadow flex items-center justify-between">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">Tao Tracker</h1>
              <div className="flex items-center space-x-4">
                <span>Hi {user?.user_metadata.full_name}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="size-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
