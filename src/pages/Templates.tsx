import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { exportChecklistToPdf } from "@/lib/pdfExport";
import type { Tables } from "@/integrations/supabase/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Templates = () => {
  const { isAdmin, user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("checklist_templates")
      .select("*, template_categories(category_items(weight))")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTemplates(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("checklist_templates").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ 
        title: "Template deleted", 
        description: "The template has been removed successfully.",
      });
      fetchTemplates();
    }
    setDeleteId(null);
  };

  const handleExportPdf = async (template: Tables<"checklist_templates">) => {
    const { data: cats } = await supabase
      .from("template_categories")
      .select("*, category_items(*)")
      .eq("template_id", template.id)
      .order("category_number");

    interface CatItemRow {
      id: string;
      question: string;
      weight: number;
      sort_order: number;
    }
    interface CatRow {
      id: string;
      name: string;
      category_number: number;
      category_items: CatItemRow[];
    }

    const pdfCategories = ((cats ?? []) as CatRow[]).map((c) => ({
      number: c.category_number,
      name: c.name,
      items: [...(c.category_items || [])]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          question: item.question,
          compliance: null,
          weight: item.weight,
          score: 0,
          comments: "",
          responsible_person: "",
        })),
    }));

    exportChecklistToPdf({ templateName: template.name, categories: pdfCategories });
    toast({
      title: "PDF Exported",
      description: `Blank template "${template.name}" has been exported.`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTemplateWeight = (t: any) => {
    return t.template_categories?.reduce((sum: number, cat: any) => 
      sum + (cat.category_items?.reduce((s: number, i: any) => s + i.weight, 0) || 0)
    , 0) || 0;
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-destructive/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Admin privileges are required to manage templates.
            </p>
            <Link to="/">
              <Button variant="outline">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="p-4 md:p-6 lg:p-8 space-y-8 w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Checklist Templates
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create and manage quality control checklist templates
              </p>
            </div>
            <Link to="/templates/new">
              <Button size="lg" className="shadow-lg shadow-primary/20">
                New Template
              </Button>
            </Link>
          </div>

          {/* Stats Overview */}
          {!loading && templates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{templates.length}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Templates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {templates.filter(t => t.is_active).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Templates</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {templates.filter(t => !t.is_active).length}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Inactive Templates</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Templates Grid */}
          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : templates.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No templates yet
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                  Get started by creating your first checklist template. You can add categories and questions to build a comprehensive audit.
                </p>
                <Link to="/templates/new">
                  <Button size="lg">
                    Create Your First Template
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="group border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {template.name}
                          </h3>
                          <Badge 
                            variant={template.is_active ? "default" : "secondary"}
                            className={template.is_active ? "bg-success/10 text-success border-success/20" : ""}
                          >
                            {template.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                          {template.description || "No description provided"}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                          <span>
                            Created {formatDate(template.created_at)}
                          </span>
                          {template.updated_at && template.updated_at !== template.created_at && (
                            <span>· Updated {formatDate(template.updated_at)}</span>
                          )}
                          <span>· Max Score: {getTemplateWeight(template)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleExportPdf(template)}
                            >
                              Export PDF
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Export blank template as PDF</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link to={`/templates/${template.id}`}>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit template</p>
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialog open={deleteId === template.id} onOpenChange={(open) => !open && setDeleteId(null)}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => setDeleteId(template.id)}
                                  className="text-destructive hover:text-destructive border-destructive/20 hover:border-destructive/50"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete template</p>
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the template "{template.name}" and all associated categories and items. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(template.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete Template
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Templates;