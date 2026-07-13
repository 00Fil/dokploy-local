/**
 * Local-only build compatibility helpers. License activation, validation and
 * deactivation never perform network requests.
 */
export const validateLicenseKey = async (_licenseKey: string) => true;

export const activateLicenseKey = async (_licenseKey: string) => ({
	success: true,
	local: true,
});

export const deactivateLicenseKey = async (_licenseKey: string) => ({
	success: true,
	local: true,
});
