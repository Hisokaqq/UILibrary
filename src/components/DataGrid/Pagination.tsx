import React from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPage(page + 1)}
          disabled={page === nPages}
        >
          <ChevronRight />
        </Button>
      </ButtonGroup>
    </div>
  );
};
