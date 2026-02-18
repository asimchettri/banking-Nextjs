"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { Control } from "react-hook-form";
import { authFormSchema } from "@/lib/utils";
import CustomInputs from "./CustomInputs";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { getLoggedInUser, signIn, signUp } from "@/lib/actions/user.actions";


const AuthForm =  ({ type }: { type: string }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(false);
  


  const formScheama = authFormSchema(type);

  const form = useForm<z.infer<typeof formScheama>>({
    resolver: zodResolver(formScheama),
    defaultValues: {
     email: "",
    password: "",
    firstName: "",
    lastName: "",
    address1: "",
    city: "",
    state: "",
    postalcode: "",
    dateofbirth: "",
    ssn: "",
    },
  });

   const onSubmit = async (data: z.infer<typeof formScheama>) =>{
    setLoading(true);

    try{

     if(type === 'sign-up'){
      const newUser = await signUp(data);
      setUser(newUser);
     }

     if(type ==='sign-in'){
      const response = await signIn({
        email: data.email,
        password: data.password
      })

      if(response) router.push('/')

     }
    }catch(error){
      console.log(error);
    }finally{
      setLoading(false);
    }
   
    setLoading(false);
  }

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="cursor-pointer items-center gap-1 ">
          <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt="Horizon logo"
          />
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>

        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user
              ? "Li nked Account"
              : type === "sign-in"
                ? "sign-in"
                : "sign-up"}
            <p className="text-16 font-normal text-gray-600">
              {user
                ? "Link your account to access all features"
                : "please  details"}
            </p>
          </h1>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInputs
                      control={form.control}
                      name="firstName"
                      label="First Name"
                      placeholder="FirstName"
                    />
                    <CustomInputs
                      control={form.control}
                      name="lastName"
                      label="Last Name"
                      placeholder=" LastName"
                    />
                  </div>
                  <div className="flex gap -4">
                    <CustomInputs
                      control={form.control}
                      name="postalcode"
                      label="Postal Code"
                      placeholder="   Postal Code"
                    />
                    <CustomInputs
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="   State"
                    />
                  </div>
                  <div className="flex gap -4">
                    <CustomInputs
                      control={form.control}
                      name="dateofbirth"
                      label="Date of Birth"
                      placeholder='yyyy-mm-dd'
                    />
                    <CustomInputs
                      control={form.control}
                      name="ssn"
                      label="SSN"
                      placeholder="  SSN"
                    />
                  </div>

                  <CustomInputs
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="  specific Address"
                  />
                  <CustomInputs
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="  City"
                  />
                </>
              )}

              <CustomInputs
                control={form.control}
                name="email"
                label="Email"
                placeholder=" Email"
              />
              <CustomInputs
                control={form.control}
                name="password"
                label="Password"
                placeholder=" Password"
              />

              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "sign-In"
                  ) : (
                    "sign-Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <footer className="flex justify-center gap-1 ">
            <p className="text-14 font-normal text-grey-600">
              {type === "sign-in"
                ? "dont have an account"
                : "already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-up" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;
