import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { EventFormValues } from "..";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUSES } from "@/lib/mockData";

interface CustomSelectProps {
  form: UseFormReturn<EventFormValues>;
}

const CustomSelect = ({ form }: CustomSelectProps) => {
  return (
    <Controller
      name="status"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="responsive" data-invalid={fieldState.invalid}>
          <FieldContent>
            <FieldLabel htmlFor="form-rhf-select-language">
              Event status
            </FieldLabel>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            key={field.value}
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id="form-rhf-select-language"
              aria-invalid={fieldState.invalid}
              className="min-w-[120px]"
            >
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
};

export default CustomSelect;
