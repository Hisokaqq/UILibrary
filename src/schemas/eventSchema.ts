import { z } from "zod";
import { STATUSES } from "@/lib/mockData";

export const eventSchema = z.object({
  title: z.string().min(1).max(50),
  date: z.string().min(1),
  status: z.enum(STATUSES),
});
