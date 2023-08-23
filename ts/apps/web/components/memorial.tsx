import { Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function Memorial() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>A la memoire de John Keegan</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  );
}
