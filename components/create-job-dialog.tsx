"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader
, DialogDescription, DialogTitle, 
DialogFooter} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-application";


interface CreateJobApplicationDialogProps {
    columnId: string;
    boardId: string;
}
const INITIAL_FORM_DATA = {
    company: "",
    position: "",
    location: "",
    salary: "",
    jobUrl: "",
    tags: "",
    description: "",
    notes: "",
};
export default function CreateJobApplicationDialog({
    columnId,
    boardId,
}:  CreateJobApplicationDialogProps ) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  
    async function handleSubmit (e: React.FormEvent) {
        e.preventDefault();
        try {
         const result =  await createJobApplication({
            ...formData,
            columnId,
            boardId,
            tags: formData.tags
            .split(",")
            .map((tag) =>  tag.trim())
            .filter((tag) => tag.length > 0),
         });
           if (!result.error) {
            setFormData(INITIAL_FORM_DATA);
            setIsOpen(false);
         } else {
            console.error("Job application created successfully!");
           
         }
        } catch (error) {
            console.error(error);
        }
    }
   return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline"
            className="w-full mb-4 justify-start text-muted-foregrounds">
                <Plus className="mr-2 h-4 w-4" />
                Add Job</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Create Job Application</DialogTitle>
                <DialogDescription>Track a new job applications</DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                        <div className="space-y-2s">
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
                            <Textarea  id="notes"  rows={4}
                             onChange={(e) => setFormData({...formData, notes: e.target.value})}
                             value={formData.notes} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline"
                        onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit">Add Application</Button>
                    </DialogFooter>
                
            </form>
        </DialogContent>
    </Dialog>
    );
}