"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Message } from "@/model/User"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import dayjs from "dayjs"
  
type MessageCardProps = {
    message: Message
    onMessageDelete: (messageId: string | any) => void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {
    const {toast} = useToast()
    const messageDate = new Date(message.createdAt)
    const formattedDate = dayjs(messageDate).format('ddd DD MMM, hh:mm A')
    const handleDeleteConfirm = async () => {
        const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title: response.data.message
        })
        onMessageDelete(message._id)
    }

  return (
    <Card >
        <CardHeader className="relative">
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="absolute w-7 h-7 right-1 -top-1" variant="destructive"><X className="w-5 h-5"/></Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this
                        message and remove your data from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <CardDescription>{formattedDate}</CardDescription>
        </CardHeader>
        {/* <CardContent>
        </CardContent> */}
    </Card>
  )
}

export default MessageCard