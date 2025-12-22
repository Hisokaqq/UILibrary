import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { ChevronDownIcon } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "..";

interface CustomCalendarProps {
  form: UseFormReturn<EventFormValues>;
}

const CustomCalendar = ({ form }: CustomCalendarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="date"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="date">Due Date</FieldLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-start text-left font-normal"
              >
                {field.value ? (
                  field.value
                ) : (
                  <span className="text-muted-foreground">Select date</span>
                )}
                <ChevronDownIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={
                  field.value
                    ? (() => {
                        const [day, month, year] = field.value
                          .split("/")
                          .map(Number);
                        return new Date(year, month - 1, day);
                      })()
                    : undefined
                }
                onSelect={(date) => {
                  if (!date) {
                    field.onChange("");
                    return;
                  }
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const year = date.getFullYear();

                  field.onChange(`${year}/${month}/${day}`);
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default CustomCalendar;
