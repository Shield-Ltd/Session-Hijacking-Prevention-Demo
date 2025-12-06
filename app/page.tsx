import Link from "next/link"
import {Button} from "@/components/ui/button";

export default function Home(){
  return(
    <div>
      <Link href="/login">
        <Button variant="ghost" size="sm" className="rounded-full px-4">
          Login
        </Button>
      </Link>
      <Link href="/signup">
        <Button variant="ghost" size="sm" className="rounded-full px-4">
          Signup
        </Button>
      </Link>
    </div>
  )
}