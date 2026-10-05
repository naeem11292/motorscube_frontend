
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OTPVerification.css";

const API_BASE_URL = "http://localhost:5000/api/v1";
const LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OTPVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  /*
   * Data received from the previous page.
   *
   * Password reset flow:
   * Forgot Password
   *      ↓
   * OTPVerification
   *      ↓
   * Verify OTP
   *      ↓
   * Reset token
   *      ↓
   * Reset Password
   */
  const email = location.state?.email?.trim() || "";

  const isPasswordReset =
    location.state?.purpose === "password_reset";

  const [digits, setDigits] = useState(
    Array(LENGTH).fill("")
  );

  const [seconds, setSeconds] = useState(
    RESEND_SECONDS
  );

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  const inputs = useRef([]);

  /*
   * Focus the first OTP input when the page opens.
   */
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  /*
   * Countdown timer.
   */
  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [seconds]);

  /*
   * Handle individual OTP digit.
   */
  const handleChange = (index, event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(-1);

    const next = [...digits];
    next[index] = value;

    setDigits(next);
    setError("");
    setSuccessMessage("");

    /*
     * Move to the next box automatically.
     */
    if (value && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  /*
   * Handle keyboard navigation.
   */
  const handleKeyDown = (index, event) => {
    /*
     * Backspace:
     * If current box is empty, move to previous box.
     */
    if (
      event.key === "Backspace" &&
      !digits[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
      return;
    }

    /*
     * Arrow left.
     */
    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      event.preventDefault();
      inputs.current[index - 1]?.focus();
      return;
    }

    /*
     * Arrow right.
     */
    if (
      event.key === "ArrowRight" &&
      index < LENGTH - 1
    ) {
      event.preventDefault();
      inputs.current[index + 1]?.focus();
    }
  };

  /*
   * Handle pasting the complete OTP.
   */
  const handlePaste = (event) => {
    const text = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, LENGTH);

    if (!text) {
      return;
    }

    event.preventDefault();

    const next = Array(LENGTH).fill("");

    text.split("").forEach((digit, index) => {
      next[index] = digit;
    });

    setDigits(next);
    setError("");
    setSuccessMessage("");

    /*
     * Focus the next empty position.
     * If OTP is complete, focus the last box.
     */
    const focusIndex = Math.min(
      text.length,
      LENGTH - 1
    );

    inputs.current[focusIndex]?.focus();
  };

  /*
   * Clear OTP.
   */
  const clearOtp = () => {
    setDigits(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
  };

  /*
   * Resend OTP.
   *
   * IMPORTANT:
   * This assumes your backend uses:
   *
   * POST /auth/forgot-password
   * for password-reset OTP.
   *
   * And:
   *
   * POST /auth/register
   * for registration OTP.
   *
   * If your backend uses different resend endpoints,
   * we can change only those endpoints later.
   */
  const resend = async () => {
    if (!email) {
      setError(
        "Email is missing. Please start again from the Forgot Password page."
      );
      return;
    }

    try {
      setResending(true);
      setError("");
      setSuccessMessage("");

      const endpoint = isPasswordReset
        ? `${API_BASE_URL}/auth/forgot-password`
        : `${API_BASE_URL}/auth/register`;

      const payload = isPasswordReset
        ? {
            user_email: email,
          }
        : {
            user_email: email,
          };

      console.log(
        "Resending OTP:",
        {
          endpoint,
          payload,
          purpose: isPasswordReset
            ? "password_reset"
            : "registration",
        }
      );

      const response = await axios.post(
        endpoint,
        payload
      );

      console.log(
        "Resend OTP response:",
        response.data
      );

      if (response.data?.success) {
        setSeconds(RESEND_SECONDS);
        clearOtp();

        setSuccessMessage(
          response.data?.message ||
            "A new OTP has been sent to your email."
        );
      } else {
        setError(
          response.data?.message ||
            "Unable to resend OTP. Please try again."
        );
      }
    } catch (error) {
      console.error(
        "Resend OTP error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  const code = digits.join("");
  const complete = code.length === LENGTH;

  /*
   * Verify OTP.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    /*
     * Validate email.
     */
    if (!email) {
      setError(
        "Email is missing. Please start again from the Forgot Password page."
      );
      return;
    }

    /*
     * Validate OTP.
     */
    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      /*
       * Select the correct verification endpoint.
       */
      const endpoint = isPasswordReset
        ? `${API_BASE_URL}/auth/verify-otp`
        : `${API_BASE_URL}/auth/verify-registration-otp`;

      /*
       * Password reset requires purpose.
       * Registration does not.
       */
      const payload = isPasswordReset
        ? {
            user_email: email,
            otp: code,
            purpose: "password_reset",
          }
        : {
            user_email: email,
            otp: code,
          };

      console.log(
        "OTP verification request:",
        {
          endpoint,
          payload,
          isPasswordReset,
        }
      );

      const response = await axios.post(
        endpoint,
        payload
      );

      console.log(
        "OTP verification response:",
        response.data
      );

      /*
       * Check successful response.
       */
      if (!response.data?.success) {
        setError(
          response.data?.message ||
            "OTP verification failed. Please try again."
        );
        return;
      }

      /*
       * PASSWORD RESET FLOW
       */
      if (isPasswordReset) {
        /*
         * Some backend sendSuccess helpers return:
         *
         * {
         *   success: true,
         *   data: {
         *     reset_token: "..."
         *   }
         * }
         *
         * Other responses may return:
         *
         * {
         *   success: true,
         *   reset_token: "..."
         * }
         */
        const responsePayload =
          response.data?.data ||
          response.data;

        console.log(
          "OTP response payload:",
          responsePayload
        );

        /*
         * Support common token names.
         */
        const resetToken =
          responsePayload?.reset_token ||
          responsePayload?.resetToken ||
          responsePayload?.token ||
          "";

        console.log(
          "Reset token received:",
          resetToken
        );

        /*
         * Backend must return a reset token.
         */
        if (!resetToken) {
          setError(
            "Reset token was not received from the server. Please request a new OTP."
          );

          return;
        }

        /*
         * Navigate to Reset Password and preserve
         * both email and reset token.
         */
        console.log(
          "Navigating to Reset Password:",
          {
            email,
            resetToken,
          }
        );

        navigate("/reset-password", {
          replace: true,
          state: {
            email,
            resetToken,
          },
        });

        return;
      }

      /*
       * REGISTRATION FLOW
       */
      alert(
        response.data?.message ||
          "Email verified successfully!"
      );

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const timer = `00:${String(seconds).padStart(
    2,
    "0"
  )}`;

  return (
    <div className="page">
      <header className="header">
        <span className="logo">
          Motors<span>Cube</span>
        </span>
      </header>

      <main className="main">
        <section className="hero">
          <span className="hero-label">
            VERIFICATION
          </span>

          <h1>
            {isPasswordReset
              ? "Verify Your Identity"
              : "Confirm It’s You"}
          </h1>

          <p>
            {isPasswordReset
              ? "Verify your email to securely reset your password."
              : "A short verification code protects your account from unauthorized registrations."}
          </p>

          <div className="ring ring-outer"></div>
          <div className="ring ring-inner"></div>
        </section>

        <section className="card">
          <h2>
            {isPasswordReset
              ? "OTP Verification — Reset Password"
              : "OTP Verification — Sign Up"}
          </h2>

          <p className="muted">
            {isPasswordReset
              ? "Verify your email to continue."
              : "Step 4 of 4 · Verify your contact details."}
          </p>

          <div
            className="dots"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((dot) => (
              <span key={dot}></span>
            ))}
          </div>

          <p className="muted">
            Enter the 6-digit code sent to{" "}
            {email || "your email"}.
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
                    inputs.current[index] =
                      element;
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  maxLength={1}
                  aria-label={`Digit ${
                    index + 1
                  }`}
                  onChange={(event) =>
                    handleChange(
                      index,
                      event
                    )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      index,
                      event
                    )
                  }
                  disabled={
                    loading || resending
                  }
                />
              ))}
            </div>

            {error && (
              <p className="error-text">
                {error}
              </p>
            )}

            {successMessage && (
              <p className="success-text">
                {successMessage}
              </p>
            )}

            <p className="resend">
              {seconds > 0 ? (
                <>
                  Didn't receive the code?
                  {" "}
                  Resend in {timer}
                </>
              ) : (
                <>
                  Didn't receive the code?
                  {" "}
                  <button
                    type="button"
                    className="link"
                    onClick={resend}
                    disabled={
                      loading || resending
                    }
                  >
                    {resending
                      ? "Sending..."
                      : "Resend now"}
                  </button>
                </>
              )}
            </p>

            <button
              type="submit"
              className="primary"
              disabled={
                !complete ||
                loading ||
                resending
              }
            >
              {loading
                ? "Verifying..."
                : isPasswordReset
                  ? "Verify & Reset Password"
                  : "Verify & Create Account"}
            </button>
          </form>

          <button
            type="button"
            className="link change"
            onClick={() =>
              navigate(
                isPasswordReset
                  ? "/forgot-password"
                  : "/signup"
              )
            }
            disabled={loading || resending}
          >
            {isPasswordReset
              ? "Change Email"
              : "Change Mobile / Email"}
          </button>
        </section>
      </main>
    </div>
  );
}
