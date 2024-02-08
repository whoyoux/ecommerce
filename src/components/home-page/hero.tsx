import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";

const FEATURED_TITLE = "Sundress Season";
const FEATURED_DESCRIPTION =
	"Get ready for the warm weather with our latest collection of sundresses.";

import featuredImage from "@/assets/images/item.jpg";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Hero = () => {
	return (
		<section>
			<div className="w-full aspect-video bg-neutral-100 rounded-lg relative min-h-[300px]">
				<Image
					src={featuredImage}
					alt={"Featured item image"}
					fill
					className="object-cover rounded-lg"
					priority
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/30 rounded-lg" />
				<div className="absolute bottom-0 left-0 right-0 p-10 flex flex-col gap-4">
					<h2 className="font-black text-white text-2xl md:text-5xl">
						{FEATURED_TITLE}
					</h2>
					<p className="text-white text-sm md:text-lg font-medium">
						{FEATURED_DESCRIPTION}
					</p>
					<div>
						<Link
							href="/search"
							className={cn(
								buttonVariants({ size: "lg", variant: "default" }),
								"font-semibold text-lg",
							)}
						>
							Shop now
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
