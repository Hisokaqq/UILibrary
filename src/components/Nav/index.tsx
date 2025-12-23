import React from "react";
import EventDialog from "../EventDialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const Nav = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-primary/70">
        Dashboard
      </h1>

      <EventDialog>
        <Button>
          <Plus />
          Add Event
        </Button>
      </EventDialog>
    </div>
  );
};

export default Nav;
