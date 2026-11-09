import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="This page is not in the assistant"
        description="The link may be old. Go home or send a note to People Ops."
      />
      <div className="flex flex-wrap gap-3">
        <Button href="/">Go home</Button>
        <Button href="/escalate" variant="secondary">
          Get help
        </Button>
      </div>
    </div>
  );
}
