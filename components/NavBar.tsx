import Link from "next/link";
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { getCurrentDbUser } from "@/lib/auth";

export async function NavBar() {
  const user = await getCurrentDbUser();
  const canAccessAdmin = user?.canAccessAdmin === true;

  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span>GS</span>
        <strong>GraceStream</strong>
      </Link>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/archive">Archive</Link>
        <Link href="/library">Library</Link>
        <Link href="/donation">Donation</Link>
        <SignedIn>
          <Link href="/profile">Profile</Link>
        </SignedIn>
        {canAccessAdmin && <Link href="/admin">Admin</Link>}
        {canAccessAdmin && <Link href="/analytics">Analytics</Link>}
      </nav>
      <div className="auth">
        <SignedOut>
          <SignInButton mode="modal">
            <button>Login</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <SignOutButton>
            <button>Logout</button>
          </SignOutButton>
        </SignedIn>
      </div>
    </header>
  );
}
