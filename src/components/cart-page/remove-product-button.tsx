"use client";
import { removeFromCart } from "@/actions/cart";
import { Button } from "@/components/ui/button";

import { Trash2 } from "lucide-react";

import { toast } from "sonner";

const RemoveProductButton = ({ productId }: { productId: string }) => {
	const remove = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = await removeFromCart(productId);
		if (result.success) {
			toast.success(result.message);
		} else {
			toast.error(result.message);
		}
	};

	return (
		<form onSubmit={(e) => remove(e)}>
			<Button variant="destructive" size="icon">
				<Trash2 />
			</Button>
		</form>
	);
};

export default RemoveProductButton;
