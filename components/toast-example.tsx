"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function ToastExample() {
  const { toast, successToast, errorToast, warningToast, infoToast } =
    useToast();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Toast Examples</h2>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            successToast({
              title: "Success!",
              description: "Your action was completed successfully.",
            });
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          Show Success Toast
        </Button>

        <Button
          onClick={() => {
            errorToast({
              title: "Error!",
              description: "Something went wrong. Please try again.",
            });
          }}
          className="bg-red-600 hover:bg-red-700"
        >
          Show Error Toast
        </Button>

        <Button
          onClick={() => {
            warningToast({
              title: "Warning!",
              description: "Please be careful with this action.",
            });
          }}
          className="bg-yellow-600 hover:bg-yellow-700"
        >
          Show Warning Toast
        </Button>

        <Button
          onClick={() => {
            infoToast({
              title: "Info",
              description: "Here's some useful information for you.",
            });
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Show Info Toast
        </Button>

        <Button
          onClick={() => {
            toast({
              title: "Default Toast",
              description:
                "This is a default toast without any specific variant.",
            });
          }}
          variant="outline"
        >
          Show Default Toast
        </Button>
      </div>
    </div>
  );
}
