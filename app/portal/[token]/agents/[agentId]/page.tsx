import { redirect } from "next/navigation";

export default async function AgentWorkspaceIndex({
  params,
}: {
  params: Promise<{ token: string; agentId: string }>;
}) {
  const { token, agentId } = await params;
  redirect(`/portal/${token}/agents/${agentId}/chat`);
}
