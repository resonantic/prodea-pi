export {};

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresDonorStatus?: boolean;
    requiresBeneficiaryStatus?: boolean;
    requiresAdminStatus?: boolean;
  }
}
