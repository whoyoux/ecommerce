import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

const AccountPage = async () => {
	const session = await auth();
	if (!session) return redirect("/login");
	return (
		<div>
			User is logged in
			<form
				action={async () => {
					"use server";
					await signOut({
						redirectTo: "/",
					});
				}}
			>
				<Button>Sign out</Button>
			</form>
		</div>
	);
};

export default AccountPage;
