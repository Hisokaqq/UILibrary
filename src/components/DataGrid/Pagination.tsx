import React from "react";
import { Button } from "../ui/button";

interface PaginationProps {
  page: number;
  nPages: number;
  setPage: (page: number) => void;
}

export const Pagination = ({ page, nPages, setPage }: PaginationProps) => {
  return (
    <div className="flex justify-between items-center mt-auto">
      <div className="text-sm text-gray-500">
        Page {page} of {nPages}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Prev
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === nPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
