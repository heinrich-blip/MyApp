import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ templates: 0, submissions: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [templatesRes, subsRes] = await Promise.all([
        supabase.from("checklist_templates").select("id", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("submissions").select("id, status"),
      ]);
      const subs = subsRes.data || [];
      setStats({
        templates: templatesRes.count || 0,
        submissions: subs.length,
        completed: subs.filter((s) => s.status === "completed").length,
        inProgress: subs.filter((s) => s.status === "in_progress").length,
      });
    };
    fetchStats();
  }, [user]);

  const statCards = [
    { label: "Active Templates", value: stats.templates },
    { label: "Total Submissions", value: stats.submissions },
    { label: "Completed", value: stats.completed },
    { label: "In Progress", value: stats.inProgress },
  ];

  const kpiData = [
    {
      title: "Diesel",
      covers: "Fuel consumption records, vehicle pre-trip checks, idling behaviour, route compliance and driver fuel-saving technique.",
      why: "Diesel is typically 25–35% of total transport operating cost. Without structured checks, leakage through inefficiency, theft, idling and poor driver behaviour goes undetected.",
      benefit: "Measurable reduction in cost-per-km · Accountability trail for fuel draw · Early detection of mechanical inefficiencies · Audit-ready fuel records",
    },
    {
      title: "Tyres",
      covers: "Tread depth, tyre pressure, visual condition, wheel torque, rotation schedule, alignment and replacement criteria compliance.",
      why: "Tyres are the second-largest maintenance cost item and a primary road-safety risk. Unmanaged tyre condition leads to blowouts, excess fuel use and regulatory non-compliance.",
      benefit: "Extended tyre lifespan · Reduced blowout risk · Fuel savings from correct inflation · Legal compliance · Predictable replacement budgeting",
    },
    {
      title: "R&M – Workshop",
      covers: "Planned maintenance adherence, job card completion, parts usage, vehicle defect reporting, technician sign-off and fleet availability rates.",
      why: "Unplanned breakdowns cost 3–5× more than scheduled maintenance. Without checklist-driven oversight, maintenance slips and vehicle availability deteriorates.",
      benefit: "Higher vehicle uptime · Reduced emergency repair costs · Full maintenance audit trail · Warranty protection · Predictable R&M budgets",
    },
    {
      title: "Operational",
      covers: "Trip sheet accuracy, POD completion, loading/offloading documentation, data entry compliance, system record integrity and administrative process adherence.",
      why: "Operational data compliance is the backbone of billing, customer reporting and regulatory proof of service. Gaps result in revenue leakage and failed audits.",
      benefit: "Clean, billable data on every trip · Reduced invoice disputes · Regulatory audit readiness · Accurate management reporting",
    },
    {
      title: "Human Capital",
      covers: "Driver licences and medicals, hours-of-service compliance, training currency, fatigue management, disciplinary records, onboarding and wellness.",
      why: "People are the single greatest variable in transport performance. Non-compliant or under-trained drivers cause accidents, regulatory sanctions and staff turnover.",
      benefit: "Safer, compliant workforce · Reduced accident & insurance costs · Lower staff turnover · Stronger employer brand",
    },
    {
      title: "Customer Service",
      covers: "On-time delivery performance, customer communication standards, complaint resolution, POD turnaround, load integrity and SLA adherence.",
      why: "Customer retention is driven by consistency and responsiveness. SLA breaches and unresolved complaints erode contract value and trigger penalty clauses.",
      benefit: "Improved on-time delivery · Faster complaint resolution · SLA compliance evidence · Competitive differentiation through documented quality",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-4 sm:p-5 lg:p-6 xl:p-8 space-y-6 sm:space-y-7 lg:space-y-8 w-full">
        <div className="flex justify-end">
          <Link to="/checklists/new">
            <Button size="lg" className="w-full sm:w-auto">New Checklist</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 xl:gap-6">
          {statCards.map((stat) => (
            <Card key={stat.label} className="border border-border shadow-sm">
              <CardContent className="p-4 sm:p-5 lg:p-6 xl:p-7">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Actions */}
        {isAdmin && (
          <Card className="border border-border bg-card shadow-sm">
            <CardContent className="p-4 sm:p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div>
                  <p className="text-sm sm:text-base font-semibold text-foreground">Admin Quick Actions</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Manage templates, categories and audit items</p>
                </div>
              </div>
              <Link to="/templates">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Manage Templates
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Framework Header */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 sm:p-6 lg:p-7 xl:p-8 shadow-sm">
            <div className="relative space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-1 w-10 sm:w-12 lg:w-14 rounded-full bg-primary" />
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary">Framework</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                QA Checklist Framework
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                This framework is directly aligned with the <span className="font-semibold text-foreground">six core Transport KPIs</span>.
                Each checklist area maps to a measurable KPI, ensuring every compliance check has a clear operational purpose and a quantifiable benefit.
              </p>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {kpiData.map((kpi) => (
              <Card
                key={kpi.title}
                className="group border border-border transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-5">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground">{kpi.title}</h3>
                      <span className="text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground inline-block mt-1">
                        KPI Area
                      </span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">What is checked</p>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-2 sm:pl-3">
                        {kpi.covers}
                      </p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Why it matters</p>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed pl-2 sm:pl-3">
                        {kpi.why}
                      </p>
                    </div>

                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider">Management benefit</p>
                      </div>
                      <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                        {kpi.benefit}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;