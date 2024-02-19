import { TIME_FOR_TOKEN_EXPIRATION } from "@/config/site-config";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { notFound } from "next/navigation";

const ActivationPage = async ({ params }: { params: { token: string } }) => {
	if (!params.token) {
		console.log("Token not found");
		return notFound();
	}

	const user = await prisma.user.findFirst({
		where: {
			activateTokens: {
				some: {
					AND: [
						{
							activatedAt: null,
						},
						{
							createdAt: {
								gt: new Date(Date.now() - TIME_FOR_TOKEN_EXPIRATION), //24 hours
							},
						},
						{
							token: params.token,
						},
					],
				},
			},
		},
	});

	if (!user || !user.email) {
		console.log("User not found");
		return notFound();
	}

	await prisma.user.update({
		where: {
			id: user.id,
		},
		data: {
			active: true,
			emailVerified: new Date(),
		},
	});

	await prisma.activateToken.update({
		where: {
			token: params.token,
		},
		data: {
			activatedAt: new Date(),
		},
	});

	await resend.emails.send({
		from: "support@whxtest.pl",
		to: [user.email],
		subject: "Account activated - Fresh & Clean Ecommerce Store",
		html: "Your account has been activated. You can log in now.",
	});

	return (
		<div className="w-full text-center mt-20">
			<h2 className="text-4xl font-bold">Account activated! You can log in.</h2>
		</div>
	);
};

export default ActivationPage;
