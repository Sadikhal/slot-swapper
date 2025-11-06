import { useState } from 'react';
import useSlotRequestData from "../hooks/useSlotRequestData";
import useEventData from '../hooks/useEventData';
import { formatDateTime } from '../lib/utils';
import { Loader } from '../components/ui/Loaders';
import { Button } from '../components/ui/Button';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectGroup,
} from '../components/ui/Select';
import { ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import SlotConfirm from '../components/SlotConfirm';

const Marketplace = () => {
  const {
    swappableSlots,
    loading,
    createSwapRequest,
  } = useSlotRequestData();

  const { eventData, markEventAsPending } = useEventData();

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [mySlotId, setMySlotId] = useState('');

  const mySwappableSlots = eventData.filter(e => e.status === 'SWAPPABLE');

  const handleRequestSwap = async (theirSlotId) => {
    if (!mySlotId) {
      toast('Please select one of your slots to offer.');
      return;
    }
    try {
      await createSwapRequest({ mySlotId, theirSlotId })
      markEventAsPending(mySlotId);
      setSelectedSlot(null);
      setMySlotId('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full px-2 py-2 max-w-full">
      <div className='bg-lamaWhite w-full px-2 rounded-sm'>
        <div className="flex md:justify-between items-center pb-6 py-2 flex-col md:flex-row w-full">
          <h1 className="text-xl font-semibold">Slot Marketplace</h1>
          <div className="text-sm text-lightGreen font-medium">
            {swappableSlots.length} available slots
          </div>
        </div>

        <div className="rounded-lg shadow-sm overflow-hidden bg-lamaWhite">
          <div className="px-6 md:py-4 border-b border-gray-200">
            <h2 className="md:text-lg text-base font-medium ">Available Slots from Other Users</h2>
          </div>
          {loading ? (
            <div className="px-6 py-8 text-center text-gray-500">
              <Loader />
            </div>
          ) : swappableSlots.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No swappable slots available from other users at the moment.
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {swappableSlots.map((slot) => (
                <div key={slot._id} className="px-6 py-2 border-b border-[#ded9d97e]">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-2 md:gap-0 ">
                    <div className="flex-1">
                      <h3 className="md:text-lg text-base font-medium text-gray-900">{slot.title}</h3>
                      <div className="flex flex-col lg:flex-row lg:items-center space-x-4 mt-2 text-sm text-gray-700">
                        <span>Start:
                          <span className='px-2 text-warning'>{formatDateTime(slot.startingTime)}</span>
                        </span>
                        <span>End:
                          <span className='px-2 text-warning'>{formatDateTime(slot.endingTime)}</span>
                        </span>
                        <span className="text-lamaTeal font-poppins capitalize font-medium">By: {slot?.userId?.name}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedSlot(selectedSlot === slot._id ? null : slot._id)}
                      className="bg-textBlue text-white px-2 py-1 min-w-32 rounded-lg hover:bg-textBlue/70 transition-colors md:text-sm text-xs"
                    >
                      {selectedSlot === slot._id ? 'Cancel' : 'Request Swap'}
                    </Button>
                  </div>

                  {selectedSlot === slot._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Select your slot to offer:</h4>
                      {mySwappableSlots.length === 0 ? (
                        <p className="text-error mb-3">
                          You don't have any swappable slots. Mark some of your events as swappable first.
                        </p>
                      ) : (
                        <Select
                          value={mySlotId || undefined}
                          onValueChange={(val) => setMySlotId(String(val || ''))} 
                        >
                          <SelectTrigger className="border-gray-200 border rounded-md text-sm bg-white w-full flex items-center justify-between p-2 shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                            <SelectValue placeholder="Choose your slot..." />
                            <ChevronDown className="h-4 w-4" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectGroup>
                              {mySwappableSlots.map((mySlot) => (
                                <SelectItem key={mySlot._id} value={mySlot._id}>
                                  {mySlot.title} ({formatDateTime(mySlot.startingTime)})
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}

                      <div className="flex flex-col md:flex-row gap-2 md:gap-0 justify-end space-x-3 pt-3">
                        <Button
                          onClick={() => {
                            setSelectedSlot(null);
                            setMySlotId('');
                          }}
                          className="px-4 py-2 hover:text-gray-800 bg-warning transition-colors text-lamaWhite"
                        >
                          Cancel
                        </Button>
                        
                        <SlotConfirm handleRequestSwap={handleRequestSwap} loading={loading} slot={slot._id} mySlotId={mySlotId} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
