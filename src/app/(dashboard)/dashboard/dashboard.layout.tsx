"use client";
import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        } else {
          setUser(session.user);
          setLoading(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLogoutDialogOpen(false);
    router.push("/login");
  };

  const confirmLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 bg-muted">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="p-4 shadow flex items-center justify-between">
            <SidebarTrigger />
            <h1 className="text-xl font-bold">Tao Tracker</h1>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage
                  src={user?.user_metadata.avatar_url || ""}
                  alt={user?.user_metadata.full_name || "User Avatar"}
                />
                <AvatarFallback>
                  {/* avatar fall back should be 1st letter of first name and first letter of lastname */}
                  {
                    user?.user_metadata.full_name
                      ? user.user_metadata.full_name
                        .split(" ")
                        .map((name: string) => name[0])
                        .join("")
                      : "U"
                  }
                </AvatarFallback>
              </Avatar>
              <span>{user?.user_metadata.full_name}</span>
              <Button variant="ghost" size="icon" onClick={confirmLogout}>
                <LogOut className="size-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6">
            {loading ? (
              <div className="flex items-center justify-center h-screen w-screen gap-4 bg-muted">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                  TaoTracker
                </h4>
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : null}
            {children}
          </main>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will be redirected to the login page.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
