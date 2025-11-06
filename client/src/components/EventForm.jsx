
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import InputField from "./ui/InputField";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/Button";
import toast from "react-hot-toast";
import {
  toInputDateTime,
  fromInputDateTimeToISO,
  formatDateTime,
} from "../lib/utils";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from "./ui/Select";
import { eventschema } from "../lib/schema";


const EventForm = ({ data, type, setOpen, onSuccess }) => {
  const [submitting, setSubmitting] = useState(false);
  const currentDateTime = formatDateTime();
  const statuses = ["BUSY", "SWAPPABLE", "SWAP_PENDING"];
  
  const getDefaultTimes = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    return {
      startingTime: toInputDateTime(oneHourLater),
      endingTime: toInputDateTime(twoHoursLater),
    };
  };

  const defaultValues = {
    title: "",
    desc: "",
    status: "BUSY",
    ...getDefaultTimes(),
    ...(data || {}),
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(eventschema),
    defaultValues,
    mode: "onChange",
  });

  const formValues = watch();
  const startTimeValue = formValues.startingTime;
  const selectedStatus = watch("status");

  useEffect(() => {
    if (data && type === "update") {
      reset({
        title: data.title || "",
        desc: data.desc || "",
        status: data.status || "BUSY",
        startingTime: data.startingTime
          ? toInputDateTime(data.startingTime)
          : getDefaultTimes().startingTime,
        endingTime: data.endingTime
          ? toInputDateTime(data.endingTime)
          : getDefaultTimes().endingTime,
      });
    }
  }, [data, type, reset]);

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const payload =
        type === "update"
          ? { status: formData.status }
          : {
              title: formData.title,
              desc: formData.desc,
              status: formData.status,
              startingTime: fromInputDateTimeToISO(formData.startingTime),
              endingTime: fromInputDateTimeToISO(formData.endingTime),
            };

      await onSuccess(payload);
      setOpen(false);
      toast.success(
        `Event ${type === "create" ? "created" : "status updated"} successfully!`
      );
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Operation failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getMinEndTime = () => {
    if (!startTimeValue) return currentDateTime;
    const startTime = new Date(startTimeValue);
    const minEndTime = new Date(startTime.getTime() + 60000);
    return toInputDateTime(minEndTime);
  };

  const isUpdate = type === "update";

  return (
    <form
      className="flex flex-col gap-6 p-2 sm:p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-xl font-semibold border-b-[#384e60] border-b-2 pb-2 text-lightGreen font-poppins">
        {isUpdate ? "Update Event Status" : "Create New Event"}
      </h1>
      <InputField
        label="Event title *"
        name="title"
        type="text"
        register={register}
        error={errors.title}
        className="md:col-span-2"
        placeholder="Enter event title"
        disabled={isUpdate}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Starting Time *"
          name="startingTime"
          type="datetime-local"
          register={register}
          error={errors.startingTime}
          min={currentDateTime}
          disabled={isUpdate}
        />
        <InputField
          label="Ending Time *"
          name="endingTime"
          type="datetime-local"
          register={register}
          error={errors.endingTime}
          min={getMinEndTime()}
          disabled={isUpdate}
        />
      </div>
      <div className="flex flex-col gap-2 w-full md:w-60">
        <label className="text-xs text-gray-500">Status *</label>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setValue("status", value)}
          disabled={submitting}
        >
          <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex items-center justify-between p-2 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
            <SelectValue placeholder="Select Status" />
            <ChevronDown className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectGroup>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.status?.message && (
          <p className="text-xs text-red-400">
            {errors.status.message.toString()}
          </p>
        )}
      </div>
      <Textarea
        label="Description *"
        name="desc"
        register={register}
        error={errors?.desc}
        rows={4}
        placeholder="Enter event description..."
        className="ring-gray-500 ring-[1.2px]"
        disabled={isUpdate}
      />

      <div className="space-y-2 text-sm font-poppins">
        {isUpdate ? (
          <p className="text-warning">⚠ You  Can Update only Status</p>
        ) : (
          errors?.endingTime?.message && (
            <p className="text-error font-medium">
              ⚠ {errors.endingTime.message}
            </p>
          )
        )}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(false)}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={submitting || !isValid}
        >
          {submitting
            ? "Processing..."
            : isUpdate
            ? "Update Status"
            : "Create Event"}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
