import { createServer } from "http";
import { routes } from "../router/Router.js";

export function iniciarServidor() {
    const servidor = createServer(async (req, res) => {
        await routes(req, res);
    });

    const puertoInicial = Number(process.env.PORT ?? 3000);
    let puertoActual = puertoInicial;

    const intentarEscuchar = () => {
        servidor.once("error", (error: NodeJS.ErrnoException) => {
            if (error.code === "EADDRINUSE") {
                const siguientePuerto = puertoActual === 3000 ? 3001 : puertoActual + 1;
                console.warn(`Puerto ${puertoActual} ocupado. Intentando ${siguientePuerto}...`);
                puertoActual = siguientePuerto;
                intentarEscuchar();
                return;
            }

            throw error;
        });

        servidor.listen(puertoActual, () => {
            console.log("\n=====================");
            console.log("Servidor Iniciado");
            console.log(`http://localhost:${puertoActual}`);
            console.log("=====================");
        });
    };

    intentarEscuchar();
}