"use client";
import Image from "next/image";
import { useState } from "react";

type ProductImagesProps = {
	images: string[];
	mainImageBase64: string;
};

const ProductImages = ({ images, mainImageBase64 }: ProductImagesProps) => {
	const [selectedImage, setSelectedImage] = useState(0);
	return (
		<div className="flex flex-col max-w-md gap-4 mx-auto md:ml-0">
			<div className="w-full relative aspect-square">
				<Image
					src={images[selectedImage]}
					alt="Product photo"
					fill
					className="rounded-lg"
					priority
					placeholder="blur"
					blurDataURL={mainImageBase64}
				/>
			</div>
			<div className="flex items-center justify-between">
				{images.map((imageUrl, idx) => (
					<div key={imageUrl} className="relative overflow-hidden rounded-lg">
						<Image
							src={imageUrl}
							alt="Product image"
							width={100}
							height={100}
							className="rounded-lg cursor-pointer object-cover hover:scale-125 duration-200"
							onClick={() => setSelectedImage(idx)}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductImages;
