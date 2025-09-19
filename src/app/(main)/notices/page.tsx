import NoticesLayout from "@/components/notices/notices-layout";

export default async function Notices() {
  let notices = null;
  let error = null;
  try {
    const hgvNotices = await fetch(
      "https://hgv.legalnoticegateway.com/api/zeus/list-notices/outstanding",
      {
        headers: {
          Authorization: `Bearer ${process.env.SUPER_ADMIN_PIN}`,
        },
      }
    );
    if (!hgvNotices.ok) {
      throw new Error(`Failed to fetch notices: ${hgvNotices.status}`);
    }
    notices = await hgvNotices.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  if (error) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center h-[30vh] text-center text-red-600 border border-destructive/30 bg-destructive/5 rounded-md">
        <h2 className="text-2xl font-semibold mb-2">Error loading notices</h2>
        <p>{error}</p>
      </div>
    );
  }

  return <NoticesLayout hgvNotices={notices} />;
}
