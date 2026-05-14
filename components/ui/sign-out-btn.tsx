"use client";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/auth-client";
import { DropdownMenuItem } from "./dropdown-menu";
export default  function SignOutBtn() {
    const router = useRouter();
    return (
         <DropdownMenuItem 
         onClick={async ()=> {
            const result = await signOut();
            if (result.data) {
                router.push('/sign-in');
            } else {
                alert('Failed to sign out');
            }
         }}>
                           Log Out
                         </DropdownMenuItem>
    )
}
