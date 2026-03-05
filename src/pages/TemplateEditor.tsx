import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

// Define proper types instead of using any
interface CategoryItem {
  id?: string;
  question: string;
  weight: number;
  sort_order: number;
}

interface CategoryDraft {
  id?: string;
  name: string;
  category_number: number;
  items: CategoryItem[];
}

// Database response types
interface CategoryItemResponse {
  id: string;
  question: string;
  weight: number;
  sort_order: number;
}

interface CategoryResponse {
  id: string;
  name: string;
  category_number: number;
  category_items: CategoryItemResponse[];
}

const TemplateEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isNew = id === "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<CategoryDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [deleteCategoryIndex, setDeleteCategoryIndex] = useState<number | null>(null);
  const [deleteItemIndex, setDeleteItemIndex] = useState<{ catIdx: number; itemIdx: number } | null>(null);

  const loadTemplate = useCallback(async (templateId: string) => {
    const { data: template } = await supabase
      .from("checklist_templates")
      .select("*")
      .eq("id", templateId)
      .maybeSingle();

    if (!template) {
      toast({ title: "Not found", variant: "destructive" });
      navigate("/templates");
      return;
    }

    setName(template.name);
    setDescription(template.description || "");
    setIsActive(template.is_active);

    const { data: cats } = await supabase
      .from("template_categories")
      .select("*, category_items(*)")
      .eq("template_id", templateId)
      .order("category_number");

    const mapped: CategoryDraft[] = ((cats || []) as CategoryResponse[]).map((c) => ({
      id: c.id,
      name: c.name,
      category_number: c.category_number,
      items: (c.category_items || [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => ({
          id: item.id,
          question: item.question,
          weight: item.weight,
          sort_order: item.sort_order,
        })),
    }));
    setCategories(mapped);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (!isNew && id) {
      loadTemplate(id);
    }
  }, [id, isNew, loadTemplate]);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: "", category_number: prev.length + 1, items: [] },
    ]);
  };

  const removeCategory = (idx: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== idx).map((c, i) => ({ ...c, category_number: i + 1 })));
    setDeleteCategoryIndex(null);
  };

  const updateCategory = (idx: number, updates: Partial<CategoryDraft>) => {
    setCategories((prev) => prev.map((c, i) => (i === idx ? { ...c, ...updates } : c)));
  };

  const addItem = (catIdx: number) => {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === catIdx
          ? { ...c, items: [...c.items, { question: "", weight: 1, sort_order: c.items.length }] }
          : c
      )
    );
  };

  const removeItem = (catIdx: number, itemIdx: number) => {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === catIdx
          ? { ...c, items: c.items.filter((_, j) => j !== itemIdx).map((item, j) => ({ ...item, sort_order: j })) }
          : c
      )
    );
    setDeleteItemIndex(null);
  };

  const updateItem = (catIdx: number, itemIdx: number, updates: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((c, i) =>
        i === catIdx
          ? { ...c, items: c.items.map((item, j) => (j === itemIdx ? { ...item, ...updates } : item)) }
          : c
      )
    );
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    const totalWeight = categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.weight, 0), 0);
    if (totalWeight !== 100) {
      toast({
        title: "Invalid Total Weight",
        description: `Total weight must be exactly 100. Current total: ${totalWeight}`,
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      let templateId = id;

      if (isNew) {
        const { data, error } = await supabase
          .from("checklist_templates")
          .insert({ name, description, is_active: isActive, created_by: user?.id })
          .select("id")
          .single();
        if (error) throw error;
        templateId = data.id;
      } else {
        const { error } = await supabase
          .from("checklist_templates")
          .update({ name, description, is_active: isActive })
          .eq("id", templateId!);
        if (error) throw error;

        // Delete existing categories (cascade deletes items)
        await supabase.from("template_categories").delete().eq("template_id", templateId!);
      }

      // Insert categories and items
      for (const cat of categories) {
        if (!cat.name.trim()) continue; // Skip categories without names

        const { data: catData, error: catError } = await supabase
          .from("template_categories")
          .insert({ template_id: templateId!, name: cat.name, category_number: cat.category_number })
          .select("id")
          .single();
        if (catError) throw catError;

        const validItems = cat.items.filter(item => item.question.trim());
        if (validItems.length > 0) {
          const { error: itemError } = await supabase.from("category_items").insert(
            validItems.map((item) => ({
              category_id: catData.id,
              question: item.question,
              weight: item.weight,
              sort_order: item.sort_order,
            }))
          );
          if (itemError) throw itemError;
        }
      }

      toast({ title: "Saved", description: "Template saved successfully." });
      navigate("/templates");
    } catch (err) {
      const error = err as Error;
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
    setSaving(false);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-destructive/20">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Restricted</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Admin privileges are required to edit templates.
            </p>
            <Button variant="outline" onClick={() => navigate("/templates")}>
              Return to Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const totalWeight = categories.reduce((sum, c) => sum + c.items.reduce((s, i) => s + i.weight, 0), 0);
  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="p-4 md:p-6 lg:p-8 space-y-6 w-full">
          {/* Header */}
          <div className="flex items-start gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/templates")}
              className="shrink-0 mt-1"
            >
              Back
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  {isNew ? "Create New Template" : "Edit Template"}
                </h1>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {isNew ? "Draft" : "Editing"}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {categories.length} Categories
                </span>
                <span>•</span>
                <span>{totalItems} Questions</span>
                <span>•</span>
                <span>Total Weight: {totalWeight}</span>
              </div>
            </div>
          </div>

          {/* Template Info Card */}
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Human Capital Audit"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this template's purpose..."
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active Status</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Active templates are visible to users
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories & Questions</h2>
              <Button onClick={addCategory} size="sm">
                Add Category
              </Button>
            </div>

            {categories.length === 0 ? (
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">No categories yet</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-sm mb-4">
                    Start by adding a category to organize your checklist questions.
                  </p>
                  <Button onClick={addCategory} variant="outline" size="sm">
                    Add First Category
                  </Button>
                </CardContent>
              </Card>
            ) : (
              categories.map((cat, catIdx) => (
                <Card key={catIdx} className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-base font-bold shrink-0">
                        {cat.category_number}
                      </div>
                      <Input
                        value={cat.name}
                        onChange={(e) => updateCategory(catIdx, { name: e.target.value })}
                        placeholder="Category name (e.g., Diesel, Tyres, Workshop)"
                        className="flex-1"
                      />
                      <AlertDialog open={deleteCategoryIndex === catIdx} onOpenChange={(open) => !open && setDeleteCategoryIndex(null)}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setDeleteCategoryIndex(catIdx)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete category</p>
                          </TooltipContent>
                        </Tooltip>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the category "{cat.name || 'Untitled'}" and all its questions. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteCategoryIndex(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => removeCategory(catIdx)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete Category
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="group relative">
                        <div className="flex items-start gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr,100px] gap-2">
                            <Input
                              value={item.question}
                              onChange={(e) => updateItem(catIdx, itemIdx, { question: e.target.value })}
                              placeholder="Checklist question"
                              className="w-full"
                            />
                            <div className="relative">
                              <Input
                                type="number"
                                value={item.weight}
                                onChange={(e) => updateItem(catIdx, itemIdx, { weight: parseInt(e.target.value) || 0 })}
                                placeholder="Weight"
                                min={0}
                                className="w-full pr-12"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                pts
                              </span>
                            </div>
                          </div>

                          <AlertDialog open={deleteItemIndex?.catIdx === catIdx && deleteItemIndex?.itemIdx === itemIdx} 
                                     onOpenChange={(open) => !open && setDeleteItemIndex(null)}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setDeleteItemIndex({ catIdx, itemIdx })}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete question</p>
                              </TooltipContent>
                            </Tooltip>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete this question. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setDeleteItemIndex(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => removeItem(catIdx, itemIdx)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete Question
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addItem(catIdx)} 
                      className="mt-2 w-full border-dashed hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      Add Question to {cat.name || 'Category'}
                    </Button>

                    {cat.items.length > 0 && (
                      <div className="mt-2 text-right">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Category weight: {cat.items.reduce((sum, i) => sum + i.weight, 0)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button 
              variant="outline" 
              onClick={() => navigate("/templates")}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              size="lg"
              className="gap-2 min-w-[120px]"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Saving...
                </>
              ) : (
                <>
                  Save Template
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TemplateEditor;