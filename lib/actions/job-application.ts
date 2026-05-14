"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "../auth/auth";
import dbConnect from "../db";
import { Board, Column, JobApplication } from "../models";

interface CreateJobApplicationData {
    company: string;
    position: string;
    location?: string;
    salary?: string;
    jobUrl?: string;
    columnId: string;
    boardId: string;
    tags: string[];
    description?: string;
    notes?: string;
}

export async function createJobApplication(data: CreateJobApplicationData) {

const session = await getSession();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    await dbConnect();
    const {
        company,
        position,
        location,
        salary,
        jobUrl,
        columnId,
        boardId,
        tags,
        description,
        notes,
    
    } = data;
    if (!company || !position || !columnId || !boardId) {
        return { error: "Missing required fields" };
    }
    // verify board ownership
    const board = await Board.findOne({ _id: boardId, userId: session.user.id });
    if (!board) {
        return { error: "Board not found" };
    }
   // verify colunn belogns to board
    const column = Column.findOne({ _id: columnId, boardId: boardId });
    if (!column) {
        return { error: "Column not found in board" };
    }
    const maxOrder = (await JobApplication.findOne({ columnId })
    .sort({ order: -1 })
    .select("order")
    .lean()) as { order: number } | null;
  // create job application
    const jobApplication = await JobApplication.create({
        company,
        position,
        location,
        salary,
        jobUrl,
        columnId,
        boardId,
        userId: session.user.id,
        tags: tags || [],
        description,
        notes,
        status: "applied",
        order:maxOrder ? maxOrder.order + 1 : 0,
    });
    await Column.findByIdAndUpdate(columnId, { $push: { jobApplications: jobApplication._id } });
    revalidatePath("/dashboard");
    return { data: JSON.parse(JSON.stringify(jobApplication)) };   
}
export async function updateJobApplication(
    id: string,
    updates: {
        company?: string;
        position?: string;
        location?: string;
        salary?: string;
        jobUrl?: string;
        columnId?: string;
        boardId?: string;
        tags?: string[];
        description?: string;
        notes?: string;
        order?: number;
    }
) {
    const session = await getSession();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
     const jobApplication = await JobApplication.findById(id );
    if (!jobApplication) {
        return { error: "Job application not found" };
    }
    if (jobApplication.userId.toString() !== session.user.id) {
        return { error: "Unauthorized" };
    }
    const {columnId, order, ...otherUpdates} = updates;
   const updatesToApply: Partial<{
    company: string;
    position: string;
    location: string;
    salary: string;
    jobUrl: string;
    columnId: string;
    boardId: string;
    tags: string[];
    description: string;
    notes: string;
    order: number;
   }> = otherUpdates;

   const currentColumnId = jobApplication.columnId.toString();
   const newColumnId = columnId?.toString();

   const isMovingDifferentColumn = 
   newColumnId && newColumnId !== currentColumnId;

   if (isMovingDifferentColumn) {
    await Column.findByIdAndUpdate(currentColumnId, {
        $pull: { jobApplications: id },
    });
    const jobsInTargetColumn = await JobApplication.find({ 
        columnId: newColumnId,
         _id: { $ne: id },
    }).sort({ order: 1 }).lean();
    
  let newOrderValue: number;
    if (order !== undefined && order !== null) {
        newOrderValue = order * 100;
     const jobsThatNeedToShift = jobsInTargetColumn.slice(order);   
     for (const job of jobsThatNeedToShift) {
        await JobApplication.findByIdAndUpdate(job._id, {
            $set: { order: job},
        });
     }
   } else {
    if (jobsInTargetColumn.length > 0) {
    const lastJobOrder = 
    jobsInTargetColumn[jobsInTargetColumn.length - 1].order || 0;
    newOrderValue = lastJobOrder + 100;
    } else {
        newOrderValue = 0;
    }
    }
    updatesToApply.columnId = newColumnId;
    updatesToApply.order = newOrderValue;
   
   await JobApplication.findByIdAndUpdate(newColumnId, {
    $push: { jobApplications: id },
    });
} else if (order !== undefined && order !== null) {
    const otherJobsInColumn = await JobApplication.find({
        columnId: currentColumnId,
        _id: { $ne: id },
    }).sort({ order: 1 }).lean();
    const currentOrder = jobApplication.order || 0;
    const currentPositionIndex = otherJobsInColumn.findIndex((job) => job.order === currentOrder);
    const oldPositionIndex = 
    currentPositionIndex !== -1
     ? otherJobsInColumn.length 
     : currentPositionIndex;
     const newOrderValue = order * 100;

      if (order < oldPositionIndex) {
      const jobsToShiftDown = otherJobsInColumn.slice(order, oldPositionIndex);

      for (const job of jobsToShiftDown) {
        await JobApplication.findByIdAndUpdate(job._id, {
          $set: { order: job.order + 100 },
        });
      }
    } else if
     (order > oldPositionIndex) {
        const jobsToShiftUp = otherJobsInColumn.slice(oldPositionIndex, order);
        for (const job of jobsToShiftUp) {
            const newOrder = Math.max(0, job.order - 100);
            await JobApplication.findByIdAndUpdate(job._id, {
                $set: { order: newOrder},
            });
        }
} 
updatesToApply.order = newOrderValue;
}
const updated = await JobApplication.findByIdAndUpdate(id, updatesToApply, { new: true });
revalidatePath("/dashboard");
return { data: JSON.parse(JSON.stringify(updated)) };
}
  export async function deleteJobApplication(id: string) {
    const session = await getSession();
    if (!session?.user) {
        return { error: "Unauthorized" };
    }
    const jobApplication = await JobApplication.findById(id);
    if (!jobApplication) {
        return { error: "Job application not found" };
    }
    if (jobApplication.userId.toString() !== session.user.id) {
        return { error: "Unauthorized" };
    }
    await Column.findByIdAndUpdate(jobApplication.columnId, {
        $pull: { jobApplications: id },
    });
    await JobApplication.deleteOne({ _id: id });
    revalidatePath("/dashboard");
    return { data: "Job application deleted" };
}
