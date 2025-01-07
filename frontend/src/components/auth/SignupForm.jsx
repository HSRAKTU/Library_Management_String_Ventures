import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from 'lucide-react'

import { signupSchema } from "@/schemas/signupSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { setCredentials } from "@/lib/redux/features/authSlice"

const API_URL = "http://your-api-url.com" // Replace with your actual API URL

export default function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
    },
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`${API_URL}/api/v1/user/register`, data, {
        withCredentials: true,
      })

      toast({
        title: "Success!",
        description: response.data.message,
      })

      dispatch(setCredentials(response.data.data))
      navigate("/login")
    } catch (error) {
      console.error("Error in signup:", error)
      toast({
        title: "Signup failed",
        description: "An error occurred during signup. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg bg-card">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Join Library Management</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Create a password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

