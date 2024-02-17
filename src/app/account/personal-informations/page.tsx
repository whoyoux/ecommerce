import NotFound from "@/app/not-found";
import PersonalInformationsForm from "@/components/account-page/personal-informations-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PersonalInformationsSubPage = async () => {
	const session = await auth();
	if (!session) return NotFound();
	const personalInformations = await prisma.personalInformation.findUnique({
		where: {
			userId: session.user.id,
		},
	});

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">Personal Informations</h1>
			<PersonalInformationsForm personalInformations={personalInformations} />
		</div>
	);
};

export default PersonalInformationsSubPage;
