import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    firstName: z.string().min(3, { message: "First name is required" }),
    lastName: z.string().min(3, { message: "Last name is required" }),
    address: z.string().min(10, { message: "Address is required" }),
    email: z
        .string()
        .min(1, { message: "This field has to be filled." })
        .email("This is not a valid email."),
    password: z
        .string()
        .min(1, { message: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters long" }),
    phoneNo: z
        .string()
        .min(10)
        .max(10, { message: "Phone number must be exactly 10 digits" }),
})

const Signup = () => {
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            address: "",
            email: "",
            password: "",
            phoneNo: "",
        },
    })

    async function onSubmit(values) {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/user/register`,
                values,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            )

            if (response?.data?.success) {
                navigate("/")
                toast.success(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message)
        }
    }
    return (
        <div className="w-full h-screen flex">
            {/* Left Pane - Sidebar */}
            <div className="w-[45%] bg-gray-900 text-white flex flex-col items-center justify-center px-8">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold text-emerald-400">
                        Scholarly Library
                    </h1>
                    <p className="text-sm text-gray-300">
                        Your smart solution for modern library management.
                    </p>
                    <p className="text-sm text-gray-400">
                        Already have an account?
                    </p>
                    <Button
                        className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                        asChild
                    >
                        <Link to={"/login"}>Login</Link>
                    </Button>
                </div>
            </div>
            {/* Right Pane - Form */}
            <div className="w-[55%] flex items-center justify-center p-8 bg-gray-100">
                <Card className="p-6 sm:p-8 w-full max-w-md shadow-xl">
                    <h2 className="text-xl font-semibold text-emerald-800 mb-6">
                        Signup
                    </h2>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            {[
                                { name: "firstName", label: "First Name", type: "text", placeholder: "John" },
                                { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
                                { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
                                { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
                                { name: "phoneNo", label: "Phone No.", type: "number", placeholder: "9999999999" },
                                { name: "address", label: "Address", type: "text", placeholder: "123, Example St, City" },
                            ].map((fieldData) => (
                                <FormField
                                    key={fieldData.name}
                                    control={form.control}
                                    name={fieldData.name}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldData.label}</FormLabel>
                                            <FormControl>
                                                <Input type={fieldData.type} placeholder={fieldData.placeholder} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            <div className="w-full flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="bg-emerald-600 hover:bg-emerald-700 transition-colors"
                                >
                                    {form.formState.isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default Signup
