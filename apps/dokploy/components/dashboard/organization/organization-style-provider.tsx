import { api } from "@/utils/api";

export function OrganizationStyleProvider() {
  const { data } = api.organization.getStyle.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  if (!data?.customCss) return null;
  return (
    <style
      id="organization-custom-styles"
      data-organization-id={data.organizationId}
      dangerouslySetInnerHTML={{ __html: data.customCss }}
    />
  );
}
