import express, { Request, Response, type Router } from 'express';

import Project from './models/Project';
import KanbanColumn from './models/KanbanColumn';
import KanbanCase from './models/KanbanCase';

export const router: Router = express.Router();

// Get all projects, including associated KanbanColumns and KanbanCases
router.get('/', async (req: Request, res: Response) => {
    try {
         const projects = await Project.findAll({
            include: [
                {
                    model: KanbanColumn,  
                    include: [
                        {
                            model: KanbanCase, 
                        }
                    ]
                }
            ],
            order: [
                [{ model: KanbanColumn, as: 'columns' }, 'position', 'ASC'], 
                [{ model: KanbanColumn, as: 'columns' }, { model: KanbanCase, as: 'cases' }, 'position', 'ASC'],
            ],
            logging: console.log, // Log the SQL query for debugging
        });

        res.json(projects[0]);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Add a new project
router.post('/', async (req: Request, res: Response) => {
    try {

        const { projectId, name, columns } = req.body.project;

        let project = await Project.findByPk(projectId, {
            include: [
                {
                    model: KanbanColumn,
                    include: [
                        {
                            model: KanbanCase,
                            order: [['position', 'ASC']],
                        }
                    ],
                    order: [['position', 'ASC']],
                }
            ],
            logging: console.log, // This logs the raw SQL query for debugging
        });
        

        if (project) {
            await project.update({ name });
            for (const columnData of columns) {
                let column = await KanbanColumn.findOne({ where: { columnId: columnData.columnId, projectId: project?.dataValues?.projectId } });
                if (column) {
                    await column.update(columnData);
                    for (const caseData of columnData.cases) {
                        console.log('caseData :>> ', caseData);
                        let kanbanCase = await KanbanCase.findOne({ where: { caseId: caseData.caseId } });
                        if (kanbanCase) {
                            if(kanbanCase?.dataValues?.columnId !== columnData.columnId){
                                caseData.columnId = columnData.columnId;
                                await kanbanCase.update(caseData);
                            }else{
                                if(kanbanCase?.dataValues?.position !== caseData.position){
                                    await kanbanCase.update(caseData);
                                }
                            }
                        } else {
                            await KanbanCase.create({ ...caseData, columnId: column?.dataValues?.columnId });
                        }
                    }
                } else {
                    await KanbanColumn.create({ ...columnData, projectId: project?.dataValues?.projectId });
                }
            }

            project = await Project.findByPk(projectId, {
                include: [
                    {
                        model: KanbanColumn,
                        include: [
                            {
                                model: KanbanCase,
                                order: [['position', 'ASC']],
                            }
                        ],
                        order: [['position', 'ASC']],
                    }
                ],
            });

            res.json(project);
        } else {

            project = await Project.create(
                { projectId, name, columns },
                {
                    include: [KanbanColumn], 
                }
            );

            for (const columnData of columns) {
                for (const caseData of columnData.cases) {
                    await KanbanCase.create({ ...caseData, columnId: columnData.columnId });
                }
            }

            project = await Project.findByPk(projectId, {
                include: [
                    {
                        model: KanbanColumn,
                        include: [
                            {
                                model: KanbanCase,
                                order: [['position', 'ASC']], // Order cases by position
                            }
                        ],
                        order: [['position', 'ASC']], // Order columns by position
                    }
                ]
            });
            
            res.json(project);
        }
    } catch (err) {
        console.log('err :>> ', err);
        res.status(500).json({ error: 'Failed to create project' });
    }
});



// Get a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: {
                model: KanbanColumn,
                include: [KanbanCase], // Include cases in each column
            },
        });
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// Update a project (Add or edit columns/cases)
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.update(req.body);
            res.json(project);
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});


// Delete a project
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (project) {
            await project.destroy();
            res.json({ message: 'Project deleted' });
        } else {
            res.status(404).json({ error: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

export default router;
