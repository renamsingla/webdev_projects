import { PrismaClient } from "@prisma/client";
let prisma= new PrismaClient();

export async function getOrCreateConversation(receiverId, senderId){
    const[a,b]=[receiverId,senderId].sort(); //to get a and b sorted and then find it in DC table
    try{

        let convo= await prisma.directConversation.findUnique({
            where:{
                userAId_userBId:{
                    userAId:a,
                    userBId:b
                }
            } 
        })

        if(!convo){
            convo= await prisma.directConversation.create({
                data:{
                    userAId:a,
                    userBId:b
                }
            })
        }

        return convo;

    }catch(error){
        console.log(error);
        throw error;
    }
}