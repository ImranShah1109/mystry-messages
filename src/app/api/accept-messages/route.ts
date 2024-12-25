import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";


export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if (!session || !session?.user) {
        return Response.json(
            {
                success:false,
                message:'Not Authenticated'
            },
            {status:401}
        )
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessages:acceptMessages},{new:true})
        if (!updatedUser) {
            return Response.json(
                {
                    success:false,
                    message:'Failed to update user status of accept messages'
                },
                {status:401}
            )
        }

        return Response.json(
            {
                success:true,
                message:'Message acceptance status updated successfully',
                updatedUser
            },
            {status:200}
        )
    } catch (error) {
        console.log('Failed to update user status of accept messages ',error)
        return Response.json(
            {
                success:false,
                message:'Failed to update user status of accept messages'
            },
            {status:500}
        )
    }
}


export async function GET(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if (!session || !session?.user) {
        return Response.json(
            {
                success:false,
                message:'Not Authenticated'
            },
            {status:401}
        )
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)
        
        if (!foundUser) {
            return Response.json(
                {
                    success:false,
                    message:'User not found'
                },
                {status:404}
            )
        }

        return Response.json(
            {
                success:false,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            {status:200}
        )

    } catch (error) {
        console.log('Error is getting message acceptance status ',error)
        return Response.json(
            {
                success:false,
                message:'Error is getting message acceptance status'
            },
            {status:500}
        )
    }
}