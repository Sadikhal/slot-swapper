import z from "zod";

export const eventschema = z
  .object({
    title: z
      .string()
      .min(4, "Title must be at least 4 characters")
      .max(100, "Title too long"),
    desc: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description too long"),
    status: z.enum(["BUSY", "SWAPPABLE", "SWAP_PENDING"], {
      required_error: "Status is required",
    }),
    startingTime: z.string().min(1, "Starting time is required"),
    endingTime: z.string().min(1, "Ending time is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.startingTime);
      const end = new Date(data.endingTime);
      const now = new Date();
      if (start < now) return false;
      return end > start;
    },
    {
      message:
        "Start time must be in future and end time must be after start time",
      path: ["endingTime"],
    }
  );
