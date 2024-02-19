import { cn } from "@/lib/utils";
import { PersonalInformation } from "@prisma/client";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import CheckoutCard from "./checkout-card";

const AddressSection = ({
	personalInformations,
}: { personalInformations: PersonalInformation | null }) => {
	if (personalInformations) {
		return (
			<div className="flex flex-col items-start justify-between gap-4 md:flex-row ">
				<CheckoutCard
					icon={<MapPin />}
					firstLine={`${personalInformations.firstName} ${personalInformations.lastName}`}
					secondLine={`${personalInformations.addressLine1}, ${personalInformations.city} ${personalInformations.postalCode}, ${personalInformations.country}, ${personalInformations.phoneNumber}`}
				/>
				<Link
					href="/account/personal-informations"
					className={cn(buttonVariants({ variant: "secondary" }))}
				>
					Change
				</Link>
			</div>
		);
		// biome-ignore lint/style/noUselessElse:
	} else {
		return (
			<Link href="/account/personal-informations">Add shipping address</Link>
		);
	}
};

export default AddressSection;
