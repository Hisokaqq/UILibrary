import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

const Nav = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Dashboard
      </h1>
      <Button>
        <Plus />
        Add Event
      </Button>
    </div>
  );
};

export default Nav;
