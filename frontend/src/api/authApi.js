import { apiClient } from "./apiClient";

export const authApi = {
  register(email, password) {
    return apiClient.post("/register", { email, password });
  },
  login(email, password) {
    return apiClient.post("/login", { email, password });
  },
  me() {
    return apiClient.get("/me");
  },
  logout() {
    return apiClient.post("/logout", {});
  },
};
