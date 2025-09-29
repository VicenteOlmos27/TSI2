import { useEffect, useState } from "react";
import { getProductos } from "../services/AllProductos";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err: any) {
        setError(err.message || "Error al cargar productos");
      }
    };

    cargarProductos();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Catálogo de Accesorios Apple</h2>

      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productos.map((producto: any, index: number) => (
          <div className="col" key={index}>
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{producto.nombre}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{producto.categoria}</h6>
                <p className="card-text">{producto.descripcion}</p>
                <p className="fw-bold">{producto.precio}</p>
                <button className="btn btn-dark w-100">Agregar al carrito</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}