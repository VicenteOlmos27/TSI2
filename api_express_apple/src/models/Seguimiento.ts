import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import Pedido from "./Pedido"; 

@Table({ tableName: "seguimiento" })
class Seguimiento extends Model {
    @Column({ 
        type: DataType.STRING(10), 
        primaryKey: true, 
        allowNull: false, 
        field: "nro_seguimiento" 
    })
    declare nroSeguimiento: string;

    @ForeignKey(() => Pedido)
    @Column({ 
        type: DataType.STRING(20), 
        allowNull: false, 
        field: "cod_pedido" 
    })
    declare codPedido: string;

    @Column({ 
        type: DataType.DATE, 
        allowNull: false, 
        field: "fecha_cambio" 
    })
    declare fechaCambio: Date;

    @Column({ 
        type: DataType.BOOLEAN, 
        allowNull: false, 
        field: "estado" 
    })
    declare estado: boolean;

    // Relación con la tabla Pedido
    @BelongsTo(() => Pedido)
    declare pedido: Pedido;
}

export default Seguimiento;