export async function signRequest(
  secret: string,
  kid: string
): Promise<{ nonce: string; signature: string }> {
  const nonce = Date.now().toString();
  const message = nonce + kid;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const buf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  const signature = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { nonce, signature };
}
