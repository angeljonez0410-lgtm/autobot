import { Badge } from "@/components/ui/badge";
import { PostStatus } from "@/lib/types";

const statusStyles: Record<PostStatus, string> = {
  idea: "bg-[#fde8f1] text-[#9e3d68]",
  draft: "bg-[#fff0d7] text-[#9b650f]",
  ready: "bg-[#e8f7f1] text-[#1f7a5a]",
  scheduled: "bg-[#e7efff] text-[#315cae]",
  posted: "bg-[#ede9ff] text-[#5e43b7]",
};

export function StatusBadge({ status }: { status: PostStatus }) {
  return <Badge className={statusStyles[status]}>{status.toUpperCase()}</Badge>;
}
