import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "user-001",
  firstName: "Adebayo",
  lastName: "Ogunlesi",
  email: "adebayo.ogunlesi@unionbank.com",
  profileImageUrl: undefined,
  role: "Trade Officer",
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedAuth = localStorage.getItem("ascent-trade-auth");
    return savedAuth === "true" ? mockUser : null;
  });

  const login = () => {
    localStorage.setItem("ascent-trade-auth", "true");
    setUser(mockUser);
  };

  const logout = () => {
    localStorage.removeItem("ascent-trade-auth");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
