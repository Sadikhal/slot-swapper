import { useState } from 'react';
import { Button } from './ui/Button'
import { Dialog, DialogContent, DialogTrigger } from './ui/Dialog';

const SlotConfirm = ({handleRequestSwap, slot, mySlotId, loading}) => {
   const [open, setOpen] = useState(false);

  return (
   <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex items-center justify-center">
          <Button
            disabled={!mySlotId || loading}
            className="bg-white text-black hover:text-lightGreen px-4 py-2 rounded-lg hover:bg-white/60 shadow-sm disabled:opacity-80 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Sending...' : 'Send Swap Request'}
          </Button>
      </DialogTrigger>
      <DialogContent className="bg-lamaWhite rounded-md max-h-[90vh]">
        <form className="p-4 flex flex-col gap-4 " onSubmit={() => handleRequestSwap(slot)}>
          <span className="text-center  font-medium">
            Are you sure you want to request this swap?
          </span>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max cursor-pointer self-center flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : 'swapping'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}


export default SlotConfirm