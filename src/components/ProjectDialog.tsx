import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus, FolderOpen, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  transcriptions?: string[];
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transcriptionText: string;
  onAddToProject?: (projectId: string) => void;
}

export const ProjectDialog = ({ open, onOpenChange, transcriptionText, onAddToProject }: ProjectDialogProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Load projects from localStorage on mount
  useEffect(() => {
    const storedProjects = localStorage.getItem("transcription-projects");
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      }
    }
  }, []);

  // Save projects to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0 || localStorage.getItem("transcription-projects")) {
      localStorage.setItem("transcription-projects", JSON.stringify(projects));
    }
  }, [projects]);

  const handleCreateProject = () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: newProjectName.trim(),
      createdAt: new Date().toISOString(),
      transcriptions: [],
    };

    setProjects([...projects, newProject]);
    setNewProjectName("");
    setIsCreating(false);
    toast.success(`Project "${newProject.name}" created successfully!`);
  };

  const handleAddToProject = (projectId: string) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return {
          ...project,
          transcriptions: [...(project.transcriptions || []), transcriptionText],
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    
    if (onAddToProject) {
      onAddToProject(projectId);
    }
    
    toast.success("Transcription added to project!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            Add to Project
          </DialogTitle>
          <DialogDescription>
            Select an existing project or create a new one to organize your transcriptions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {projects.length === 0 && !isCreating ? (
            <div className="text-center py-8 space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-muted">
                  <FolderOpen className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                No projects yet. Create your first project to get started!
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            </div>
          ) : (
            <>
              {isCreating ? (
                <div className="space-y-4 p-4 border rounded-lg bg-card">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="project-name" className="text-sm font-semibold">
                      Project Name
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsCreating(false);
                        setNewProjectName("");
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      id="project-name"
                      placeholder="Enter project name..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreateProject();
                        }
                      }}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateProject}
                        className="flex-1"
                      >
                        Create Project
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreating(false);
                          setNewProjectName("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-foreground">
                      Select a project ({projects.length} {projects.length === 1 ? "project" : "projects"})
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCreating(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleAddToProject(project.id)}
                        className="w-full text-left p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <FolderOpen className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {project.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {project.transcriptions?.length || 0} transcription{project.transcriptions?.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToProject(project.id);
                            }}
                          >
                            Add
                          </Button>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
