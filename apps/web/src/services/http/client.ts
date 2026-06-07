const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

export interface RequestOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const apiBaseLabel = API_BASE_URL || "the local /api proxy";

export const apiBaseUrl = API_BASE_URL;

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      `Cannot reach the API via ${apiBaseLabel}. Start PostgreSQL with "npm run db:up", the Go API with "npm run dev:api", and the frontend with "npm run dev".`,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("Content-Type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : (payload as { error?: string }).error ?? "Unexpected request failure";
    throw new ApiError(response.status, message);
  }

  return payload as T;
};
