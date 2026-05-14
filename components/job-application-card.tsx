"use client";
import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { deleteJobApplication, updateJobApplication } from "@/lib/actions/job-application";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import column from "@/lib/models/column";


interface JobApplicationProps {
    job: JobApplication;
    columns: Column[];
}
export default function JobApplicationCard({job, columns}: JobApplicationProps) {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        company: job.company,
        position: job.position,
        location: job.location || "",
        salary: job.salary || "",
        jobUrl: job.jobUrl || "",
        columnId: job.columnId || "",
        tags: job.tags ? job.tags.join(", ") : "",
        description: job.description || "",
        notes: job.notes || "",
    });
    const [isOpen, setIsOpen] = useState<boolean>(false);

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const result = await updateJobApplication(job._id,
                 { 
                    ...formData, 
                tags: formData.tags
                .split(",")
                .map((tag) =>  tag.trim())
                .filter((tag) => tag.length > 0),
                });
                if (!result.error) {
                   setIsEditing(false);
                }
                 }
            // call move job application action
        
        catch (error) {
            console.log(error);
        }
    }
    async function handleMove(newColumnId: string) {
        try {
            const result = await updateJobApplication(job._id,
                 { columnId: newColumnId });
            // call move job application action
        }
        catch (error) {
            console.log(error);
        }
    }
    async function handleDelete() {
        try {
            // call delete job application action
            const result = await deleteJobApplication(job._id);
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <>
        <Card className="cursor-pointer transition-shadow hover:shadow-lg
        bg-white group shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{job.company}</p>
                        {job.description && <p className="text-xs text-muted-foreground mb-2
                        line-clamp-2">{job.description}</p>}
                        {job.tags && job.tags.length > 0 && (   
                            <div className="flex flex-wrap gap-1 mb-2">
                                {job.tags.map((tag, key) => (
                                    <span key={key} className="px-2 py-0.5 text-xs 
                                    rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" >
                                        {tag}
                                        
                                    </span>
                                ))}
                            </div>
                        )}
                        {job.jobUrl && (
                            <a href={job.jobUrl} target="_blank" 
                               className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                            onClick={(e) => e.stopPropagation()}>
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-start gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon"
                                className="h-6 w-6">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <Edit2 className="mb-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                             {columns.length > 1 && (
                                <>
                                {columns
                                .filter((c) => c._id !== job.columnId)
                                .map((column, key) => (
                                    <DropdownMenuItem key={key} onClick={() => handleMove(column._id)}>
                                        Move to {column.name}
                                    </DropdownMenuItem>
                                ))}
                                </>
                               )} 
                                <DropdownMenuItem className="text-destructive"
                                onClick={handleDelete}>
                                    <Trash2 className="mr-2 h-4 w-4" />   
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </CardContent>
        </Card>
         <Dialog open={isEditing} onOpenChange={setIsEditing}>
      
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Create Job Application</DialogTitle>
                <DialogDescription>Track a new job applications</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdate} >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company *</Label>
                            <Input  id="company"  required 
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            value={formData.company} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="position">Position *</Label>
                            <Input  id="position"  required 
                            onChange={(e) => setFormData({...formData, position: e.target.value})}
                            value={formData.position} />
                        </div>
                    </div>
                        <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input  id="location" 
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            value={formData.location} />
                        </div>
                        
                         <div className="space-y-2">
                            <Label htmlFor="salary">Salary *</Label>
                            <Input  id="salary"  placeholder="e.g, $100k- $150k" 
                            onChange={(e) => setFormData({...formData, salary: e.target.value})}
                            value={formData.salary} />
                        </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-url">Job URL</Label>
                            <Input  id="job-url"  placeholder="https://example.com"
                            onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                            value={formData.jobUrl} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input  id="tags"   placeholder="Frontend, React, TypeScript"
                            onChange={(e) => setFormData({...formData, tags: e.target.value})}
                            value={formData.tags} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea  id="description"  rows={3}
                             placeholder="Breif description of the role"
                             onChange={(e) => setFormData({...formData, description: e.target.value})}
                             value={formData.description} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea id="notes"  rows={4}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                             value={formData.notes} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline"
                        onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                
            </form>
        </DialogContent>
    </Dialog>
        </>
    )
}
