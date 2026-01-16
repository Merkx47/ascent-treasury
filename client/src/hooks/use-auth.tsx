import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string;
  role: string;
  department?: string;
  employeeId?: string;
  branch?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOtpRequired: boolean;
  pendingEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<void>;
  cancelOtp: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: "user-001",
  firstName: "Adebayo",
  lastName: "Ogunlesi",
  email: "adebayo.ogunlesi@unionbank.com",
  profileImageUrl: undefined,
  role: "Super Admin",
  department: "Treasury Operations",
  employeeId: "UBN-TR-001",
  branch: "Head Office - Stallion Plaza",
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    const savedAuth = localStorage.getItem("ascent-treasury-auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.verified) {
          return mockUser;
        }
      } catch {
        // If old format (just "true"), clear it
        localStorage.removeItem("ascent-treasury-auth");
      }
    }
    return null;
  });

  const [isOtpRequired, setIsOtpRequired] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // For demo: accept any email/password, proceed to OTP
    setPendingEmail(email);
    setIsOtpRequired(true);
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Accept any valid 6-digit code
    if (code.length === 6 && /^\d{6}$/.test(code)) {
      // Update mock user with the email they logged in with
      const authenticatedUser = {
        ...mockUser,
        email: pendingEmail || mockUser.email,
      };

      localStorage.setItem(
        "ascent-treasury-auth",
        JSON.stringify({ verified: true, email: pendingEmail })
      );
      setUser(authenticatedUser);
      setIsOtpRequired(false);
      setPendingEmail(null);
      return true;
    }

    return false;
  };

  const resendOtp = async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    // In production, this would trigger a new OTP to be sent
  };

  const cancelOtp = () => {
    setIsOtpRequired(false);
    setPendingEmail(null);
  };

  const logout = () => {
    localStorage.removeItem("ascent-treasury-auth");
    setUser(null);
    setIsOtpRequired(false);
    setPendingEmail(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOtpRequired,
        pendingEmail,
        login,
        verifyOtp,
        resendOtp,
        cancelOtp,
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
