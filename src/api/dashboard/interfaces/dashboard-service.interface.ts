export interface DashboardServiceInterface<T> {
  getDashboard(...args: any[]): Promise<T>;
}
