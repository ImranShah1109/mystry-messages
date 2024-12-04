"use client"

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {

    const {data: session} = useSession()
    const user: User = session?.user as User

  return (
    <nav className="p-4 md:p-6 shadow-md">
        <div className="cotainer mx-auto flex flex-col md:flex-row justify-between items-center">
            <a className="text-xl font-bold mb-4 md:mb-0" href="#">Mystry Messages</a>
            {
                session ? (
                    <>
                        <span className="mr-4">Welcome {user?.username || user?.email}</span>
                        <Button className="w-full md:w-auto" onClick={() => signOut()}>Log out</Button>
                    </>
                ) : (
                    <div className="flex gap-3">
                        <Link href={"/sign-in"}>
                            <Button className="w-full md:w-auto">Sign in</Button>
                        </Link>
                        <Link href={"/sign-up"}>
                            <Button className="w-full md:w-auto">Sign up</Button>
                        </Link>
                    </div>
                )
            }
        </div>
    </nav>
  )
}

export default Navbar