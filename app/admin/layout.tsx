import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = { title: "Admin" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminNav />
      <div className="container-page py-8 lg:py-10">{children}</div>
    </div>
  );
}
