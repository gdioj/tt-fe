'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase'
import { logger } from "@/lib/logger";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) {
      logger.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
          >
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}