import type { Estado } from "./Estado.js";
export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    estado: Estado;
    direccion: string;
    telefono: number;
}