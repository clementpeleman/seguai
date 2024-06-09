import Link from 'next/link';

export default function NavBar() {
    return (
        <nav className=" backdrop-filter backdrop-blur-lg text-indigo-500 p-4 shadow-lg fixed w-full z-10">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl ml-[8vw] font-bold">segu-ai</h1>
                <div className="flex space-x-4">
                    {/* <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/about" className="hover:underline">About</Link>
                    <Link href="/contact" className="hover:underline">Contact</Link> */}
                </div>
                <button className="border-2 backdrop-filter backdrop-blur-lg hover:bg-opacity-30 text-indigo-600 font-bold py-3 px-6 rounded-lg">Login</button>
            </div>
        </nav>
    );
}
