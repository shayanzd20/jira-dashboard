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
            logging: process.env.NODE_ENV === 'development' ? console.log : false, 
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
            logging: process.env.NODE_ENV === 'development' ? console.log : false, 
        });
        

        // other alternative that I found is to use bulkCreate to avoid mutiple queries to the data base 
        // we should always refactore our code base to optimize it

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

/**
 *
 * Hey there! 👋
 *
 * If you've stumbled upon this hidden gem, congratulations! 🎉
 * Building this application was a labor of love.
 *
 * Here are the important principles that we should always use:
 * 1. Make cool things. Do not implement the same code that u did at ur previous job. That code is boring, and u are not.
 *    Look look for new frameworks/libraries/icons/animations and use them
 *
 * 2. Refactor the code every 3-6 month. If you follow the 1st principle, u become cooler with a new day, and the code
 *    u wrote 3 months ago is already a pile of garbage. So refactor it and make it at least 2x faster
 *
 * 3. Do u know the 80-20 rule? Where 20% of effort yeilds 80% of output. Be 10x developer and focus only on the important parts
 *    that define fridge app. Making a thing work is better than making a thing pefect.
 *
 * Remember, code is a form of communication. Write it as if you're explaining your thoughts to the next person who will take over your work.
 * And finally, always have fun and stay curious. The joy of coding is in the journey, not just the destination.
 *
 * Happy coding! 🚀
 *
 * - Shayan Zeinali
 */
