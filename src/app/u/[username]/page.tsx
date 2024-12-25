"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { messageSchema } from "@/schemas/messageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z  from "zod"


const page = () => {
  const params = useParams()
  const {username} = params

  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
        const response = await axios.post<ApiResponse>('/api/send-message',{
          username:username,
          content:data.content
        })
        if (response.status == 200) {
            toast({
                title:'Success',
                description: response.data.message
            })
        }
        else {
          toast({
            title:'Error',
            description: response.data.message
          })
        }

    } catch (error) {
        console.error("Error in send message ",error)
        const axiosError = error as AxiosError<ApiResponse>
        let errorMessage = axiosError.response?.data?.message
        toast({
            title:'Error',
            description: errorMessage,
            variant: "destructive"
        })
    } finally{
        setIsSubmitting(false)
    }
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 text-center">Public Profile Link</h1>
      <div className="mb-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="content"
              control={form.control}
              render={({field}) => (
                <FormItem>
                  <FormLabel className="font-semibold">Send Anonymous Message to @{username}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your anonymous message here" {...field}  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full text-center">
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> please wait</>) : ('Send it')
                }
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator/>
      <div className="mb-4 mt-4 flex flex-col items-center gap-4">
        <p>Get Your Message Board</p>
        <Link href={"../sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  )
}

export default page