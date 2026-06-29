import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body || {};

  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and verification code are required." });
  }

  try {
    const check = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone.trim(), code: String(code).trim() });

    if (check.status === "approved") {
      return res.status(200).json({ ok: true });
    }

    return res.status(422).json({ error: "Invalid or expired code. Please try again." });
  } catch (err) {
    return res.status(422).json({ error: err.message || "Verification failed." });
  }
}
