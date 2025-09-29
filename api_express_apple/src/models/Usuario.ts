import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "usuario" })
export class Usuario extends Model {
  @Column({
    type: DataType.STRING(10),
    primaryKey: true,
    allowNull: false,
    field: "cod_usuario",
  })
  declare cod_usuario: string;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
    field: "nombre_usuario",
  })
  declare nombre_usuario: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    field: "contraseña",
  })
  declare contraseña: string;

  @Column({
    type: DataType.TINYINT,
    allowNull: false,
    field: "tipo_usuario", // 0 = cliente, 1 = admin
  })
  declare tipo_usuario: number;
}

export default Usuario;
