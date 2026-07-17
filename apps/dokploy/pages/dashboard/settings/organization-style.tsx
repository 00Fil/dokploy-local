import { validateRequest } from "@dokploy/server";
import type { GetServerSidePropsContext } from "next";
import type { ReactElement } from "react";
import { OrganizationStyleSettings } from "@/components/dashboard/settings/organization-style";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

const Page = () => <OrganizationStyleSettings />;
export default Page;
Page.getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { user } = await validateRequest(ctx.req);
  if (!user || (user.role !== "owner" && user.role !== "admin")) {
    return { redirect: { permanent: false, destination: "/dashboard/home" } };
  }
  return { props: {} };
}
