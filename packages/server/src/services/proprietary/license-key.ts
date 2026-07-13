/**
 * Local-only build: proprietary features are enabled without a remote license.
 * The organization argument is retained for API compatibility.
 */
export const hasValidLicense = async (_organizationId: string) => true;
