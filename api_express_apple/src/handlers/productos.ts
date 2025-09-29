import { Request, Response } from "express"
import Producto from "../models/Producto"
import Categoria from "../models/Categoria"

//MUESTRA TODOS LOS PRODUCTOS
export const getProductos = async(request:Request, response:Response)=>{
    const productos = await Producto.findAll()
    response.json({ data: productos })
}

//MUESTRA LOS PRODUCTOS INDICANDO LA CATEGORIA DE CADA UNO
export const getProductosConCantidadProductos = async(request:Request, response:Response)=>{
    const productos = await Producto.findAll({
        attributes: {exclude: ["imagen"]},
        include: [{
            model: Categoria,
            attributes: ["nombre"],
        },],
    })
    response.json({ data:productos})
}

//MUESTRA INFO DEL PRODUCTO SEGUN SU ID
export const getProductoById = async(request:Request, response:Response)=>{
    const {cod_producto} = request.params
    const productos = await Producto.findByPk(cod_producto)
    response.json({ data: productos})
}

//AGREGA PRODUCTOS
export const agregarProductos = async(request:Request, response:Response)=>{
    try {
    const { nombre, descripcion, precioUnitario, stock, imagen, codCategoria } = request.body;

    if (!nombre || !codCategoria) {
      return response.status(400).json({ error: "El nombre y codCategoria son obligatorios" });
    }

    // 1️⃣ Buscamos el último producto creado
    const ultimoProducto = await Producto.findOne({
      order: [["codProducto", "DESC"]],
    });

    // 2️⃣ Generamos el nuevo código
    let nuevoCodigo = "PROD01";
    if (ultimoProducto) {
      const codigoNum = parseInt(ultimoProducto.codProducto.replace("PROD", ""));
      const nuevoNum = codigoNum + 1;
      nuevoCodigo = "PROD" + nuevoNum.toString().padStart(2, "0");
    }

    // 3️⃣ Creamos el producto
    const productoNuevo = await Producto.create({
      codProducto: nuevoCodigo,
      nombre,
      descripcion,
      precioUnitario,
      stock,
      imagen,
      codCategoria,
    });

    response.json({ data: productoNuevo });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Error al crear producto" });
  }
}

//EDITA PRODUCTOS
export const editarProductos = async(request:Request, response:Response)=>{
    const {cod_producto} = request.params
    const producto = await Producto.findByPk(cod_producto)
    await producto.update(request.body)
    await producto.save()
    response.json({ data: producto})
}

//BORRA PRODUCTOS
export const borrarProductos = async (request: Request, response: Response) => {
  const { cod_producto } = request.params;

  const producto = await Producto.findOne({
    where: { codProducto: cod_producto },
  });

  if (!producto) {
    return response.status(404).json({ error: "Producto no encontrado" });
  }

  await producto.destroy();
  response.json({ data: "Producto Borrado" });
};
