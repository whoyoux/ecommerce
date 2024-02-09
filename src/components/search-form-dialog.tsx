"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { GetURLWithStates } from "@/lib/utils";

const SearchFormDialog = ({ children }: { children: React.ReactNode }) => {
	const [isOpenModal, setModalOpen] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();
	return (
		<Dialog open={isOpenModal} onOpenChange={setModalOpen}>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="mb-2">Search product</DialogTitle>

					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.currentTarget);
							const searchQuery = formData.get("query") as string;
							if (searchQuery.trim() === "") return;

							const category = (searchParams.get("category") || "") as string;
							const rating = (searchParams.get("rating") || "") as string;
							const minPrice = (searchParams.get("min_price") || "") as string;
							const maxPrice = (searchParams.get("max_price") || "") as string;

							router.push(
								`${GetURLWithStates({
									query: searchQuery,
									category,
									rating,
									minPrice,
									maxPrice,
								})}`,
							);

							setModalOpen(false);
						}}
					>
						<Input placeholder="Search..." name="query" />
						<Button type="submit">Search</Button>
					</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default SearchFormDialog;
