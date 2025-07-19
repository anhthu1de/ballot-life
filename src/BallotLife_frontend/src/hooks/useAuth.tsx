import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { BallotLife_backend } from '../../../declarations/BallotLife_backend';
import { Actor } from '@dfinity/agent';
import type { AuthState } from '../types';

interface AuthContextType extends AuthState {
  authClient: AuthClient | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authClientPromise = AuthClient.create();

  const updateIdentity = useCallback((identity: Identity) => {
    setIdentity(identity);
    setPrincipal(identity.getPrincipal());
    Actor.agentOf(BallotLife_backend)?.replaceIdentity!(identity);
  }, []);

  const login = useCallback(async (): Promise<void> => {
    const authClient = await authClientPromise;

    const internetIdentityUrl =
      import.meta.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app/#authorize"
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

    await new Promise<void>((resolve) => {
      authClient.login({
        identityProvider: internetIdentityUrl,
        onSuccess: () => resolve(undefined),
      });
    });

    const identity = authClient.getIdentity();
    updateIdentity(identity);
    setIsAuthenticated(true);
  }, [updateIdentity]);

  const logout = useCallback(async (): Promise<void> => {
    const authClient = await authClientPromise;
    await authClient.logout();
    const identity = authClient.getIdentity();
    updateIdentity(identity);
    setIsAuthenticated(false);
  }, [updateIdentity]);

  const setInitialIdentity = useCallback(async () => {
    try {
      const authClient = await AuthClient.create();
      setAuthClient(authClient);
      const identity = authClient.getIdentity();
      updateIdentity(identity);
      setIsAuthenticated(await authClient.isAuthenticated());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [updateIdentity]);

  useEffect(() => {
    setInitialIdentity();
  }, [setInitialIdentity]);

  const value: AuthContextType = {
    isAuthenticated,
    principal,
    identity,
    login,
    logout,
    isLoading,
    authClient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Higher-order component for protected routes
export interface WithAuthProps {
  isAuthenticated: boolean;
  principal: Principal | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const withAuth = <P extends object>(
  Component: React.ComponentType<P & WithAuthProps>
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    const auth = useAuth();
    return <Component {...props} {...auth} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for authentication guards
export const useAuthGuard = (redirectTo?: string) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated && redirectTo) {
      console.warn('User not authenticated, should redirect to:', redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: !isLoading && !isAuthenticated,
  };
};

// Hook for checking specific permissions
export const usePermissions = () => {
  const { principal, isAuthenticated } = useAuth();

  const canCreatePoll = isAuthenticated;
  const canVote = isAuthenticated;
  const canClosePoll = (creatorPrincipal: Principal | string) => {
    if (!isAuthenticated || !principal) return false;
    const creatorStr = typeof creatorPrincipal === 'string' 
      ? creatorPrincipal 
      : creatorPrincipal.toString();
    return principal.toString() === creatorStr;
  };

  return {
    canCreatePoll,
    canVote,
    canClosePoll,
  };
};