import { UsuarioRepository } from '../data/UsuarioRepository.js';
import type { Usuario } from '../models/Usuario.js';
export class UsuarioService {
    private readonly usuarioRepository = new UsuarioRepository();

    async listarUsuarios(): Promise<Usuario[]> {
        return await this.usuarioRepository.obtenerUsuarios();
    }

    async crearUsuario(usuario: Usuario): Promise<boolean> {
        try {
            const usuarios = await this.usuarioRepository.obtenerUsuarios();
            const existeUsuario = usuarios.some(u => u.id === usuario.id || u.correo === usuario.correo);

            if (existeUsuario) {
                console.log("El usuario ya existe.");
                return false;
            }

            usuarios.push(usuario);
            await this.usuarioRepository.guardarUsuarios(usuarios);

            console.log("Usuario creado exitosamente:", usuario);
            return true;
        } catch (error) {
            console.log("Error al crear el usuario:", error);
            return false;
        }
    }

    async registrarUsuario(usuario: Usuario): Promise<boolean> {
        return await this.crearUsuario(usuario);
    }

    async buscarUsuarioPorId(id: number): Promise<Usuario | undefined> {
        const usuarios = await this.usuarioRepository.obtenerUsuarios();
        return usuarios.find(u => u.id === id);
    }

    async buscarUsuarioPorCorreo(correo: string): Promise<Usuario | undefined> {
        const usuarios = await this.usuarioRepository.obtenerUsuarios();
        return usuarios.find(u => u.correo === correo);
    }

    async actualizarUsuario(usuario: Usuario): Promise<boolean> {
        try {
            const usuarios = await this.usuarioRepository.obtenerUsuarios();
            const indice = usuarios.findIndex(u => u.id === usuario.id);

            if (indice === -1) {
                console.log("El usuario no existe.");
                return false;
            }

            usuarios[indice] = usuario;
            await this.usuarioRepository.guardarUsuarios(usuarios);
            console.log("Usuario actualizado exitosamente:", usuario);
            return true;
        } catch (error) {
            console.log("Error al actualizar el usuario:", error);
            return false;
        }
    }

    async eliminarUsuario(id: number): Promise<boolean> {
        try {
            const usuarios = await this.usuarioRepository.obtenerUsuarios();
            const nuevosUsuarios = usuarios.filter(u => u.id !== id);

            if (nuevosUsuarios.length === usuarios.length) {
                console.log("El usuario no existe.");
                return false;
            }

            await this.usuarioRepository.guardarUsuarios(nuevosUsuarios);
            console.log("Usuario eliminado exitosamente. ID:", id);
            return true;
        } catch (error) {
            console.log("Error al eliminar el usuario:", error);
            return false;
        }
    }
}