export interface Project {
    projectId: string;
    name: string;
    columns: KanbanColumn[];
}

export interface KanbanColumn {
    columnId: string;
    name: string;
    position: number;
    cases: Case[];
}

export interface Case {
    caseId: string;
    title: string;
    progress: number;
    position: number;
    updatedAt: string;
}

export interface CaseCardProps {
    caseItem: Case;
    index: number;
}

export interface ColumnProps {
    column: KanbanColumn;
    sortColumn: (columnId: string) => void;
    updateColumnTitle: (columnId: string, newTitle: string) => void;
    deleteColumn: (columnId: string) => void;
    addCaseToColumn: (columnId: string) => void;
}
