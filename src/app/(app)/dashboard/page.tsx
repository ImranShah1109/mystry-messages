"use client"

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const {toast} = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message)=>message._id !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch("acceptMessages")

  const fetchAcceptMessage = useCallback(
    async() => {
      setIsSwitchLoading(true)
      try {
        const response = await axios.get<ApiResponse>('/api/accept-messages')
        if (response.status == 200){
          setValue("acceptMessages",response.data.isAcceptingMessages)
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message ||
            "Failed to fetch message settings",
          variant: "destructive"
        })
      } finally {
        setIsSwitchLoading(false)
      }
    },
    [setValue],
  )

  const fetchMessages = useCallback(
    async (refresh:boolean = false) => {
      setIsLoading(true)
      setIsSwitchLoading(true)
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages')
        if (response.status == 200) {
          setMessages(response.data?.messages || [])
          if (refresh) {
            toast({
              title: "Refreshed Messages",
              description: "Showing latest messages.",
            })
          }
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message ||
            "Failed to fetch messages",
          variant: "destructive"
        })
      } finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
      }
    },
    [setIsLoading, setMessages],
  )
  
  useEffect(() => {
    if (!session || !session.user) return 
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])
  
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages',{
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages",!acceptMessages)
      toast({
        title: response.data.message
      })
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
        toast({
          title: "Error",
          description: axiosError.response?.data?.message ||
            "Failed to update message settings",
          variant: "destructive"
        })
    }
  }

  const [profileUrl, setProfileUrl] = useState('')
  useEffect(() => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    let url
    if (session?.user){
      const {username} = session?.user as User
      url = `${baseUrl}/u/${username}`
      setProfileUrl(url)
      localStorage.setItem('username',username || '')
    }else{
      const un = localStorage.getItem('username')
      url = `${baseUrl}/u/${un}`
      setProfileUrl(url)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "URL Copied",
      description: "Profile URL has been copied to clipboard"
    })
  }

  if (!session || !session.user) {
    return <div>Please Sigin</div>
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy your Unique Link 
        </h2>
        <div className="flex items-center">
          <input type="text" value={profileUrl} disabled className="input input-borderd w-full p-2 mr-2"/>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator/>

      <Button 
        className="mt-4"
        variant={"outline"}
        onClick={(e)=>{
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {isLoading 
          ? (<Loader2 className="h-4 w-4 animate-spin"/>) 
          : (<RefreshCcw className="h-4 w-4"/>)
      }
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0
          ? (messages.map((message,index)=>(
            <MessageCard 
              key={index}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          )))
          : (<p>No message to display</p>)
        }
      </div>

    </div>
  )
}

export default page