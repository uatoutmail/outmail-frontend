"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * AuthGuard component for role-based route protection
 * Usage: 
 * <AuthGuard allowedRoles={['TPO_ADMIN']}>
 *   <AdminComponent />
 * </AuthGuard>
 */
export default function AuthGuard({ 
  children, 
  allowedRoles = [], 
  fallbackPath = '/',
  showLoading = true 
}) {
  const { isAuthenticated, loading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push(fallbackPath);
        return;
      }
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        router.push(fallbackPath);
        return;
      }
    }
  }, [isAuthenticated, loading, router, fallbackPath, allowedRoles, userRole]);

  // Show loading spinner while checking auth
  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-l from-black via-[#6c00ff] to-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return children;
}