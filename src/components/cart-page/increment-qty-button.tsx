"use client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFormStatus } from "react-dom";

const IncrementQtyButton = () => {
	const { pending } = useFormStatus();
	return (
		<Button
			size="icon"
			variant="secondary"
			className="rounded-full h-8 w-8"
			disabled={pending}
			aria-disabled={pending}
		>
			<Plus size={16} />
		</Button>
	);
};

export default IncrementQtyButton;
