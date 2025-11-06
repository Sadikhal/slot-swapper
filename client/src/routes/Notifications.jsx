import React, { useEffect } from "react";
import useSlotRequestData from "../hooks/useSlotRequestData";
import { Loader } from "../components/ui/Loaders";
import { Button } from "../components/ui/Button";
import { cn, formatDateTime } from "../lib/utils";

const Notifications = () => {
  const {
    swapRequests,
    getSwapRequests,
    respondToSwapRequest,
    loading,
  } = useSlotRequestData();

  const { incoming, outgoing } = swapRequests;

  useEffect(() => {
    getSwapRequests();
  }, []);

  const handleResponse = async (requestId, accept) => {
    await respondToSwapRequest(requestId, accept);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="mx-auto px-2 w-full h-full">
      <div className="bg-lamaWhite px-2 md:px-6 py-4">
        <h1 className="text-xl font-bold mb-4">Notifications</h1>

        {/* Incoming Requests */}
        <section>
          <h2 className="text-lg md:text-2xl text-center font-semibold mb-3 text-[#0a475a]">
            Incoming Requests
          </h2>

          {incoming.length === 0 ? (
            <p className="text-gray-600">No incoming requests.</p>
          ) : (
            incoming.map((request) => (
              <div
                key={request._id}
                className="border border-slate-50 p-4 rounded-lg mb-3 shadow-sm"
              >
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-bold capitalize">
                    {request.requester.name}
                  </span>{" "}
                  wants to swap their slot{" "}
                  <span className="text-warning font-bold">
                    "{request.mySlot.title}"
                  </span>{" "}
                  ({formatDateTime(request.mySlot.startingTime)}) for your slot{" "}
                  <span className="text-warning font-bold">
                    "{request.theirSlot.title}"
                  </span>{" "}
                  ({formatDateTime(request.theirSlot.startingTime)})
                </p>

                {request.status === "PENDING" ? (
                  <div className="flex gap-3 mt-3">
                    <Button
                      onClick={() => handleResponse(request._id, true)}
                      className="bg-textBlue hover:bg-textBlue/45 text-white px-4 py-1 rounded-lg cursor-pointer font-semibold text-sm h-9"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleResponse(request._id, false)}
                      className="bg-error hover:bg-red-700 text-lamaWhite font-poppins px-4 py-1 cursor-pointer text-sm h-9 rounded-lg"
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm font-medium mt-2">
                    Status:{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        request.status === "ACCEPTED"
                          ? "text-lightGreen"
                          : "text-error"
                      )}
                    >
                      {request.status}
                    </span>
                  </p>
                )}
              </div>
            ))
          )}
        </section>

        {/* Outgoing Requests */}
        <section>
          <h2 className="text-lg md:text-2xl text-center font-semibold mt-8 text-[#0a475a]">
            Outgoing Requests
          </h2>

          {outgoing.length === 0 ? (
            <p className="text-gray-600">No outgoing requests.</p>
          ) : (
            <div className="flex flex-col gap-2 pt-6">
              {outgoing.map((request) => (
                <div
                  key={request._id}
                  className="border border-slate-50 p-4 rounded-lg mb-1 shadow-sm"
                >
                  <p className="text-sm text-gray-700 mb-2">
                    You requested to swap your slot{" "}
                    <span className="text-warning font-bold">
                      "{request.mySlot.title}"
                    </span>{" "}
                    ({formatDateTime(request.mySlot.startingTime)}) with{" "}
                    <span className="font-bold capitalize">
                      {request.responder.name}'s
                    </span>{" "}
                    slot{" "}
                    <span className="text-warning font-bold">
                      "{request.theirSlot.title}"
                    </span>{" "}
                    ({formatDateTime(request.theirSlot.startingTime)})
                  </p>

                  <p className="text-sm font-medium mt-2">
                    Status:{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        request.status === "ACCEPTED"
                          ? "text-lightGreen"
                          : "text-error"
                      )}
                    >
                      {request.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Notifications;
