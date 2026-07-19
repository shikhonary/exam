// ---------------------------------------------------------------------------
// SMS Service — Abstraction for sending OTP via SMS
// ---------------------------------------------------------------------------

export interface SmsProvider {
  send(phone: string, message: string): Promise<boolean>;
}

/**
 * Console-based SMS provider for development.
 * Logs OTP messages to the console instead of sending real SMS.
 */
export class ConsoleSmsProvider implements SmsProvider {
  async send(phone: string, message: string): Promise<boolean> {
    console.log(`\n📱 [SMS → ${phone}] ${message}\n`);
    return true;
  }
}

/**
 * HTTP-based SMS provider for production.
 * Replace the URL and payload format with your actual SMS gateway.
 */
export class HttpSmsProvider implements SmsProvider {
  constructor(
    private apiUrl: string,
    private apiKey: string,
  ) {}

  async send(phone: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ to: phone, message }),
      });
      return response.ok;
    } catch (error) {
      console.error("SMS send failed:", error);
      return false;
    }
  }
}

/**
 * Factory function to get the appropriate SMS provider.
 * Uses ConsoleSmsProvider in development, HttpSmsProvider in production.
 */
export function getSmsProvider(): SmsProvider {
  if (process.env.NODE_ENV === "production" && process.env.SMS_API_URL) {
    return new HttpSmsProvider(
      process.env.SMS_API_URL,
      process.env.SMS_API_KEY ?? "",
    );
  }
  return new ConsoleSmsProvider();
}
