import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import toast from "react-hot-toast";

export default function useEventData() {
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc"); 

  const handleSearch = (term) => {
    const filtered = filteredItems(eventData, term);
    setFilteredData(filtered);
  };

  const handleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get("/event", {
          params: { sort: sortOrder },
        });
        const events = res.data?.events || [];
        setEventData(events);
        setFilteredData(events);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching event data");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [sortOrder]);


  const createEvent = async (payload) => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/event", payload);
      if (res.data?.event) {
        setEventData((prev) => [res.data.event, ...prev]);
        setFilteredData((prev) => [res.data.event, ...prev]);
      }
      return res.data?.event;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/event/${id}`, updatedData);
      if (res.data?.event) {
        setEventData((prev) => prev.map((e) => (e._id === id ? res.data.event : e)));
        setFilteredData((prev) => prev.map((e) => (e._id === id ? res.data.event : e)));
      }
      return res.data?.event;
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };


 const markEventAsPending = (id) => {
  setEventData((prev) =>
    prev.map((e) => (e._id === id ? { ...e, status: "SWAP_PENDING" } : e))
  );
 };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiRequest.delete(`/event/${id}`);
      setEventData((prev) => prev.filter((item) => item._id !== id));
      setFilteredData((prev) => prev.filter((item) => item._id !== id));
      toast.success("Event has been removed");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
      toast.error(err.response?.data?.message || "Delete failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    eventData,
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createEvent,
    updateEvent,
    handleDelete,
    sortOrder,
    markEventAsPending
  };
}
