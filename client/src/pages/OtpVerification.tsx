import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import unionBankLogo from "@assets/image_1768419831653.png";

export default function OtpVerification() {
  const { pendingEmail, verifyOtp, resendOtp, cancelOtp } = useAuth();
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryTime, setExpiryTime] = useState(300); // 5 minutes in seconds

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (expiryTime <= 0) return;

    const timer = setInterval(() => {
      setExpiryTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const success = await verifyOtp(otp);
      if (!success) {
        setError("Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError(null);

    try {
      await resendOtp();
      setResendCooldown(30);
      setExpiryTime(300);
      setOtp("");
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = () => {
    cancelOtp();
  };

  // Auto-submit when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);

  const maskedEmail = pendingEmail
    ? pendingEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your email";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="border-2 border-border shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img src={unionBankLogo} alt="Union Bank" className="h-16 w-auto object-contain" />
            </div>
            <CardTitle className="text-xl">Two-Factor Authentication</CardTitle>
            <CardDescription className="text-sm">
              Enter the 6-digit verification code sent to {maskedEmail}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError(null);
                }}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl border-2" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl border-2" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl border-2" />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl border-2" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl border-2" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl border-2" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center justify-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Expiry Timer */}
            <div className="text-center">
              {expiryTime > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Code expires in{" "}
                  <span className={`font-mono font-medium ${expiryTime <= 60 ? "text-destructive" : "text-foreground"}`}>
                    {formatTime(expiryTime)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-destructive">Code has expired. Please request a new one.</p>
              )}
            </div>

            {/* Verify Button */}
            <Button
              className="w-full h-12 text-base"
              onClick={handleVerify}
              disabled={otp.length !== 6 || isVerifying || expiryTime <= 0}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verify & Continue
                </>
              )}
            </Button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>

            {/* Back to Login */}
            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full border-2"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>This is a secure authentication process.</p>
          <p>Never share your OTP with anyone.</p>
        </div>
      </div>
    </div>
  );
}
