import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import EventForm from "./components/EventForm";

interface EventDialogProps {
  id?: string;
}

const EventDialog = ({ id }: EventDialogProps) => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>
            <Plus />
            Add Event
          </Button>
        </DialogTrigger>
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
