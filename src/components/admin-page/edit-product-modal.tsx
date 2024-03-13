"use client";

import { useEffect, useState } from "react";

import { editProduct } from "@/actions/admin/product";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@prisma/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Edit } from "lucide-react";

const EditProductModal = ({ product }: { product: Product }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [errors, setError] = useState<string>("");

	const submit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const response = await editProduct(formData);
		if (response.success) {
			setError("");
			setIsOpen(false);
		} else if (response.success === false) {
			setError(response.message ?? "An error occurred. Please try again.");
		}
	};

	return (
		<Dialog onOpenChange={setIsOpen} open={isOpen}>
			<DialogTrigger asChild>
				<Button size="icon" variant="secondary">
					<Edit />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<form onSubmit={submit}>
					<DialogHeader>
						<DialogTitle>Edit product</DialogTitle>
						{errors && (
							<DialogDescription className="text-red-500">
								{errors}
							</DialogDescription>
						)}
					</DialogHeader>
					<div className="flex flex-col gap-4 py-4">
						<input type="hidden" defaultValue={product.id} name="id" />
						<div className="flex flex-col gap-2">
							<Label htmlFor="label">Label</Label>
							<Input
								id="label"
								name="label"
								type="text"
								defaultValue={product.label}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="description">Description</Label>
							<Textarea
								id="description"
								name="description"
								defaultValue={product.description}
								rows={8}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="price">Price</Label>
							<Input
								id="price"
								name="price"
								type="number"
								defaultValue={product.price.toString()}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit">Save changes</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default EditProductModal;
