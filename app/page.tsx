import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");

  if (userCookie) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
