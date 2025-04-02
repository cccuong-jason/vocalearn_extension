// src/core/domain/ports/analytics-service.ts
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

export interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): void;
  setUserProperty(property: string, value: any): void;
}
