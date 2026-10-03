import { z } from "zod";

export const vendorIdSchema = z.string().min(1);
export const vendorSearchSchema = z.string().max(100);
