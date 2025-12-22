/**
 * EventDialog Component
 *
 * A modal wrapper that renders the `EventForm`. It automatically handles the distinction
 * between "Create" and "Edit" modes based on whether an `id` is provided.
 *
 * Usage:
 * - Wrap any button or clickable element with this component to turn it into a dialog trigger.
 * - Pass an `id` to open the form in "Edit Mode" (pre-filled data).
 * - Omit the `id` to open the form in "Create Mode" (empty form).
 *
 * @param {string} [id] - The ID of the event to edit. If undefined, the form defaults to creating a new event.
 * @param {React.ReactNode} children - The element (usually a Button) that triggers the dialog to open when clicked.
 *
 * @example
 * // Create Mode
 * <EventDialog>
 * <Button>Add New Event</Button>
 * </EventDialog>
 *
 * @example
 * // Edit Mode
 * <EventDialog id="evn-123">
 * <Button variant="ghost">Edit</Button>
 * </EventDialog>
 */

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
