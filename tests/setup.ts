import { vi } from "vitest";

export const mockAdminUser = {
  id: "1",
  role: "ADMIN",
  status: "ACTIVE",
};

export const mockAnalystUser = {
  id: "2",
  role: "ANALYST",
  status: "ACTIVE",
};

export const mockViewerUser = {
  id: "3",
  role: "VIEWER",
  status: "ACTIVE",
};

export const mockInactiveUser = {
  id: "4",
  role: "VIEWER",
  status: "INACTIVE",
};

export const createMockRequest = (options: {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  url?: string;
}) => {
  return {
    method: options.method || "GET",
    headers: new Map(Object.entries(options.headers || {})),
    json: vi.fn().mockResolvedValue(options.body),
    url: options.url || "http://localhost:3000",
    nextUrl: new URL(options.url || "http://localhost:3000"),
  };
};

export const createAuthHeader = (user: typeof mockAdminUser) => {
  return `Bearer mock-token-${user.id}`;
};
