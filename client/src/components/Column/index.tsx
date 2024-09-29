import React, { useEffect, useState } from 'react';
import { FaEdit, FaEllipsisV } from 'react-icons/fa'; 
import { Droppable } from 'react-beautiful-dnd';
import { ColumnProps } from '../../interfaces'
import CaseCard from '../CaseCard';
import './style.css';

const Column: React.FC<ColumnProps> = ({ column, sortColumn, updateColumnTitle, deleteColumn, addCaseToColumn }) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(column.name);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    console.log('column :>> ', column);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleSaveTitle = () => {
        updateColumnTitle(column.columnId, newTitle);
        setIsEditing(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!event.target) return;

        // Check if the clicked element is not inside the dropdown menu
        if (!(event.target as HTMLElement).closest('.dropdown-menu')) {
            setIsMenuOpen(false);
        }
    };

    useEffect(() => {
        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);
    
    return (
        <div className="column">
            <div className="column-header">
                {isEditing ? (
                    <div>
                        <input 
                            type="text" 
                            value={newTitle} 
                            onChange={handleTitleChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveTitle();
                            }}
                        />
                        <button onClick={handleSaveTitle}>Save</button>
                    </div>
                ) : (
                    <div className="column-title">
                        <h3>{column.name}</h3>
                        <button onClick={() => setIsEditing(true)} className="edit-button">
                            <FaEdit />
                        </button>
                    </div>
                )}
                 {/* Icon Button with Dropdown */}
                 <div className="column-menu">
                    <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <FaEllipsisV />
                    </button>
                    {isMenuOpen && (
                        <div className="dropdown-menu">
                            <button onClick={() => { sortColumn(column.columnId); setIsMenuOpen(false); }}>
                                Sort by Title
                            </button>
                            <button onClick={() => { deleteColumn(column.columnId); setIsMenuOpen(false); }}>
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Droppable droppableId={column.columnId}>
                {(provided) => (
                    <div 
                    {...provided.droppableProps}
                    ref={provided.innerRef} 
                    className="case-list" 
                    >
                        {column.cases.map((caseItem, index) => {
                            console.log('caseItem, index in Column:>> ', caseItem, index);
                            return(
                            <CaseCard key={caseItem.caseId} caseItem={caseItem} index={index} />
                        )})}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            {/* Create Case Button */}
            <button className="create-case-button" onClick={() => addCaseToColumn(column.columnId)}>
                + Create Case
            </button>
        </div>
    );
};

export default Column;
