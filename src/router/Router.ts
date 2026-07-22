import { IncomingMessage, ServerResponse } from "http";
import { ProductoService } from "../services/ProductoService.js";
import { UsuarioService } from "../services/UsuarioService.js";

const usuarioService = new UsuarioService();
const productoService = new ProductoService();

function responder(res: ServerResponse, statusCode: number, payload: unknown, headers: Record<string, string> = {}) {
    res.writeHead(statusCode, { "Content-Type": "application/json", ...headers });
    res.end(JSON.stringify(payload));
}

function esContentTypeJson(req: IncomingMessage): boolean {
    const contentType = req.headers["content-type"];
    return typeof contentType === "string" && contentType.toLowerCase().includes("application/json");
}

async function leerCuerpo(req: IncomingMessage): Promise<Record<string, unknown>> {
    const chunks: Buffer[] = [];

    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const texto = Buffer.concat(chunks).toString("utf-8").trim();

    if (!texto) {
        return {};
    }

    try {
        return JSON.parse(texto) as Record<string, unknown>;
    } catch {
        throw new SyntaxError("JSON inválido");
    }
}

function extraerId(pathname: string): number | null {
    const partes = pathname.split("/").filter(Boolean);

    if (partes.length !== 2) {
        return null;
    }

    const id = Number(partes[1]);
    return Number.isNaN(id) ? null : id;
}

export async function routes(req: IncomingMessage, res: ServerResponse) {
    res.setHeader("Content-Type", "application/json");

    const url = req.url ?? "/";
    const metodo = req.method ?? "";
    const parsedUrl = new URL(url, "http://localhost");
    const pathname = parsedUrl.pathname;

    try {
        if (pathname === "/usuarios" || pathname === "/usuarios/post") {
            if (metodo === "GET") {
                const usuarios = await usuarioService.listarUsuarios();
                responder(res, 200, usuarios);
                return;
            }

            if (metodo === "POST") {
                if (!esContentTypeJson(req)) {
                    responder(res, 415, { message: "Content-Type incorrecto. Se requiere application/json." });
                    return;
                }

                let usuario: Record<string, unknown>;
                try {
                    usuario = await leerCuerpo(req);
                } catch {
                    responder(res, 400, { message: "JSON inválido." });
                    return;
                }

                if (!Object.keys(usuario).length) {
                    responder(res, 400, { message: "Body vacío. Se requiere un JSON válido." });
                    return;
                }

                const creado = await usuarioService.crearUsuario(usuario as never);

                if (creado) {
                    responder(res, 201, { message: "Usuario agregado correctamente." });
                } else {
                    responder(res, 409, { message: "El usuario ya existe o no pudo registrarse." });
                }

                return;
            }

            responder(res, 405, { message: "Método no permitido. Use GET o POST." }, { Allow: "GET, POST" });
            return;
        }

        if (pathname.startsWith("/usuarios/")) {
            const id = extraerId(pathname);

            if (id === null) {
                responder(res, 400, { message: "Debe proporcionar un ID válido." });
                return;
            }

            if (metodo === "GET") {
                const usuario = await usuarioService.buscarUsuarioPorId(id);

                if (!usuario) {
                    responder(res, 404, { message: "Usuario no encontrado." });
                } else {
                    responder(res, 200, usuario);
                }

                return;
            }

            if (metodo === "PUT") {
                if (!esContentTypeJson(req)) {
                    responder(res, 415, { message: "Content-Type incorrecto. Se requiere application/json." });
                    return;
                }

                let datos: Record<string, unknown>;
                try {
                    datos = await leerCuerpo(req);
                } catch {
                    responder(res, 400, { message: "JSON inválido." });
                    return;
                }

                if (!Object.keys(datos).length) {
                    responder(res, 400, { message: "Body vacío. Se requiere un JSON válido." });
                    return;
                }

                const actualizado = await usuarioService.actualizarUsuario({ ...datos, id } as never);

                if (!actualizado) {
                    responder(res, 404, { message: "Usuario no encontrado." });
                } else {
                    responder(res, 200, { message: "Usuario actualizado correctamente." });
                }

                return;
            }

            if (metodo === "DELETE") {
                const eliminado = await usuarioService.eliminarUsuario(id);

                if (eliminado) {
                    responder(res, 200, { message: "Usuario eliminado correctamente." });
                } else {
                    responder(res, 404, { message: "Usuario no encontrado." });
                }

                return;
            }

            responder(res, 405, { message: "Método no permitido. Use GET, PUT o DELETE." }, { Allow: "GET, PUT, DELETE" });
            return;
        }

        if (pathname === "/productos") {
            if (metodo === "GET") {
                const productos = await productoService.listarProductos();
                responder(res, 200, productos);
                return;
            }

            if (metodo === "POST") {
                if (!esContentTypeJson(req)) {
                    responder(res, 415, { message: "Content-Type incorrecto. Se requiere application/json." });
                    return;
                }

                let producto: Record<string, unknown>;
                try {
                    producto = await leerCuerpo(req);
                } catch {
                    responder(res, 400, { message: "JSON inválido." });
                    return;
                }

                if (!Object.keys(producto).length) {
                    responder(res, 400, { message: "Body vacío. Se requiere un JSON válido." });
                    return;
                }

                const creado = await productoService.crearProducto(producto);

                if (creado === "created") {
                    responder(res, 201, { message: "Producto agregado correctamente." });
                } else if (creado === "duplicate") {
                    responder(res, 409, { message: "El producto ya existe." });
                } else if (creado === "invalid") {
                    responder(res, 400, { message: "Producto inválido. Verifique el esquema y los campos requeridos." });
                } else {
                    responder(res, 500, { message: "No se pudo crear el producto." });
                }

                return;
            }

            responder(res, 405, { message: "Método no permitido. Use GET o POST." }, { Allow: "GET, POST" });
            return;
        }

        if (pathname.startsWith("/productos/")) {
            const id = extraerId(pathname);

            if (id === null) {
                responder(res, 400, { message: "Debe proporcionar un ID válido." });
                return;
            }

            if (metodo === "GET") {
                const producto = await productoService.buscarProductoPorId(id);

                if (!producto) {
                    responder(res, 404, { message: "Producto no encontrado." });
                } else {
                    responder(res, 200, producto);
                }

                return;
            }

            if (metodo === "PUT") {
                if (!esContentTypeJson(req)) {
                    responder(res, 415, { message: "Content-Type incorrecto. Se requiere application/json." });
                    return;
                }

                let datos: Record<string, unknown>;
                try {
                    datos = await leerCuerpo(req);
                } catch {
                    responder(res, 400, { message: "JSON inválido." });
                    return;
                }

                if (!Object.keys(datos).length) {
                    responder(res, 400, { message: "Body vacío. Se requiere un JSON válido." });
                    return;
                }

                const resultado = await productoService.actualizarProducto({ ...datos, id });

                if (resultado === "updated") {
                    responder(res, 200, { message: "Producto actualizado correctamente." });
                } else if (resultado === "not_found") {
                    responder(res, 404, { message: "Producto no encontrado." });
                } else if (resultado === "invalid") {
                    responder(res, 400, { message: "Producto inválido. Verifique el esquema y los campos requeridos." });
                } else {
                    responder(res, 500, { message: "No se pudo actualizar el producto." });
                }

                return;
            }

            if (metodo === "DELETE") {
                const eliminado = await productoService.eliminarProducto(id);

                if (eliminado) {
                    responder(res, 200, { message: "Producto eliminado correctamente." });
                } else {
                    responder(res, 404, { message: "Producto no encontrado." });
                }

                return;
            }

            responder(res, 405, { message: "Método no permitido. Use GET, PUT o DELETE." }, { Allow: "GET, PUT, DELETE" });
            return;
        }

        responder(res, 404, { message: "Ruta no encontrada." });
    } catch (error) {
        console.error("Error en el manejo de la solicitud:", error);
        responder(res, 500, { message: "Error interno del servidor." });
    }
}
   