"use client";
import { Button } from "@/components/ui/button";

export function ApprovalActions({ status, onApprove, onEdit, onReject, onSchedule, onArchive, onDuplicate, onTemplate }) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {status === "generated" && <Button onClick={onEdit}>Edit</Button>}
      {status === "generated" && <Button onClick={onApprove} variant="success">Approve</Button>}
      {status === "needs_review" && <Button onClick={onApprove} variant="success">Approve</Button>}
      {status !== "archived" && <Button onClick={onReject} variant="destructive">Reject</Button>}
      {status === "approved" && <Button onClick={onSchedule}>Schedule</Button>}
      <Button onClick={onDuplicate}>Duplicate</Button>
      <Button onClick={onTemplate}>Save as Template</Button>
      {status !== "archived" && <Button onClick={onArchive}>Archive</Button>}
    </div>
  );
}
