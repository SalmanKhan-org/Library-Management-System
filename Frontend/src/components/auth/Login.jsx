import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email("Invalid email address."),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(8, { message: "Password must be at least 8 characters long." }),
});

const Login = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="w-full h-screen flex bg-gray-100">
      {/* Sidebar Left */}
      <div className="w-[45%] bg-gray-900 text-white flex flex-col items-center justify-center px-8">
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-emerald-400">
            Scholarly Library
          </h1>
          <p className="text-sm text-gray-300">
            Your smart solution for modern library management.
          </p>
          <p className="text-sm text-gray-400">
            Don’t have an account?
          </p>
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
            asChild
          >
            <Link to={"/signup"}>Create an Account</Link>
          </Button>
        </div>
      </div>

      {/* Login Right */}
      <div className="w-[55%] flex items-center justify-center px-6">
        <Card className="w-full max-w-md shadow-lg border border-gray-200 p-8 bg-white">
          <h2 className="text-xl font-semibold text-emerald-800 mb-6">
            Login
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        {...field}
                      />
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
                    <FormLabel className="text-sm text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-end">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Log In
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
