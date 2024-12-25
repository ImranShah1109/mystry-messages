import dbConnect from "@/lib/dbConnect"
import { getServerSession, User } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/options"
import mongoose from "mongoose"
import UserModel from "@/model/User"


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid
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
        const updatedResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )

        if (updatedResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: "Message not found or already deleted."
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message has been deleted successfully"
            },
            { status: 200 }
        )

    } catch (error) {
        console.log('Error in delete messages ', error)
        return Response.json(
            {
                success: false,
                message: 'Internal Server Error'
            },
            { status: 500 }
        )
    }
}