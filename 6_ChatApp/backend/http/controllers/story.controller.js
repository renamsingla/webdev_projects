import Story from "../../database/models/storyModel.js";

export async function addStory(req,res,next) {
    try{
        if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
        }
        const{userId}= req.body;
        // console.log(req.file)
        // console.log(req.body);

        let story=await Story.create({
            userId:userId.toString(),
            image: req.file.buffer,
            contentType: req.file.mimetype
        })
        const base64 = `data:${story.contentType};base64,${story.image.toString("base64")}`;
        res.status(200).json({story, base64})
    }catch(error){
        console.lof(error);
        res.status(400).json({error})
    }
}

export async function getStory(req,res,next) {
    try{
        const userId= req.user.id.toString();
        const stories= await Story.find({
            userId
        })
        const storyArray= stories.map(story=>({
            _id:story._id,
            file: `data:${story.contentType};base64,${story.image.toString("base64")}`,
            create: story.createdAt,
            expire: story.expiresAt
        }))
        res.status(200).json({storyArray});
    }catch(error){
        console.log(error)
        res.status(400).json({error})
    }
} 

export async function delStory(req,res,next) {
    try{
        const {id}= req.body;
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const data= await Story.deleteOne({
            _id:id
        })
        if (data.deletedCount === 0) {
            return res.status(404).json({ message: "Story not found" });
        }

        console.log("Deleted story:", id);
        return res.status(200).json({ message: "Story deleted successfully", id });
    }catch(error){
        res.status(400).json({error}) 
    }
}
export async function getUserStory(req,res,next){
    try{
        const {id}=req.query;
        console.log(id);
        if (!id) {
            return res.status(400).json({ error: "Story ID is required" });
        }
        const stories= await Story.find({
            userId:id.toString()
        })
        const storyArray= stories.map(story=>({
            _id:story._id,
            file: `data:${story.contentType};base64,${story.image.toString("base64")}`
        }))
        res.status(200).json({storyArray});
    }catch(error){
        console.log(error)
        res.status(400).json({error}) 
    }
}