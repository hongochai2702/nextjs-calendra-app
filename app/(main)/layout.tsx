import PrivateNavBar from "@/components/PrivateNavBar";
import PublicNavBar from "@/components/PublicNavBar";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

type LayoutProps = {
	children: React.ReactNode;
};
const Layout: React.FC<LayoutProps> = async ({ children }) => {
	const user = await currentUser();

	return (
		<main className="relative">
			{/* Render PrivateNavBar if user exists, otherwise render PublicNavBar */}
			{user ? <PrivateNavBar /> : <PublicNavBar />}
			{/* Render the children */}
			<section className="pt-36">{children}</section>
		</main>
	);
};

export default Layout;
