import { readFile, writeFile } from "node:fs/promises";
import type { Usuario } from "../models/Usuario.js";

export class UsuarioRepository {
    private ruta = "src/data/usuarios.json";

    async obtenerUsuarios(): Promise<Usuario[]> {
        try {
            const datos = await readFile(this.ruta, "utf-8");
            const usuarios = JSON.parse(datos);

            if (Array.isArray(usuarios)) {
                return usuarios as Usuario[];
            }

            return usuarios ? [usuarios as Usuario] : [];
        } catch (error) {
            return [];
        }
    }

    async guardarUsuarios(usuarios: Usuario[]): Promise<void> {
        try {
            await writeFile(this.ruta, JSON.stringify(usuarios, null, 4));
        } catch (error) {
            console.log("Error al guardar los usuarios:", error);
            throw error;
        }
    }
}