
import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import toast from "react-hot-toast";


export default function useSlotRequestData() {
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [swapRequests, setSwapRequests] = useState({ incoming: [], outgoing: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getSwappableSlots = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get("/swap-request");
      setSwappableSlots(res.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSwappableSlots();
  }, []);

  const createSwapRequest = async (payload) => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/swap-request", payload);
      if (res.data) {
        setSwappableSlots((prev) =>
          prev.filter(
            (slot) =>
              slot._id !== res.data.mySlot._id &&
              slot._id !== res.data.theirSlot._id
          )
        );
      }
      toast.success("Swap request sent successfully");
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create swap request");
      toast.error(err.response?.data?.message || "Failed to create swap request");
    } finally {
      setLoading(false);
    }
  };

  const getSwapRequests = async () => {
    setLoading(true);
    try {
      const res = await apiRequest.get("/swap-request/req-slots");
      setSwapRequests({
        incoming: res.data?.incoming || [],
        outgoing: res.data?.outgoing || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch swap requests");
    } finally {
      setLoading(false);
    }
  };

  const respondToSwapRequest = async (requestId, accept) => {
    setLoading(true);
    try {
      const res = await apiRequest.post(`/swap-request/${requestId}`, { accept });
      toast.success(res.data?.message || "Response recorded");
      await getSwapRequests();
      await getSwappableSlots(); 
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to respond to swap request");
      toast.error(err.response?.data?.message || "Failed to respond to swap request");
    } finally {
      setLoading(false);
    }
  };


  return {
    swappableSlots,
    swapRequests,
    error,
    loading,
    getSwappableSlots,
    createSwapRequest,
    getSwapRequests,
    respondToSwapRequest,
  };
}
