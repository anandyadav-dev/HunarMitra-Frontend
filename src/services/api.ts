const API_BASE_URL = "/api/v1";

// Helper to get local storage item safely in Next.js SSR
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("hunarmitra_admin_token");
  }
  return null;
};

// Global loader state
let activeRequests = 0;

const dispatchLoader = (isLoading: boolean) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("global-loader", { detail: isLoading }));
  }
};

const incrementLoader = () => {
  activeRequests++;
  if (activeRequests === 1) {
    dispatchLoader(true);
  }
};

const decrementLoader = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    dispatchLoader(false);
  }
};

// Generic fetch wrapper with auth header inject
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  const authToken = headers.get("Authorization")?.replace(/^Bearer\s+/, "") || token;

  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  incrementLoader();
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "An error occurred while fetching data.";
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          if (typeof errorData.detail === 'string') {
            errorMessage = errorData.detail;
          } else if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e: any) => e.msg).join(', ');
          } else {
            errorMessage = JSON.stringify(errorData.detail);
          }
        } else if (errorData.message) {
          errorMessage = typeof errorData.message === 'string'
            ? errorData.message
            : JSON.stringify(errorData.message);
        }
      } catch (e) {
        // JSON parsing failed, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    // Handle 204 No Content or empty responses
    const contentType = response.headers.get("content-type");
    if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    return await response.json() as T;
  } finally {
    decrementLoader();
  }
}

export const api = {
  // Authentication & Onboarding
  auth: {
    sendOtp: (phoneNumber: string) =>
      apiFetch<{ message: string }>("/auth/login-otp", {
        method: "POST",
        body: JSON.stringify({ phone_number: phoneNumber }),
      }),

    verifyOtp: (phoneNumber: string, otp: string) =>
      apiFetch<{ access_token: string; token_type: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ phone_number: phoneNumber, otp }),
      }),

    // Admin self profile checking
    getProfile: (tokenOverride?: string) => {
      const headers = tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : undefined;
      // We can use a general authenticated endpoint to fetch the user profile.
      // Workers get_dashboard_stats or customers history requires respective roles, 
      // but getting user details for ourselves is easy using the users detail endpoint,
      // or we can decode the token or fetch details of the admin from /admin/users list.
      // For simplicity, we can call /admin/dashboard-stats to verify we are an admin.
      return apiFetch<any>("/admin/dashboard-stats", { headers });
    }
  },

  // Admin Operations
  admin: {
    getStats: () => apiFetch<any>("/admin/dashboard-stats"),

    // Users
    getUsers: (params: { skip?: number; limit?: number; role?: string; search?: string; is_verified?: boolean }) => {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set("skip", params.skip.toString());
      if (params.limit !== undefined) query.set("limit", params.limit.toString());
      if (params.role) query.set("role", params.role);
      if (params.search) query.set("search", params.search);
      if (params.is_verified !== undefined) query.set("is_verified", params.is_verified.toString());
      return apiFetch<{ total: number; items: any[] }>(`/admin/users?${query.toString()}`);
    },
    getUser: (id: number | string) => apiFetch<any>(`/admin/users/${id}`),
    updateUser: (id: number | string, data: { full_name?: string; language_preference?: string; is_verified?: boolean }) =>
      apiFetch<any>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteUser: (id: number | string) => apiFetch<any>(`/admin/users/${id}`, { method: "DELETE" }),
    assignUserRole: (id: number | string, roleName: string, parentRoleName?: string) =>
      apiFetch<any>(`/admin/users/${id}/roles`, {
        method: "POST",
        body: JSON.stringify({ role_name: roleName, parent_role_name: parentRoleName }),
      }),
    removeUserRole: (id: number | string, roleName: string) =>
      apiFetch<any>(`/admin/users/${id}/roles/${roleName}`, {
        method: "DELETE",
      }),

    // Roles CRUD
    getRoles: () => apiFetch<any[]>("/admin/roles"),
    createRole: (data: { name: string; description?: string; parent_id?: number }) =>
      apiFetch<any>("/admin/roles", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateRole: (id: number | string, data: { name?: string; description?: string; parent_id?: number }) =>
      apiFetch<any>(`/admin/roles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteRole: (id: number | string) =>
      apiFetch<any>(`/admin/roles/${id}`, {
        method: "DELETE",
      }),

    // Workers
    getWorkers: (params: { skip?: number; limit?: number; kyc_status?: string; category?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set("skip", params.skip.toString());
      if (params.limit !== undefined) query.set("limit", params.limit.toString());
      if (params.kyc_status) query.set("kyc_status", params.kyc_status);
      if (params.category) query.set("category", params.category);
      if (params.search) query.set("search", params.search);
      return apiFetch<{ total: number; items: any[] }>(`/admin/workers?${query.toString()}`);
    },
    getWorker: (id: number | string) => apiFetch<any>(`/admin/workers/${id}`),
    verifyWorker: (id: number | string, status: "approved" | "rejected", rejectionReason?: string) =>
      apiFetch<any>(`/admin/workers/${id}/verify`, {
        method: "POST",
        body: JSON.stringify({ status, rejection_reason: rejectionReason }),
      }),

    // Contractors
    getContractors: (params: { skip?: number; limit?: number; kyc_status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set("skip", params.skip.toString());
      if (params.limit !== undefined) query.set("limit", params.limit.toString());
      if (params.kyc_status) query.set("kyc_status", params.kyc_status);
      if (params.search) query.set("search", params.search);
      return apiFetch<{ total: number; items: any[] }>(`/admin/contractors?${query.toString()}`);
    },
    getContractor: (id: number | string) => apiFetch<any>(`/admin/contractors/${id}`),
    verifyContractor: (id: number | string, status: "approved" | "rejected", rejectionReason?: string) =>
      apiFetch<any>(`/admin/contractors/${id}/verify`, {
        method: "POST",
        body: JSON.stringify({ status, rejection_reason: rejectionReason }),
      }),

    // Bookings
    getBookings: (params: { skip?: number; limit?: number; status?: string; search?: string }) => {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set("skip", params.skip.toString());
      if (params.limit !== undefined) query.set("limit", params.limit.toString());
      if (params.status) query.set("status", params.status);
      if (params.search) query.set("search", params.search);
      return apiFetch<{ total: number; items: any[] }>(`/admin/bookings?${query.toString()}`);
    },
    getBooking: (id: number | string) => apiFetch<any>(`/admin/bookings/${id}`),
    updateBookingStatus: (id: number | string, status: string) =>
      apiFetch<any>(`/admin/bookings/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),

    // Services
    getServices: () => apiFetch<any[]>("/admin/services"),
    createService: (data: { name: string; base_price: number; icon_url?: string }) =>
      apiFetch<any>("/admin/services", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    updateService: (id: number | string, data: { name?: string; base_price?: number; icon_url?: string }) =>
      apiFetch<any>(`/admin/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    deleteService: (id: number | string) => apiFetch<any>(`/admin/services/${id}`, { method: "DELETE" }),

    // Wallets & Finance
    getWallets: (params: { skip?: number; limit?: number; search?: string }) => {
      const query = new URLSearchParams();
      if (params.skip !== undefined) query.set("skip", params.skip.toString());
      if (params.limit !== undefined) query.set("limit", params.limit.toString());
      if (params.search) query.set("search", params.search);
      return apiFetch<{ total: number; items: any[] }>(`/admin/wallets?${query.toString()}`);
    },
    adjustWalletBalance: (id: number | string, amount: number, type: "credit" | "debit", description?: string) =>
      apiFetch<any>(`/admin/wallets/${id}/adjust`, {
        method: "POST",
        body: JSON.stringify({ amount, type, description }),
      }),
  },
};
