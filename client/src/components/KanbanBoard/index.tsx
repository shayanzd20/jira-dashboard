import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult, Droppable, Draggable } from 'react-beautiful-dnd';
import { Project, ColumnProps, CaseCardProps } from '../../interfaces'
import { mockProject, generateRandomId } from '../../mocks/mockProject'
import Column from '../Column'
import axios from 'axios';
import './style.css';

// KanbanBoard Component
const KanbanBoard: React.FC = () => {
    const [project, setProject] = useState<Project | null>(null);
    const [sortedColumns, setSortedColumns] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
       
        axios.get<Project>('http://localhost:8080/api/v1/project') 
            .then(response => {
                setProject(response.data || mockProject)
            });
    }, []);

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination || !project) return;
    
        const { source, destination } = result;
    
        const updatedProject = { ...project };
        const sourceColumn = updatedProject.columns.find(col => col.columnId === source.droppableId);
        const destinationColumn = updatedProject.columns.find(col => col.columnId === destination.droppableId);
    
        if (!sourceColumn || !destinationColumn) return;
    
        const [movedCase] = sourceColumn.cases.splice(source.index, 1); // Remove case from source
    
        if (source.droppableId === destination.droppableId) {
          // Move within the same column
          sourceColumn.cases.splice(destination.index, 0, movedCase);
        } else {
          // Move between different columns
          destinationColumn.cases.splice(destination.index, 0, movedCase);
        }
    
        // Update the position for cases in the source column
        sourceColumn.cases.forEach((caseItem, index) => {
            caseItem.position = index;
        });

        // Update the position for cases in the destination column
        destinationColumn.cases.forEach((caseItem, index) => {
            caseItem.position = index;
        });

        setProject(updatedProject); 
      };

    const sortColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);

        if (column) {
            // Toggle the sorting state for this column
            const isSorted = sortedColumns[columnId];
            column.cases.sort((a, b) => {
                if (isSorted) return a.title.localeCompare(b.title); 
                return b.title.localeCompare(a.title); 
            });

            // Update the sorted state
            setSortedColumns({
                ...sortedColumns,
                [columnId]: !isSorted,
            });

            setProject(updatedProject);
        }
    };

    const updateColumnTitle = (columnId: string, newTitle: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);
        if (column) {
            column.name = newTitle;
            setProject(updatedProject); 
        }
    };

    const submitBoard = () => {
        if (!project) return;
    
        axios.post<Project>('http://localhost:8080/api/v1/project', {project: project})
            .then(response => {
                console.log('Project posted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error posting project:', error);
            });
    };

    const addColumn = () => {
        if (!project) return;

        // just to avoid make it ugly
        if(project.columns.length<8){
            const newColumn = {
                columnId: generateRandomId(), 
                name: `New Column ${project.columns.length + 1}`, 
                cases: [],
                position: project.columns.length
            };
    
            const updatedProject = {
                ...project,
                columns: [...project.columns, newColumn] 
            };
    
            setProject(updatedProject);
        }
    };

    const deleteColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = {
            ...project,
            columns: project.columns.filter(column => column.columnId !== columnId)
        };

        setProject(updatedProject);
    };

    const addCaseToColumn = (columnId: string) => {
        if (!project) return;

        const updatedProject = { ...project };
        const column = updatedProject.columns.find(col => col.columnId === columnId);
        
        if (column) {
            const newCase = {
                caseId: generateRandomId(),
                title: `Case ${column.cases.length + 1}`,
                progress: 0,
                position: column.cases.length,
                updatedAt: new Date().toISOString().split('T')[0]
            };
            column.cases.push(newCase);
        }

        setProject(updatedProject); 
    };

    return project ? (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                {project.columns.map((column) => (
                    <Column 
                        key={column.columnId} 
                        column={column} 
                        sortColumn={sortColumn} 
                        updateColumnTitle={updateColumnTitle} 
                        deleteColumn={deleteColumn}
                        addCaseToColumn={addCaseToColumn}
                    />
                ))}
                <div className="kanban-buttons">
                    <button className="kanban-sub-button" onClick={addColumn}>+</button> 
                    <button className="kanban-sub-button kanban-sub-button-wide" onClick={submitBoard}>submit</button> 
                </div>
                
            </div>
        </DragDropContext>
    ) : <p>Loading...</p>;
};

export default KanbanBoard;
