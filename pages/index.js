import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

function Index(props) {
    return (
        <div className='flex overflow-hidden'>
        <Link href="/minter">
            <Image src="/logo.svg" height="72" width="72" alt="tilata" className="invert pt-2 h-full left z-10" />
        </Link>
        <Link href="/minter">
            <button className='absolute mt-4 right-4 bg-black text-white p-4 flex mx-auto rounded-lg hover:bg-white hover:text-black border-black z-10'>Mint Global ID</button>
        </Link>        

        </div>
    );
}

export default Index;