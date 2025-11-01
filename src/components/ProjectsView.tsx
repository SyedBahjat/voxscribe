import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderOpen, FileText, X, Trash2, Copy, Download, Plus } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  createdAt: string;
  transcriptions?: string[];
}

interface ProjectsViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProjectsView = ({ open, onOpenChange }: ProjectsViewProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  // Load projects from localStorage
  useEffect(() => {
    const storedProjects = localStorage.getItem("transcription-projects");
    if (storedProjects) {
      try {
        const parsed = JSON.parse(storedProjects);
        setProjects(parsed);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjects([]);
      }
    }
  }, [open]); // Reload when dialog opens

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter((p) => p.id !== projectId);
    setProjects(updatedProjects);
    localStorage.setItem("transcription-projects", JSON.stringify(updatedProjects));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
    toast.success("Project deleted successfully!");
  };

  const handleDeleteTranscription = (projectId: string, transcriptionIndex: number) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        const updatedTranscriptions = [...(project.transcriptions || [])];
        updatedTranscriptions.splice(transcriptionIndex, 1);
        return {
          ...project,
          transcriptions: updatedTranscriptions,
        };
      }
      return project;
    });

    setProjects(updatedProjects);
    localStorage.setItem("transcription-projects", JSON.stringify(updatedProjects));
    
    // Update selected project if it's the one being modified
    if (selectedProject?.id === projectId) {
      setSelectedProject(updatedProjects.find((p) => p.id === projectId) || null);
    }
    
    toast.success("Transcription removed from project!");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDownload = (text: string, index: number) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription-${index + 1}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Transcription downloaded!");
  };

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

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("transcription-projects", JSON.stringify(updatedProjects));
    setNewProjectName("");
    setIsCreating(false);
    toast.success(`Project "${newProject.name}" created successfully!`);
  };

  if (selectedProject) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  className="mr-2"
                >
                  ← Back
                </Button>
                <FolderOpen className="w-5 h-5 text-primary" />
                <DialogTitle>{selectedProject.name}</DialogTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteProject(selectedProject.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <DialogDescription>
              {selectedProject.transcriptions?.length || 0} transcription{(selectedProject.transcriptions?.length || 0) !== 1 ? "s" : ""} in this project
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-4 py-4">
            {selectedProject.transcriptions && selectedProject.transcriptions.length > 0 ? (
              selectedProject.transcriptions.map((transcription, index) => (
                <Card key={index} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Transcription #{index + 1}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(transcription)}
                        className="h-8"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(transcription, index)}
                        className="h-8"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTranscription(selectedProject.id, index)}
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {transcription}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-sm text-muted-foreground">No transcriptions in this project yet.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              <DialogTitle>My Projects</DialogTitle>
            </div>
            {!isCreating && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsCreating(true)}
                className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
            )}
          </div>
          <DialogDescription>
            View and manage your transcription projects
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-3 py-4">
          {isCreating && (
            <Card className="p-4 space-y-4 bg-card border-2">
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
              <div className="space-y-3">
                <Input
                  id="project-name"
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCreateProject();
                    } else if (e.key === "Escape") {
                      setIsCreating(false);
                      setNewProjectName("");
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateProject}
                    className="flex-1 bg-gradient-primary hover:opacity-90 transition-all"
                  >
                    Create Project
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewProjectName("");
                    }}
                    className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
          {projects.length === 0 && !isCreating ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-muted">
                  <FolderOpen className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">No projects yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Create your first project to get started
              </p>
              <Button
                onClick={() => setIsCreating(true)}
                variant="outline"
                className="border-2 bg-background hover:bg-background hover:border-primary/70 hover:text-primary transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </div>
          ) : (
            projects.length > 0 && projects.map((project) => (
              <Card
                key={project.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FolderOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.transcriptions?.length || 0} transcription{(project.transcriptions?.length || 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
