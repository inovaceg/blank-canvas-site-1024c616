import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#f5f1ed] overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-white px-4 md:px-8 py-4">
          <h1 className="text-lg md:text-xl font-semibold text-[#4a4a4a]">Área Administrativa</h1>
        </div>
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
