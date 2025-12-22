import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventForm from "../EventForm";

interface EventDialogProps {
  id?: string;
  children: React.ReactNode;
}

const EventDialog = ({ id, children }: EventDialogProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {id ? "Edit an event" : "Create an event"}
            </DialogTitle>
          </DialogHeader>
          <EventForm id={id} />
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default EventDialog;
