import UsersLayout from "@/components/users/users-layout";

export default async function Users() {
  let usersData = null;
  let error = null;
  try {
    const res = await fetch(
      "https://hgv.legalnoticegateway.com/api/zeus/list-users",
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPER_ADMIN_PIN}`,
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status}`);
    }
    usersData = await res.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center h-[30vh] text-center text-red-600 border border-destructive/30 bg-destructive/5 rounded-md">
        <h2 className="text-2xl font-semibold mb-2">Error loading users</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <UsersLayout users={usersData.users} />;
}
