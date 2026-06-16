import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardContent from "@/components/DashboardContent"; // <-- Sem as chaves aqui!

export default function DashboardPage() { 
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  ); 
}