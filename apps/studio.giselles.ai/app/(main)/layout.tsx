import { ToastProvider } from "@giselle-internal/ui/toast";
import { SentryUserWrapper } from "@/components/sentry-user-wrapper";
import { db, supabaseUserMappings } from "@/db";
import { getUser } from "@/lib/supabase";
import { initializeAccount } from "@/services/accounts";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Header } from "./ui/header";
import { Sidebar } from "./ui/sidebar";
import { TaskOverlay } from "./ui/task-overlay";

export default async function Layout({
	children,
}: { children: React.ReactNode }) {
	// Auto-initialize account if needed (e.g. email verification flow)
	try {
		const user = await getUser();
		if (user) {
			const dbUser = await db.query.supabaseUserMappings.findFirst({
				where: eq(supabaseUserMappings.supabaseUserId, user.id),
			});

			if (!dbUser) {
				await initializeAccount(
					user.id,
					user.email,
					user.user_metadata?.avatar_url,
				);
			}
		}
	} catch (error) {
		console.error("Failed to check/initialize account in layout:", error);
		// Redirect to login with error details to expose the failure reason
		const errorMessage = error instanceof Error ? error.message : String(error);
		redirect(`/login?error=AccountInitFailed&details=${encodeURIComponent(errorMessage)}`);
	}

	return (
		<SentryUserWrapper>
			<ToastProvider>
				<div className="h-screen flex flex-col bg-bg">
					<Header />
					<div className="flex overflow-y-hidden divide-x divide-border flex-1">
						<Sidebar />
						<main className="flex-1 overflow-y-auto relative">
							{children}
							<TaskOverlay />
						</main>
					</div>
				</div>
			</ToastProvider>
		</SentryUserWrapper>
	);
}
