import { useCitizenApplications, useApproveCitizenApplication, useRejectCitizenApplication, useCitizenApplicationFilters } from "@workspace/api-client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  UserCheck,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { format } from "date-fns";
import { CitizenApplicationFilters } from "../components/desktop/list/filters";
import { CitizenApplicationPagination } from "../components/desktop/list/pagination";

export const CitizenApplicationsView = () => {
  const [filters] = useCitizenApplicationFilters();
  const { data, isLoading } = useCitizenApplications(filters);
  const approveMutation = useApproveCitizenApplication();
  const rejectMutation = useRejectCitizenApplication();

  const handleApprove = async (id: string) => {
    if (confirm("Are you sure you want to approve this application? This will create an official citizen record.")) {
      await approveMutation.mutateAsync(id);
    }
  };

  const handleReject = async (id: string) => {
    if (confirm("Are you sure you want to reject this application?")) {
      await rejectMutation.mutateAsync(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1.5 py-1 px-2.5 rounded-lg">
            <Clock className="w-3 h-3" /> PENDING
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1 px-2.5 rounded-lg">
            <CheckCircle2 className="w-3 h-3" /> APPROVED
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 gap-1.5 py-1 px-2.5 rounded-lg">
            <XCircle className="w-3 h-3" /> REJECTED
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-on-surface tracking-tight">Citizen Applications</h1>
          <p className="text-sm text-on-surface-variant font-medium">Review and verify registration requests</p>
        </div>
        
        <div className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-[24px] p-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Total Actions</p>
            <p className="text-xl font-black text-on-surface mt-1 leading-none">{data?.data?.total || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <CitizenApplicationFilters />

      {/* Applications Table */}
      <div className="bg-white rounded-[32px] border border-outline/5 shadow-ambient overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-outline/5">
                <TableHead className="w-[300px] h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Applicant</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Identity</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Address</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</TableHead>
                <TableHead className="h-14 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <span className="text-xs font-black uppercase tracking-widest">Loading Applications...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <UserCheck className="w-10 h-10" />
                      <span className="text-xs font-black uppercase tracking-widest">No applications found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.items.map((app: any) => (
                  <TableRow key={app.id} className="hover:bg-slate-50/50 border-outline/5 transition-colors group">
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{app.fullNameBn}</span>
                        <span className="text-[11px] text-on-surface-variant font-medium opacity-60 truncate">{app.fullNameEn || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-on-surface">{app.nid}</span>
                        <span className="text-[11px] text-on-surface-variant font-medium opacity-60">DOB: {app.dateOfBirth ? format(new Date(app.dateOfBirth), "dd MMM, yyyy") : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-on-surface">{app.presentVillageBn}</span>
                        <span className="text-[11px] text-on-surface-variant font-medium opacity-60">Ward: {app.presentWardNo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(app.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-outline/10 text-on-surface-variant">
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        {app.status === "PENDING" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl hover:bg-emerald-50 text-emerald-600 border border-transparent hover:border-emerald-100"
                              onClick={() => handleApprove(app.id)}
                              disabled={approveMutation.isPending}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="w-9 h-9 rounded-xl hover:bg-rose-50 text-rose-600 border border-transparent hover:border-rose-100"
                              onClick={() => handleReject(app.id)}
                              disabled={rejectMutation.isPending}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination Section */}
        <CitizenApplicationPagination total={data?.data?.total || 0} />
      </div>
    </div>
  );
};
