import { z } from "zod";
import { STATUSES } from "@/lib/mockData";

export const eventSchema = z.object({
  title: z.string().min(1, "required").max(50, "too long"),
  date: z.string().min(1, "required"),
  status: z.enum(STATUSES, "required"),
});
