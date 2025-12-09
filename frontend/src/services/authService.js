import { authApi } from "../api/authApi";

const STORAGE_KEY = "seatify_user";

function saveUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

export const authService = {

  async register(email, password) {
    // сначала создаём пользователя
    await authApi.register(email, password);
    // затем логинимся, чтобы выставить куку и сохранить юзера
    return this.login(email, password);
  },
  /**
   * Авторизация пользователя:
   * отправляет email+password → сервер ставит куку → сохраняем данные в localStorage.
   */
  async login(email, password) {
    await authApi.login(email, password);

    // запрос /me, чтобы получить текущего пользователя.
    const user = await authApi.me();

    saveUser(user);

    return user;
  },

  /**
   * Выход: очищаем куку и localStorage с данными пользователя.
   */
  async logout() {
    try {
      await authApi.logout?.();
    } catch (e) {
      console.error("Logout failed", e);
    }
    clearUser();
  },

  /**
   * Синхронизация состояния localStorage с сервером:
   * - если кука есть → вернёт пользователя из БД
   * - если куки нет → очистит localStorage
   */
  async sync() {
    try {
      const user = await authApi.me();
      saveUser(user);
      return user;
    } catch {
      clearUser();
      return null;
    }
  },

  /**
   * Получение пользователя из localStorage.
   */
  getUser() {
    return loadUser();
  },

  /**
   * Проверка, залогинен ли пользователь.
   */
  isAuthenticated() {
    return !!loadUser();
  },
};
