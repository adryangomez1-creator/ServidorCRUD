import { ProductoRepository } from '../data/ProductoRepository.js';
import type { Producto } from '../models/Producto.js';

const ESTADOS_VALIDOS = ["EXISTENTE", "AGOTADO", "DESCONTINUADO"] as const;

type ProductoResultadoCrear = "created" | "duplicate" | "invalid" | "error";
type ProductoResultadoActualizar = "updated" | "not_found" | "invalid" | "error";

export class ProductoService {
    private readonly productoRepository = new ProductoRepository();

    async listarProductos(): Promise<Producto[]> {
        return await this.productoRepository.obtenerProductos();
    }

    private esProducto(obj: unknown): obj is Producto {
        if (!obj || typeof obj !== "object") {
            return false;
        }

        const producto = obj as Record<string, unknown>;
        return (
            typeof producto.id === "number" &&
            Number.isInteger(producto.id) &&
            producto.id > 0 &&
            typeof producto.nombre === "string" &&
            producto.nombre.trim().length > 0 &&
            typeof producto.precio === "number" &&
            Number.isFinite(producto.precio) &&
            producto.precio >= 0 &&
            typeof producto.stock === "number" &&
            Number.isInteger(producto.stock) &&
            producto.stock >= 0 &&
            typeof producto.categoria === "string" &&
            producto.categoria.trim().length > 0 &&
            typeof producto.descripcion === "string" &&
            producto.descripcion.trim().length > 0 &&
            typeof producto.estado === "string" &&
            ESTADOS_VALIDOS.includes(producto.estado as typeof ESTADOS_VALIDOS[number])
        );
    }

    async crearProducto(producto: unknown): Promise<ProductoResultadoCrear> {
        if (!this.esProducto(producto)) {
            console.log("Producto inválido recibido:", producto);
            return "invalid";
        }

        try {
            const productos = await this.productoRepository.obtenerProductos();
            const existeProducto = productos.some(p => p.id === producto.id);

            if (existeProducto) {
                console.log("El producto ya existe.");
                return "duplicate";
            }

            productos.push(producto);
            await this.productoRepository.guardarProductos(productos);
            console.log("Producto creado exitosamente:", producto);
            return "created";
        } catch (error) {
            console.log("Error al crear el producto:", error);
            return "error";
        }
    }

    async buscarProductoPorId(id: number): Promise<Producto | undefined> {
        const productos = await this.productoRepository.obtenerProductos();
        return productos.find(p => p.id === id);
    }

    async actualizarProducto(producto: unknown): Promise<ProductoResultadoActualizar> {
        if (!this.esProducto(producto)) {
            console.log("Producto inválido recibido para actualizar:", producto);
            return "invalid";
        }

        try {
            const productos = await this.productoRepository.obtenerProductos();
            const indice = productos.findIndex(p => p.id === producto.id);

            if (indice === -1) {
                console.log("El producto no existe.");
                return "not_found";
            }

            productos[indice] = producto;
            await this.productoRepository.guardarProductos(productos);
            console.log("Producto actualizado exitosamente:", producto);
            return "updated";
        } catch (error) {
            console.log("Error al actualizar el producto:", error);
            return "error";
        }
    }

    async eliminarProducto(id: number): Promise<boolean> {
        try {
            const productos = await this.productoRepository.obtenerProductos();
            const nuevosProductos = productos.filter(p => p.id !== id);

            if (nuevosProductos.length === productos.length) {
                console.log("El producto no existe.");
                return false;
            }

            await this.productoRepository.guardarProductos(nuevosProductos);
            console.log("Producto eliminado exitosamente. ID:", id);
            return true;
        } catch (error) {
            console.log("Error al eliminar el producto:", error);
            return false;
        }
    }
}
