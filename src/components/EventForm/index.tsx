import React from "react";
import { Input } from "@/components/ui/input";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { eventSchema } from "@/schemas/eventSchema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type z from "zod";
import { useData } from "@/context/DataContext";
import CustomCalendar from "./components/CustomCalendar";
import CustomSelect from "./components/CustomSelect";

export type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  id?: string;
}

const EventForm = ({ id }: EventFormProps) => {
  const { addData, getById, editData } = useData();

  const event = getById(id || "");

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      date: "",
      status: "in-progress",
    },
    values: event
      ? {
          title: event.title,
          date: event.date,
          status: event.status,
        }
      : undefined,
  });

  const onSubmitCreate = (values: z.infer<typeof eventSchema>) => {
    addData(values);
  };
  const onSubmitEdit = (values: z.infer<typeof eventSchema>) => {
    if (!id) return;
    editData(id, values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(id ? onSubmitEdit : onSubmitCreate)}>
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Title</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Project Kickoff: 32"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <CustomSelect form={form} />
          <CustomCalendar form={form} />
        </FieldGroup>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">{id ? "Save changes" : "Create"}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventForm;
