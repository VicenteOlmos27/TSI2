
import { Request, Response } from "express";
import Pedido from "../models/Pedido";
import { Op } from "sequelize";

// MOSTRAR TODOS LOS PEDIDOS ACTIVOS
export const getPedidosActivos = async (request: Request, response: Response) => {
  const pedidos = await Pedido.findAll({ where: { estado: 1 } });
  response.json({ data: pedidos });
};

// MOSTRAR TODOS LOS PEDIDOS ENTREGADOS
export const getPedidosEntregados = async (request: Request, response: Response) => {
  const pedidos = await Pedido.findAll({ where: { estado: 0 } });
  response.json({ data: pedidos });
};

// BUSCAR PEDIDO POR CÓDIGO
export const getPedidoById = async (request: Request, response: Response) => {
  const { cod_pedido } = request.params;
  const pedido = await Pedido.findByPk(cod_pedido);
  if (!pedido) {
    return response.status(404).json({ error: "Pedido no encontrado" });
  }
  response.json({ data: pedido });
};

// CREAR UN NUEVO PEDIDO
export const crearPedido = async (request: Request, response: Response) => {
  const {
    cod_pedido,
    fecha,
    estado,
    total,
    comprobante,
    empresa_envio,
    fecha_envio,
    fecha_entrega,
  } = request.body;

  try {
    const nuevoPedido = await Pedido.create({
      cod_pedido,
      fecha,
      estado,
      total,
      comprobante,
      empresa_envio,
      fecha_envio,
      fecha_entrega,
    });

    response.status(201).json({ message: "Pedido creado", data: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    response.status(500).json({ error: "Error interno del servidor" });
  }
};

// REGISTRAR ENVÍO
export const registrarEnvio = async (request: Request, response: Response) => {
  const { cod_pedido } = request.params;
  const { empresa_envio } = request.body;

  const pedido = await Pedido.findByPk(cod_pedido);
  if (!pedido) {
    return response.status(404).json({ error: "Pedido no encontrado" });
  }

  pedido.empresa_envio = empresa_envio;
  pedido.fecha_envio = new Date();
  await pedido.save();

  response.json({ message: "Envío registrado", data: pedido });
};

// REGISTRAR ENTREGA
export const registrarEntrega = async (request: Request, response: Response) => {
  const { cod_pedido } = request.params;

  const pedido = await Pedido.findByPk(cod_pedido);
  if (!pedido) {
    return response.status(404).json({ error: "Pedido no encontrado" });
  }

  pedido.fecha_entrega = new Date();
  pedido.estado = 0; // ENTREGADO
  await pedido.save();

  response.json({ message: "Entrega registrada", data: pedido });
};

// ELIMINAR PEDIDO
export const borrarPedido = async (request: Request, response: Response) => {
  const { cod_pedido } = request.params;

  const pedido = await Pedido.findByPk(cod_pedido);
  if (!pedido) {
    return response.status(404).json({ error: "Pedido no encontrado" });
  }

  await pedido.destroy();
  response.json({ message: "Pedido eliminado" });
};
