"use client";

import { useState } from "react";
import { ensurePortalTokenAction, revokePortalTokenAction } from "@/app/actions/clients";
import SubmitButton from "@/components/SubmitButton";

export default function PortalLinkSection({
  clientId,
  portalToken,
}: {
  clientId: string;
  portalToken: string | null;
}) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined" && portalToken
      ? `${window.location.origin}/portal/${portalToken}`
      : portalToken
        ? `/portal/${portalToken}`
        : null;

  async function handleCopy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!portalToken) {
    return (
      <form action={ensurePortalTokenAction}>
        <input type="hidden" name="clientId" value={clientId} />
        <SubmitButton pendingLabel="Génération…">
          Générer un lien de portail client
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <code className="font-mono text-xs bg-paper border border-line rounded-sm px-2 py-1.5 break-all">
          {url}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs font-mono border border-line rounded-sm px-2 py-1.5 hover:bg-line/40 transition-colors"
        >
          {copied ? "Copié ✓" : "Copier"}
        </button>
      </div>
      <form action={revokePortalTokenAction}>
        <input type="hidden" name="clientId" value={clientId} />
        <button type="submit" className="text-xs text-clay hover:underline">
          Révoquer ce lien
        </button>
      </form>
    </div>
  );
}
