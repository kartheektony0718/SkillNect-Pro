import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Users, Activity, RefreshCcw } from "lucide-react";

const API_URL = "https://skillrush-backend.onrender.com/api";

const Admin = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchCloudData = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) { console.error("Sync error"); }
  };

  useEffect(() => { fetchCloudData(); }, []);

  return (
    <DashboardLayout>
      <div className="p-10 space-y-10">
        <div className="flex justify-between items-end">
          <h1 className="text-5xl font-black uppercase italic text-white tracking-tighter">Cloud Console</h1>
          <button onClick={fetchCloudData} className="p-3 bg-white/5 rounded-full hover:bg-primary transition-all group">
            <RefreshCcw className="h-5 w-5 text-primary group-hover:text-white" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-panel p-8 border-primary/20 bg-primary/5 flex gap-4 items-center">
            <Users className="text-primary h-8 w-8" />
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">Teammates</p><h3 className="text-3xl font-black text-white">{users.length}</h3></div>
          </Card>
          <Card className="glass-panel p-8 border-white/5 flex gap-4 items-center">
            <Activity className="text-green-500 h-8 w-8" />
            <div><p className="text-[10px] uppercase font-bold text-muted-foreground">DB Status</p><h3 className="text-3xl font-black text-green-500">Cloud Active</h3></div>
          </Card>
        </div>

        <Card className="overflow-hidden border-white/5 bg-transparent">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] uppercase font-black text-muted-foreground">
              <tr><th className="p-4">Candidate</th><th className="p-4">Identifier</th><th className="p-4">Joined</th></tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="p-4 text-white font-bold uppercase italic text-sm">{u.name}</td>
                  <td className="p-4 text-xs text-muted-foreground font-mono">{u.email}</td>
                  <td className="p-4 text-[10px] text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;