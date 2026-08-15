import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowRight, CheckCircle, Loader } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setStep("otp");
      setCountdown(60);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      // The token is in HTTP-only cookie, we just need to set the user state
      const { user } = data.data;
      login(user.email);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setCountdown(60);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-primary">ASCEND</h1>
          <p className="text-gray-500 mt-2">Admin Dashboard</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === "email" ? (
          <form onSubmit={handleRequestOtp} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@ascend.com"
              icon={<Mail size={18} />}
              required
            />

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              // @ts-ignore
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              You'll receive a 6-digit OTP in your email
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={24} className="text-green-600" />
              </div>
              <p className="text-sm text-gray-600">
                OTP sent to <span className="font-medium">{email}</span>
              </p>
            </div>

            <Input
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-brand-primary hover:underline"
              >
                Change email
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className={`${
                  countdown > 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-brand-primary hover:underline"
                }`}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </button>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full"
              // @ts-ignore
              type="submit"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                "Verify & Login"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
