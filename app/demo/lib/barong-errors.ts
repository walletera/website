const MESSAGES: Record<string, string> = {
  // Registration
  "identity.captcha.required": "CAPTCHA verification is required.",
  "identity.user.exist": "An account with this email already exists.",
  "identity.user.missing_email": "Email is required.",
  "identity.user.missing_pass": "Password is required.",
  "identity.user.invalid_password": "Password is invalid.",
  "identity.user.not_found": "No account found with this email.",
  "identity.user.disabled": "This account has been disabled.",
  // Password requirements (regex: lowercase + uppercase + digit + special, 8–80 chars)
  "password.requirements": "Password must be 8–80 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  "password.requirements.uppercase": "Password must contain at least one uppercase letter.",
  "password.requirements.lowercase": "Password must contain at least one lowercase letter.",
  "password.requirements.digit": "Password must contain at least one number.",
  "password.requirements.special": "Password must contain at least one special character.",
  "password.requirements.length": "Password must be between 8 and 80 characters.",
  // Session
  "identity.session.invalid_params": "Invalid email or password.",
  "identity.session.invalid_login_params": "Invalid email or password.",
  "identity.session.banned": "This account has been suspended.",
  "identity.session.invalid": "Session is invalid or expired.",
  // OTP
  "identity.otp.already_enabled": "Two-factor authentication is already enabled.",
  "identity.otp.invalid_otp": "Invalid authenticator code.",
  "identity.otp.missing_code": "Authenticator code is required.",
  // API keys
  "identity.api_key.missing_totp_code": "Authenticator code is required.",
  "identity.api_key.invalid_totp_code": "Invalid authenticator code.",
};

function statusFallback(status: number): string {
  if (status === 400) return "Invalid request. Please check your inputs.";
  if (status === 401) return "Authentication required. Please log in.";
  if (status === 403) return "You don't have permission to do this.";
  if (status === 404) return "Not found.";
  if (status === 422) return "Validation failed. Please check your inputs.";
  if (status >= 500) return "Something went wrong on the server. Please try again.";
  return "An unexpected error occurred. Please try again.";
}

export function parseBarongError(body: unknown, status?: number): string | null {
  if (!body || typeof body !== "object") {
    return status != null ? statusFallback(status) : null;
  }
  const b = body as Record<string, unknown>;
  const codes: string[] = Array.isArray(b.errors)
    ? (b.errors as string[])
    : typeof b.error === "string"
    ? [b.error]
    : [];
  if (codes.length === 0) {
    return status != null ? statusFallback(status) : null;
  }
  const messages = codes
    .map((code) => MESSAGES[code] ?? null)
    .filter((m): m is string => m !== null);
  if (messages.length > 0) return messages.join(" ");
  return status != null ? statusFallback(status) : codes.join(" ");
}
