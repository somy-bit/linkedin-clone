import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { Briefcase, HomeIcon, MessagesSquare, SearchIcon, UserIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

function Header() {
    return (
        <div className='flex p-2 max-w-6xl mx-auto items-center'>
            <Image
                className='rounded-lg'
                src='https://links.papareact.com/b3z'
                width={40}
                height={40}
                alt='logo'
            />

            <div className='flex-1'>
                <form className='flex items-center space-x-1
             bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96'>
                    <SearchIcon className='h-4 text-gray-400' />
                    <input
                        placeholder='Search..'
                        className='bg-transparent outline-none flex-1'
                        type='text'
                    />
                </form>
            </div>

            <div className='flex space-x-4 px-6 items-center'>
                <Link href='/' className='icon'>
                    <HomeIcon className='h-5' />
                    <p>Home</p>
                </Link>
                <Link href='/' className='icon hidden md:flex '>
                    <UsersIcon className='h-5' />
                    <p>Networks</p>
                </Link>
                <Link href='/' className='icon hidden md:flex '>
                    <Briefcase className='h-5' />
                    <p>Jobs</p>
                </Link>
                <Link href='/' className='icon'>
                    <MessagesSquare className='h-5' />
                    <p>Messaging</p>
                </Link>

                <SignedIn>
                    <UserButton />
                </SignedIn>

                <SignedOut>
                    <Button asChild variant='secondary'>
                        <SignInButton />
                    </Button>
                </SignedOut>
            </div>

        </div>
    )
}

export default Header