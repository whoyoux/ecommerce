import CreateAccountForm from "@/components/create-account-page/create-account-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const CreateAccountPage = async () => {
	return (
		<div className="max-w-lg mx-auto flex flex-col gap-10 pt-10">
			<h1 className="text-2xl font-bold text-center">Create new account</h1>
			<CreateAccountForm />
			<section className="text-center flex flex-col gap-4">
				<h3 className="text-xl font-semibold">Already have an account?</h3>
				<Link
					href="/login"
					className={cn(buttonVariants({ variant: "secondary" }))}
				>
					Login
				</Link>
			</section>
		</div>
	);
};

export default CreateAccountPage;
