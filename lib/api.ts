/**
 * The only place the app talks to the Spring Boot backend.
 * Conversation state lives server-side, keyed by conversationId — we send just
 * the new user message each turn and never replay the transcript.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export type ChatResponse = { reply: string; conversationId: string };

export class RateLimitError extends Error {
  /** Undefined unless the backend exposes Retry-After via CORS. */
  retryAfter?: number;
  constructor(retryAfter?: number) {
    super("rate limited");
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiError";
  }
}

function baseUrl(): string {
  if (!BASE_URL) {
    throw new ApiError("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  return BASE_URL.replace(/\/+$/, "");
}

async function post(path: string, body: unknown): Promise<Response> {
  let res: Response;
  try {
    res = await fetch(`${baseUrl()}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("network");
  }

  if (res.status === 429) {
    // Retry-After is not CORS-safelisted, so it is only readable when the
    // backend sends Access-Control-Expose-Headers: Retry-After.
    const header = Number(res.headers.get("Retry-After"));
    throw new RateLimitError(Number.isFinite(header) && header > 0 ? header : undefined);
  }
  if (!res.ok) {
    throw new ApiError(`request failed (${res.status})`);
  }
  return res;
}

/** Send one new user message. Returns the assistant reply + the id to reuse. */
export async function sendChat(
  conversationId: string,
  content: string,
): Promise<ChatResponse> {
  const res = await post("/chat", {
    conversationId,
    message: { role: "user", content },
  });

  const data = (await res.json()) as Partial<ChatResponse>;
  if (typeof data.reply !== "string") {
    throw new ApiError("malformed reply");
  }
  return {
    reply: data.reply,
    conversationId: data.conversationId || conversationId,
  };
}

/** Record whether the assistant actually got the student unstuck. */
export async function sendDeflection(input: {
  conversationId: string;
  resolved: boolean;
  topic?: string;
  device?: string;
  feedback?: string;
}): Promise<void> {
  // Optional fields are omitted rather than guessed — the backend prefers absent
  // over wrong for topic/device.
  const body: Record<string, unknown> = {
    conversationId: input.conversationId,
    resolved: input.resolved,
  };
  if (input.topic) body.topic = input.topic;
  if (input.device) body.device = input.device;
  if (input.feedback) body.feedback = input.feedback;

  await post("/deflection", body);
}
