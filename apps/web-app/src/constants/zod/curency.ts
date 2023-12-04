import { z } from "zod";

export const zCurrency = z.enum(["USD", "GBP", "EUR", "AUD", "CAD"]);
