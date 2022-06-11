export {};

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresDoador?: boolean;
    requiresConsumidor?: boolean;
    requiresAdmin?: boolean;
  }
}
