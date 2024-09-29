import { Model, Column, Table, ForeignKey, HasMany,DataType, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import Project from './Project';
import KanbanCase from './KanbanCase';

@Table
class KanbanColumn extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true
    })
    columnId!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    name!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    position!: number;

    @ForeignKey(() => Project)
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    projectId!: string;

    @BelongsTo(() => Project, { foreignKey: 'projectId' })
    project!: Project;

    @HasMany(() => KanbanCase, { foreignKey: 'columnId' })
    cases!: KanbanCase[];
}


export default KanbanColumn;
