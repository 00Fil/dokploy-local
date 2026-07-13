import type { GetServerSideProps } from "next";

export default function LicenseSettingsRemoved() {
	return null;
}

export const getServerSideProps: GetServerSideProps = async () => ({
	redirect: {
		permanent: false,
		destination: "/dashboard/settings/profile",
	},
});
