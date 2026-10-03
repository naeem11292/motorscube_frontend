
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css";

const LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  const [digits, setDigits] = useState(Array(LENGTH).fill(""));
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setTimeout(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  const handleChange = (index, event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(-1);

    const next = [...digits];
    next[index] = value;

    setDigits(next);

    if (value && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (
      event.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < LENGTH - 1
    ) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const text = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);

    if (!text) return;

    event.preventDefault();

    const next = Array(LENGTH).fill("");

    text.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setDigits(next);

    const focusIndex = Math.min(text.length, LENGTH - 1);
    inputs.current[focusIndex]?.focus();
  };

  const resend = () => {
    setSeconds(RESEND_SECONDS);
    setDigits(Array(LENGTH).fill(""));
    setError("");

    inputs.current[0]?.focus();

    // TODO:
    // Connect your resend OTP API here.
  };

  const code = digits.join("");
  const complete = code.length === LENGTH;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError(
        "Registration email is missing. Please sign up again."
      );
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/verify-registration-otp",
        {
          user_email: email.trim(),
          otp: code,
        }
      );

      if (response.data.success) {
        alert("Email verified successfully!");
        navigate("/");
      } else {
        setError(
          response.data.message ||
            "OTP verification failed. Please try again."
        );
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      setError(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const timer = `00:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="page">
      <header className="header">
        <span className="logo">
          Motors<span>Cube</span>
        </span>
      </header>

      <main className="main">
        <section className="hero">
          <span className="hero-label">VERIFICATION</span>

          <h1>Confirm It’s You</h1>

          <p>
            A short verification code protects your account
            from unauthorized registrations.
          </p>

          <div className="ring ring-outer"></div>
          <div className="ring ring-inner"></div>
        </section>

        <section className="card">
          <h2>OTP Verification — Sign Up</h2>

          <p className="muted">
            Step 4 of 4 · Verify your contact details.
          </p>

          <div className="dots" aria-hidden="true">
            {[0, 1, 2, 3].map((dot) => (
              <span key={dot}></span>
            ))}
          </div>

          <p className="muted">
            Enter the 6-digit code sent to{" "}
            {email || "your mobile/email"}.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              className="otp"
              onPaste={handlePaste}
            >
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputs.current[index] = element;
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(event) =>
                    handleChange(index, event)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                />
              ))}
            </div>

            {error && (
              <p className="error-text">
                {error}
              </p>
            )}

            <p className="resend">
              {seconds > 0 ? (
                <>
                  Didn't receive the code? Resend in{" "}
                  {timer}
                </>
              ) : (
                <>
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    className="link"
                    onClick={resend}
                  >
                    Resend now
                  </button>
                </>
              )}
            </p>

            <button
              type="submit"
              className="primary"
              disabled={!complete || loading}
            >
              {loading
                ? "Verifying..."
                : "Verify & Create Account"}
            </button>
          </form>

          <button
            type="button"
            className="link change"
            onClick={() => navigate("/signup")}
          >
            Change Mobile / Email
          </button>
        </section>
      </main>
    </div>
  );
}
