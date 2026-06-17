import { NavBar } from "@/components/NavBar";
import { requireUser } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <>
      <NavBar />
      <main className="page profile">
        <h1>My Profile</h1>
        <article className="panel">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          <span>{user.accessClass} · Admin access: {user.canAccessAdmin ? "Granted" : "Not granted"}</span>
        </article>
        <form className="form-grid" action="/api/profile" method="post">
          <label>Name<input name="name" defaultValue={user.name} /></label>
          <label>Phone<input name="phone" defaultValue={user.phone || ""} /></label>
          <label>Ministry<input name="ministry" defaultValue={user.ministry || ""} /></label>
          <label>Bio<textarea name="bio" defaultValue={user.bio || ""} /></label>
          <button className="primary">Save Profile</button>
        </form>
      </main>
    </>
  );
}
