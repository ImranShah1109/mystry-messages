import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/options"
import mongoose from "mongoose"
import UserModel from "@/model/User"


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session?.user) {
        return Response.json(
            {
                success: false,
                message: 'Not Authenticated'
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.findOne({ _id: userId })
        if (user?.messages.length == 0) {
            return Response.json(
                {
                    success: true,
                    message: 'No message is available'
                },
                { status: 200 }
            )
        } else {
            const userWithMessages = await UserModel.aggregate([
                { $match: { _id: userId } },
                { $unwind: '$messages' },
                { $sort: { 'messages.createdAt': -1 } },
                { $group: { _id: '$_id', messages: { $push: '$messages' } } }
            ])
            console.log('come here 2', userWithMessages)
            return Response.json(
                {
                    success: true,
                    messages: userWithMessages[0].messages
                },
                { status: 200 }
            )
        }
    } catch (error) {
        console.log('Error in get messages ', error)
        return Response.json(
            {
                success: false,
                message: 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}