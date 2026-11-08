import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileBarChart2, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { StatusBadge } from "@/components/sessions/StatusBadge";
import { useAsync } from "@/hooks/useAsync";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { api } from "@/lib/api";
import { formatDateTime } from "@/lib/format";

type Filter = "all" | "ACTIVE" | "COMPLETED";

export default function SessionsPage() {
  useDocumentTitle("Sessions & Reports");
  const { data, loading, error, reload } = useAsync(
    () => api.listSessions(),
    [],
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (data ?? []).filter(
      (s) =>
        (filter === "all" || s.status === filter) &&
        (!q ||
          (s.student?.full_name ?? "").toLowerCase().includes(q) ||
          (s.title ?? "").toLowerCase().includes(q)),
    );
  }, [data, query, filter]);

  return (
    <>
      <PageHeader
        title="Sessions & Reports"
        description="Every viva you have run, with its report and your recorded assessment."
      />
      {error && (
        <Alert
          tone="danger"
          className="mb-6"
          title="Could not load sessions"
          action={
            <Button size="sm" variant="secondary" onClick={reload}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 md:flex-row md:items-center md:justify-between">
          <div className="md:w-80">
            <Input
              aria-label="Search sessions"
              placeholder="Search student or title"
              leftIcon={<Search className="size-4" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Tabs
            className="md:w-80"
            active={filter}
            onChange={setFilter}
            items={[
              { key: "all", label: "All" },
              { key: "ACTIVE", label: "Open" },
              { key: "COMPLETED", label: "Completed" },
            ]}
          />
        </div>

        {loading ? (
          <div className="space-y-3 p-5">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<FileBarChart2 className="size-6" />}
            title="No sessions found"
            description="Try a different search or filter, or start a viva from the dashboard."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50/70 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Session</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Your assessment</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((s) => (
                  <tr key={s.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={s.student?.full_name} size="sm" />
                        <span className="font-semibold text-slate-900">
                          {s.student?.full_name ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {s.title || "-"}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {formatDateTime(s.ended_at ?? s.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {s.status === "COMPLETED" ? (
                        s.lecturer_label !== null ? (
                          <Badge tone="green">{s.lecturer_label}/100</Badge>
                        ) : (
                          <Badge tone="amber">Not recorded</Badge>
                        )
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {s.status === "COMPLETED" ? (
                        <Link to={`/app/sessions/${s.id}/report`}>
                          <Button size="sm" variant="secondary">
                            Open report
                          </Button>
                        </Link>
                      ) : (
                        <Link to={`/app/lobby/${s.id}`}>
                          <Button size="sm">Enter</Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
