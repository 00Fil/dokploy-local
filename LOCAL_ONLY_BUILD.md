# Local-only build

This build enables the former enterprise feature set without a license key and does not contact Dokploy's license service.

## Changes

- The central license check always grants access locally.
- Remote license activation, validation and deactivation helpers are local no-ops.
- The periodic remote license-validation job is disabled.
- Enterprise session flags are enabled locally, including SCIM and SSO-related paths.
- The reusable enterprise UI gate renders its content directly.
- The License navigation item and settings screen were removed; the old route redirects to Profile.
- Existing database license columns and API shapes were retained for migration and compatibility safety.

## Verification

A source scan confirms there are no active references to the Dokploy license host or its activation/validation/deactivation endpoints under `packages/server/src` and `apps/dokploy`.
