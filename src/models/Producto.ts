import type { EstadoProducto } from "./EstadoProducto.js";
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    stock: number;
    categoria: string;
    descripcion: string;
    estado: EstadoProducto;
}
