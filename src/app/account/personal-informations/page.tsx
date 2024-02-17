import PersonalInformationsForm from "@/components/account-page/personal-informations-form";

const PersonalInformationsSubPage = () => {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-2xl font-bold">Personal Informations</h1>
			<PersonalInformationsForm />
		</div>
	);
};

export default PersonalInformationsSubPage;
