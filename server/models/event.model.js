import mongoose from "mongoose";

  const eventSchema = new mongoose.Schema({
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,  
    },
    title: {
      type: String,
      required: true, 
    },
    desc: {
      type: String,
      required: true,
    },
    
    startingTime : {
      type : String,
      required : true
    },
    endingTime : {
      type : String,
      required : true
    },
     status: {
    type: String,
    enum: ['BUSY', 'SWAPPABLE', 'SWAP_PENDING'],
    default: 'BUSY'
  },

},
  {timestamps : true}
)

export default mongoose.model("Event", eventSchema);