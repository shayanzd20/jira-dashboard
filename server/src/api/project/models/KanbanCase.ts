import { Model, Column, Table, ForeignKey, DataType, BelongsTo, PrimaryKey } from 'sequelize-typescript';
import KanbanColumn from './KanbanColumn';

@Table
class KanbanCase extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    caseId!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    title!: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    position!: number;

    @ForeignKey(() => KanbanColumn)
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    columnId!: string;

    @BelongsTo(() => KanbanColumn, { foreignKey: 'columnId' })
    column!: KanbanColumn;
}


export default KanbanCase;
