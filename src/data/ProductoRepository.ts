import { readFile, writeFile } from "node:fs/promises";
import type { Producto } from "../models/Producto.js";

export class ProductoRepository {
    private ruta = "src/data/productos.json";

    async obtenerProductos(): Promise<Producto[]> {
        try {
            const datos = await readFile(this.ruta, "utf-8");
            const productos = JSON.parse(datos);

            if (Array.isArray(productos)) {
                return productos as Producto[];
            }

            return productos ? [productos as Producto] : [];
        } catch (error) {
            return [];
        }
    }

    async guardarProductos(productos: Producto[]): Promise<void> {
        try {
            await writeFile(this.ruta, JSON.stringify(productos, null, 4));
        } catch (error) {
            console.log("Error al guardar los productos:", error);
            throw error;
        }
    }
}
