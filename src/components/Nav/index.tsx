import React from "react";
import EventDialog from "../EventDialog";

const Nav = () => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Dashboard
      </h1>

      <EventDialog />
    </div>
  );
};

export default Nav;
