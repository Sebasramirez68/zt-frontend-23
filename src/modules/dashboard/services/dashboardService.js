import { http } from '../../../shared/api/httpClient.js';

export const dashboardService = {
  getData() {
    return http('/dashboard/data');
  },
};
