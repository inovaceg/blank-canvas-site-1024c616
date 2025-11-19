import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "client";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);

        // Fetch user role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("[ProtectedRoute] Error fetching profile:", profileError);
          setUserRole(null);
        } else if (profile) {
          setUserRole(profile.role);
        }
      } catch (error) {
        console.error("[ProtectedRoute] Error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setIsAuthenticated(true);
        if (session?.user) {
          supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()
            .then(({ data, error }: { data: any; error: any }) => {
              if (!error && data) {
                setUserRole(data.role);
              }
            });
        }
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    // Admins can access everything; otherwise, check role match
    if (requiredRole === "admin") {
      return <Navigate to="/client/dashboard" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
}
