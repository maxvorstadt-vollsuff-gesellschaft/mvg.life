import Image from "next/image";
import Countdown from "@/app/Countdown";
import image1 from '../public/image1.jpg'


export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                <h1 className="font-bold text-4xl text-amber-800">MVG</h1>
                <p className="text-gray-500 mb-8">Maxvorstadt Gang</p>
                <p className="mb-8">Heute Saufen bei Jonas auf der Terasse - Start 8 Uhr</p>

                <Countdown date={new Date("2024-06-08T20:00:00")}/>
                <p className="text-center m-2 mb-8 text-2xl font-bold text-amber-800">Attacke!</p>

                <Image
                    src={image1}
                    alt="Picture of the MVG Gang"
                    className="mb-8"
                    // width={500} automatically provided
                    // height={500} automatically provided
                    // blurDataURL="data:..." automatically provided
                    // placeholder="blur" // Optional blur-up while loading
                />

                <ul className="font-mono text-amber-800">
                    <li>Jonas</li>
                    <li>Jonny (Schwabe)</li>
                    <li>Linus</li>
                    <li>Philipp</li>
                    <li>Tim</li>
                    <li>Tom</li>
                </ul>

            </div>
        </main>
    );
}
