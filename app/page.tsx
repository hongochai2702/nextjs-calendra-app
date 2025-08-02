import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import LandingPage from "../components/LandingPage";

export default async function Home() {
	const user = await currentUser();
	// If no user is logged in, render the public landing page
	if (!user) {
		return <LandingPage />;
	}

	redirect("/events");
}
