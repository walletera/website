const MESSAGES: Record<string, string> = {
  "identity.captcha.required": "CAPTCHA verification is required",
  "identity.user.exist": "An account with this email already exists",
  "identity.user.missing_email": "Email is required",
  "identity.user.missing_pass": "Password is required",
  "identity.user.invalid_password": "Password does not meet the requirements",
  "identity.user.not_found": "No account found with this email",
  "identity.user.disabled": "This account has been disabled",
  "identity.session.invalid_params": "Invalid email or password",
  "identity.session.invalid_login_params": "Invalid email or password",
  "identity.session.banned": "This account has been suspended",
  "identity.session.invalid": "Session is invalid or expired",
  "identity.otp.already_enabled": "Two-factor authentication is already enabled",
  "identity.otp.invalid_otp": "Invalid authenticator code",
  "identity.otp.missing_code": "Authenticator code is required",
  "identity.api_key.missing_totp_code": "Authenticator code is required",
  "identity.api_key.invalid_totp_code": "Invalid authenticator code",
};

export function parseBarongError(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const codes: string[] = Array.isArray(b.errors)
    ? (b.errors as string[])
    : typeof b.error === "string"
    ? [b.error]
    : [];
  if (codes.length === 0) return null;
  return codes.map((code) => MESSAGES[code] ?? code).join(" ");
}
