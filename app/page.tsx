import LoginCard from "@/components/LoginCard";
import { Card } from "@/components/ui/card";


export default function Home() {

  
  return (
    <section>
        <div className="fade"/>
                     <main className="flex min-h-screen flex-col items-center justify-center px-4"> 

            <Card className="w-full max-w-md border-zinc-800 bg-zinc-900/40 backdrop-blur-[1.5px] shadow-md">
            <LoginCard/>
            </Card>
            </main>
    </section>
  )
}
