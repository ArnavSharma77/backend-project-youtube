import mongoose , {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    //technically both are channel and user
    //not an array (how would it work)
    subscriber : {
        type : Schema.Types.ObjectId, // one who is subscribing
        ref : "User"
    },
    channel : {
        type : Schema.Types.ObjectId, // one to whom subscriber is subscribing
        ref : "User"
    }
},{timestamps : true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)