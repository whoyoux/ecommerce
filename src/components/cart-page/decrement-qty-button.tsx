"use client";
import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import { useFormStatus } from "react-dom";

const DecrementQtyButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button
			size="icon"
			variant="secondary"
			className="rounded-full h-8 w-8"
			disabled={pending}
			aria-disabled={pending}
		>
			<Minus size={16} />
		</Button>
	);
};

export default DecrementQtyButton;
