import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Deliverable } from "@prisma/client";
import DeckView from "@/components/DeckView";
import { updateDeliverableStatusAction } from "@/app/actions/deliverables";

const STATUSES = ["brouillon", "validé", "publié"];

const STATUS_STYLES: Record<string, string> = {
  brouillon: "bg-ochre/15 text-ochre border-ochre/40",
  "validé": "bg-forest/15 text-forest border-forest/40",
  "publié": "bg-steel/15 text-steel border-steel/40",
};

export default function DeliverableView({
  deliverable,
  readOnly = false,
}: {
  deliverable: Deliverable;
  readOnly?: boolean;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 no-print">
        <div className="font-mono text-xs text-ink/40">
          {deliverable.agent}
          {deliverable.kind ? ` · ${deliverable.kind}` : ""} ·{" "}
          {deliverable.createdAt.toISOString().slice(0, 10)}
        </div>

        {readOnly ? (
          <span
            className={`font-mono text-xs border rounded-sm px-2 py-1 ${STATUS_STYLES[deliverable.status] ?? "border-line text-ink/50"}`}
          >
            {deliverable.status}
          </span>
        ) : (
          <form action={updateDeliverableStatusAction} className="flex items-center gap-2">
            <input type="hidden" name="deliverableId" value={deliverable.id} />
            <label htmlFor="status" className="font-mono text-xs text-ink/40">
              statut
            </label>
            <select
              id="status"
              name="status"
              defaultValue={deliverable.status}
              onChange={(e) => e.currentTarget.form?.requestSubmit()}
              className={`font-mono text-xs border rounded-sm px-2 py-1 bg-white ${STATUS_STYLES[deliverable.status] ?? "border-line"}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </form>
        )}
      </div>

      {deliverable.agent === "presentateur" ? (
        <DeckView content={deliverable.content} title={deliverable.title} />
      ) : (
        <article className="markdown-body bg-white border border-line rounded-sm p-6 md:p-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{deliverable.content}</ReactMarkdown>
        </article>
      )}
    </div>
  );
}
