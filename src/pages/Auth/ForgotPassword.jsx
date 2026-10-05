
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const API_BASE_URL = "http://localhost:5000/api/v1";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactLoading, setContactLoading] = useState(false);

  const [otp, setOtp] = useState(
    Array(OTP_LENGTH).fill("")
  );
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const [seconds, setSeconds] = useState(
    RESEND_SECONDS
  );

  const inputs = useRef([]);

  // =========================================================
  // OTP COUNTDOWN
  // =========================================================
  useEffect(() => {
    if (step !== 2 || seconds <= 0) return;

    const id = setTimeout(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearTimeout(id);
  }, [step, seconds]);

  // =========================================================
  // FOCUS FIRST OTP INPUT
  // =========================================================
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // =========================================================
  // SEND FORGOT PASSWORD OTP
  // =========================================================
  const handleSend = async () => {
    const value = contact.trim();

    if (!value) {
      setContactError(
        "Enter your registered email or mobile number."
      );
      return;
    }

    setContactError("");
    setContactLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          user_email: value,
        }
      );

      console.log(
        "Forgot password response:",
        response.data
      );

      // Clear previous OTP
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");

      // Restart countdown
      setSeconds(RESEND_SECONDS);

      // Move to OTP step
      setStep(2);

    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data || error.message
      );

      if (axios.isAxiosError(error)) {
        setContactError(
          error.response?.data?.message ||
            "Unable to send verification code. Please try again."
        );
      } else {
        setContactError(
          "Unable to send verification code. Please try again."
        );
      }
    } finally {
      setContactLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================
  const handleResend = async () => {
    if (
      seconds > 0 ||
      contactLoading ||
      otpLoading
    ) {
      return;
    }

    const value = contact.trim();

    if (!value) {
      setOtpError(
        "Email is missing. Please start again."
      );
      return;
    }

    setOtp(
      Array(OTP_LENGTH).fill("")
    );

    setOtpError("");
    setContactError("");
    setContactLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          user_email: value,
        }
      );

      console.log(
        "Resend OTP response:",
        response.data
      );

      setSeconds(RESEND_SECONDS);

      setTimeout(() => {
        inputs.current[0]?.focus();
      }, 100);

    } catch (error) {
      console.error(
        "Resend OTP error:",
        error.response?.data || error.message
      );

      if (axios.isAxiosError(error)) {
        setOtpError(
          error.response?.data?.message ||
            "Unable to resend verification code."
        );
      } else {
        setOtpError(
          "Unable to resend verification code."
        );
      }
    } finally {
      setContactLoading(false);
    }
  };

  // =========================================================
  // OTP INPUT
  // =========================================================
  const handleOtpChange = (index, value) => {
    const digit = value
      .replace(/\D/g, "")
      .slice(0, 1);

    setOtp((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    setOtpError("");

    if (
      digit &&
      index < OTP_LENGTH - 1
    ) {
      inputs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // OTP KEYBOARD CONTROLS
  // =========================================================
  const handleOtpKeyDown = (
    index,
    event
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowLeft" &&
      index > 0
    ) {
      inputs.current[index - 1]?.focus();
    }

    if (
      event.key === "ArrowRight" &&
      index < OTP_LENGTH - 1
    ) {
      inputs.current[index + 1]?.focus();
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (!otpLoading) {
        handleVerify();
      }
    }
  };

  // =========================================================
  // OTP PASTE
  // =========================================================
  const handleOtpPaste = (event) => {
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pastedDigits) {
      return;
    }

    event.preventDefault();

    const next = Array(OTP_LENGTH).fill("");

    pastedDigits
      .split("")
      .forEach((digit, index) => {
        next[index] = digit;
      });

    setOtp(next);
    setOtpError("");

    const focusIndex = Math.min(
      pastedDigits.length,
      OTP_LENGTH - 1
    );

    inputs.current[focusIndex]?.focus();
  };

  // =========================================================
  // VERIFY PASSWORD RESET OTP
  // =========================================================
  const handleVerify = async () => {
    const code = otp.join("");

    // Check OTP length
    if (code.length !== OTP_LENGTH) {
      setOtpError(
        "Enter all 6 digits of the code."
      );

      inputs.current[code.length]?.focus();

      return;
    }

    // Check email/contact
    if (!contact.trim()) {
      setOtpError(
        "Email is missing. Please start again."
      );
      return;
    }

    setOtpError("");
    setOtpLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-otp`,
        {
          user_email: contact.trim(),
          purpose: "password_reset",
          otp: code,
        }
      );

      console.log(
        "OTP verification response:",
        response.data
      );

      // =====================================================
      // IMPORTANT:
      // sendSuccess() puts the service result inside data.
      //
      // Backend returns:
      //
      // {
      //   success: true,
      //   message: "...",
      //   data: {
      //     success: true,
      //     message: "...",
      //     reset_token: "..."
      //   }
      // }
      // =====================================================

      const responseData =
        response.data?.data ||
        response.data;

      console.log(
        "OTP verification data:",
        responseData
      );

      const resetToken =
        responseData?.reset_token;

      console.log(
        "Reset token received:",
        resetToken
      );

      // =====================================================
      // MAKE SURE BACKEND RETURNED RESET TOKEN
      // =====================================================

      if (!resetToken) {
        setOtpError(
          "OTP was verified, but the reset token was not received. Please request a new OTP."
        );

        return;
      }

      // =====================================================
      // MOVE TO RESET PASSWORD PAGE
      // =====================================================

      navigate("/reset-password", {
        replace: true,
        state: {
          email: contact.trim(),
          resetToken: resetToken,
        },
      });

    } catch (error) {
      console.error(
        "OTP verification error:",
        error.response?.data || error.message
      );

      if (axios.isAxiosError(error)) {
        setOtpError(
          error.response?.data?.message ||
            error.response?.data?.error ||
            "Invalid or expired verification code."
        );
      } else {
        setOtpError(
          "Invalid or expired verification code."
        );
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // =========================================================
  // TIMER
  // =========================================================
  const timer = `00:${String(seconds).padStart(
    2,
    "0"
  )}`;

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="fp">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <header className="fp-header">

        <div className="fp-logo">
          Motors<span>Cube</span>
        </div>

        <a
          href="#"
          className="web-authentication"
        >
          Web Authentication
        </a>

      </header>


      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="fp-main">

        {/* ===================================================
            HERO
            =================================================== */}

        <section className="fp-hero">

          <small>
            {step === 1
              ? "ACCOUNT RECOVERY"
              : "IDENTITY CHECK"}
          </small>

          <h1>
            {step === 1
              ? "Forgot Password?"
              : "Verify Your Identity"}
          </h1>

          <p>
            {step === 1
              ? "We will send a one-time code to your registered contact so you can safely reset your password."
              : "The verification code is short-lived and can only be used for this password reset request."}
          </p>

          <div className="fp-ring fp-ring-a" />

          <div className="fp-ring fp-ring-b" />

        </section>


        {/* ===================================================
            STEP 1 — EMAIL
            =================================================== */}

        {step === 1 ? (

          <section className="fp-card">

            <h2>
              Forgot Password
            </h2>

            <p>
              Enter your registered email or mobile number.
            </p>

            <label htmlFor="fp-contact">
              Email or Mobile Number
            </label>

            <input
              id="fp-contact"
              className="fp-input"
              type="text"
              placeholder="Enter registered email or mobile number"
              autoComplete="username"
              value={contact}
              onChange={(event) => {
                setContact(event.target.value);
                setContactError("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  if (!contactLoading) {
                    handleSend();
                  }
                }
              }}
              disabled={contactLoading}
            />

            <div
              className="fp-err"
              role="alert"
            >
              {contactError}
            </div>

            <button
              type="button"
              className="fp-btn"
              onClick={handleSend}
              disabled={contactLoading}
            >
              {contactLoading
                ? "Sending..."
                : "Send Verification Code"}
            </button>

            <div className="fp-small">

              Remember your password?{" "}

              <Link
                className="fp-link"
                to="/login"
              >
                Sign In
              </Link>

            </div>

          </section>

        ) : (

          /* =================================================
             STEP 2 — OTP
             ================================================= */

          <section className="fp-card">

            <h2>
              Forgot Password — OTP
            </h2>

            <p>
              Verify your identity to continue.
            </p>

            <p>
              Enter the 6-digit code sent to your
              registered email.
            </p>

            <div
              className="fp-otp"
              role="group"
              aria-label="6-digit verification code"
            >

              {otp.map((digit, index) => (

                <input
                  key={index}
                  ref={(element) => {
                    inputs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  aria-label={`Digit ${index + 1}`}
                  autoComplete={
                    index === 0
                      ? "one-time-code"
                      : "off"
                  }
                  onChange={(event) =>
                    handleOtpChange(
                      index,
                      event.target.value
                    )
                  }
                  onKeyDown={(event) =>
                    handleOtpKeyDown(
                      index,
                      event
                    )
                  }
                  onPaste={handleOtpPaste}
                  disabled={otpLoading}
                />

              ))}

            </div>


            {/* =================================================
                RESEND
                ================================================= */}

            <div className="fp-small flush">

              Didn't receive the code?{" "}

              {seconds > 0 ? (

                <span>
                  Resend in {timer}
                </span>

              ) : (

                <button
                  type="button"
                  className="fp-link"
                  onClick={handleResend}
                  disabled={
                    contactLoading ||
                    otpLoading
                  }
                >
                  {contactLoading
                    ? "Sending..."
                    : "Resend code"}
                </button>

              )}

            </div>


            {/* =================================================
                ERROR
                ================================================= */}

            <div
              className="fp-err"
              role="alert"
            >
              {otpError}
            </div>


            {/* =================================================
                VERIFY BUTTON
                ================================================= */}

            <button
              type="button"
              className="fp-btn"
              onClick={handleVerify}
              disabled={
                otpLoading ||
                otp.join("").length !== OTP_LENGTH
              }
            >
              {otpLoading
                ? "Verifying..."
                : "Verify Code"}
            </button>


            {/* =================================================
                BACK TO LOGIN
                ================================================= */}

            <div className="fp-small">

              Remember your password?{" "}

              <Link
                className="fp-link"
                to="/login"
              >
                Sign In
              </Link>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}
