import { http } from '../../../shared/api/httpClient.js';

export const authService = {
  login(username, password) {
    return http('/auth/login', { method: 'POST', body: { username, password }, auth: false });
  },
};
