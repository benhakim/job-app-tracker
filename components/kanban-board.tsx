"use client";

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import {
  Award,
  Calendar,
  CheckCircle2,
  Mic,
  MoreHorizontal,
  MoreVertical,
  Trash2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import CreateJobApplicationDialog from "./create-job-dialog";
import jobApplication from "@/lib/models/job.application";
import JobApplicationCard from "./job-application-card";
import { useBoards } from "@/lib/hooks/useBoards";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}
interface ColConfig {
  color: string;
  icon: React.ReactNode;
}
const COLUMN_CONFIG: Array<ColConfig> = [
  {
    color: "bg-cyan-500",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    color: "bg-purple-500",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    color: "bg-green-500",
    icon: <Mic className="h-4 w-4" />,
  },
  {
    color: "bg-yellow-500",
    icon: <Award className="h-4 w-4" />,
  },
  {
    color: "bg-red-500",
    icon: <XCircle className="h-4 w-4" />,
  },
];

function DroppableColumn({
  column,
  config,
  boardId,
  sortedColumns,
}: {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}) {
  const sortedJobs = column.jobApplications?.sort((a, b) => a.order - b.order) || [];
  return (
    <Card className="min-w-75 shrink-0 shadow-md p-0">
      <CardHeader className={`${config.color} text-white rounded-t-lg
        pb-3 pt-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {config.icon}
            <CardTitle className="text-white text-base font-semibold">
              {column.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-6 w-6 text-white hover:bg-white/20"
               variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-destructive">
                <Trash2 />
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent    className={`space-y-2 pt-4 bg-gray-50/50 min-h-100px rounded-b-lg
       ${column._id === "new" ? "ring-2 ring-blue-500" : ""}`}>
        {sortedJobs.map((job, key) => (
          <SortableJobCard job={{...job, columnId: job.columnId || column._id}}   key={key}
          columns={sortedColumns} />
        ))}

     <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </CardContent>
    </Card>
  );
}
function SortableJobCard({job, columns}: {job: JobApplication, columns: Column[]}) {
  return (
   <div>
    <JobApplicationCard job={job} columns={columns} />
  </div>
  )
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const { columns, moveJob } = useBoards(board);
  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];
  return (
    <div className="space-y-6">
      {sortedColumns.map((col, key) => {
        const config = COLUMN_CONFIG[key] || {
          color: "bg-gray-500",
          icon: <Calendar className="h-4 w-4" />,
        };
        return (
          <DroppableColumn
            key={key}
            column={col}
            config={config}
            boardId={board._id}
            sortedColumns={sortedColumns}
          />
        );
      })}
    </div>
  );
}
