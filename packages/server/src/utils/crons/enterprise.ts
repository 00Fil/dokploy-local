/**
 * Local-only build: no remote license server is contacted and no validation
 * job is scheduled. Exports are retained for compatibility with existing code.
 */
export const initEnterpriseBackupCronJobs = async () => undefined;

export const validateLicenseKey = async (_licenseKey: string) => true;
