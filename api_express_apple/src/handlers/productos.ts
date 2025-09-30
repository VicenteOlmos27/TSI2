import { Request, Response } from "express"
import Producto from "../models/Producto"
import Categoria from "../models/Categoria"
import { Op } from "sequelize"

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
export const agregarProductos = async (request: Request, response: Response) => {
  try {
    const { nombre, descripcion, precioUnitario, stock, imagen, codCategoria } = request.body;

    // Validación básica
    if (!nombre || !codCategoria) {
      return response.status(400).json({ error: "El nombre y codCategoria son obligatorios" });
    }

    if (precioUnitario < 0 || stock < 0) {
      return response.status(400).json({ error: "El precio y el stock no pueden ser negativos" });
    }

    
// Buscar el último producto con código válido
const ultimoProducto = await Producto.findOne({
  where: {
    codProducto: {
      [Op.like]: "PROD%",
    },
  },
  order: [["codProducto", "DESC"]],
});

// Generar nuevo código
let nuevoCodigo = "PROD01";
if (ultimoProducto && typeof ultimoProducto.codProducto === "string") {
  const match = ultimoProducto.codProducto.match(/^PROD(\d+)$/);
  if (match) {
    const codigoNum = parseInt(match[1]);
    const nuevoNum = codigoNum + 1;
    nuevoCodigo = "PROD" + nuevoNum.toString().padStart(2, "0");
  } else {
    // Si el formato no es válido, buscar el número más alto manualmente
    const productos = await Producto.findAll({
      where: {
        codProducto: {
          [Op.like]: "PROD%",
        },
      },
    });

    const numeros = productos
      .map(p => parseInt(p.codProducto.replace("PROD", "")))
      .filter(n => !isNaN(n));

    const maxNum = Math.max(...numeros, 0);
    nuevoCodigo = "PROD" + (maxNum + 1).toString().padStart(2, "0");
  }
}


    // Crear el producto
    const productoNuevo = await Producto.create({
      codProducto: nuevoCodigo,
      nombre,
      descripcion,
      precioUnitario,
      stock,
      imagen,
      codCategoria,
    });

    response.status(201).json({ data: productoNuevo });
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    response.status(500).json({
      error: "Error al crear producto",
      detalle: error.message,
      errores: error.errors || null,
    });
  }
};



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
