import { Model, Column, Table, HasMany, DataType, PrimaryKey } from 'sequelize-typescript';
import KanbanColumn from './KanbanColumn';

@Table
class Project extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    projectId!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @HasMany(() => KanbanColumn, { foreignKey: 'projectId' })
    columns!: KanbanColumn[];
}


export default Project;
