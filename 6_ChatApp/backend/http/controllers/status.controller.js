import Status from "../../database/models/statusModel.js";


export async function changeStatus(req,res,next) {
    try{
        const {newStatus, userId}= req.body;
        const status=await Status.findOneAndUpdate(
            {userId: userId.toString()},
            {status:newStatus},
            { new: true }
        ).lean(); 
        console.log(status)
        res.status(200).json({status});
    }catch(error){
        console.log(error);
    }

}

export async function getStatus(req,res,next) {
    try{
        const userId= req.user.id.toString();
        const status= await Status.findOne({
            userId:userId
        })
        // console.log(status);
        res.status(200).json({status})
    }catch(error){
        console.log(error)
    }
} 

export async function getUserStatus(req,res,next) {
    try{
        const {id}= req.query;
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const status= await Status.findOne({
            userId:id.toString()
        })
        // console.log(status);
        res.status(200).json({status})
    }catch(error){
        console.log(error)
    }
}

// export async function deleteStaus(req,res,next) {
    
// }