import { api } from "@/utils/api";
import { OrganizationStyleProvider } from "../dashboard/organization/organization-style-provider";
import { SupportChatWidget } from "../dashboard/support/support-chat-widget";
import { ImpersonationBar } from "../dashboard/impersonation/impersonation-bar";
import { HubSpotWidget } from "../shared/HubSpotWidget";
import Page from "./side";

interface Props {
  children: React.ReactNode;
  metaName?: string;
}

export const DashboardLayout = ({ children }: Props) => {
  const { data: haveRootAccess } = api.user.haveRootAccess.useQuery();
  const { data: isCloud } = api.settings.isCloud.useQuery();
  const { data: currentPlan } = api.stripe.getCurrentPlan.useQuery(undefined, {
    enabled: isCloud === true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const isChatEnabled = isCloud === true && currentPlan === "startup";

  return (
    <>
      <OrganizationStyleProvider />
      <Page>{children}</Page>
      <SupportChatWidget />
      {isChatEnabled && (
        <>
          <HubSpotWidget />
        </>
      )}

      {haveRootAccess === true && <ImpersonationBar />}
    </>
  );
};
