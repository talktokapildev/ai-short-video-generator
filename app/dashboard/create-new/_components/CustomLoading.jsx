import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogContent className="bg-white">
        <VisuallyHidden>
          <AlertDialogTitle>
            Custom Loading for AI Short Video generator
          </AlertDialogTitle>
          <AlertDialogDescription>
            Custom Loading Description for AI Short Video generator
          </AlertDialogDescription>
        </VisuallyHidden>
        <VisuallyHidden id="dialog-description">
          dialog description
        </VisuallyHidden>
        <div className="bg-white flex flex-col items-center my-10 justify-center">
          <Image
            src={"/progress.gif"}
            width={100}
            height={100}
            alt="progress"
          />
          <h2>Generating your video... Do not Refresh</h2>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CustomLoading;
