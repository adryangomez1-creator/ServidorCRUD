export function validarTextoNoVacio(valor: string): string | undefined {
    if (!valor.trim()) {
        return "Este campo es obligatorio.";
    }

    return undefined;
}

export function validarCorreo(correo: string): string | undefined {
    const error = validarTextoNoVacio(correo);

    if (error) {
        return error;
    }

    const dominioPermitido = /@(gmail|outlook|hotmail)\.com$/i;

    if (!dominioPermitido.test(correo)) {
        return "Solo se permiten correos con dominio gmail.com, outlook.com o hotmail.com.";
    }

    return undefined;
}

export function validarNumeroPositivo(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    const numero = Number(valor);

    if (Number.isNaN(numero) || numero <= 0) {
        return "Debe ingresar un número mayor a cero.";
    }

    return undefined;
}

export function validarEdad(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    const edad = Number(valor);

    if (Number.isNaN(edad) || edad <= 0 || edad > 120) {
        return "La edad debe ser un número entre 1 y 120.";
    }

    return undefined;
}

export function validarContrasena(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    if (valor.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    return undefined;
}

export function validarPrecio(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    const precio = Number(valor);

    if (Number.isNaN(precio) || precio <= 0) {
        return "El precio debe ser mayor a cero.";
    }

    return undefined;
}

export function validarStock(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    const stock = Number(valor);

    if (Number.isNaN(stock) || stock < 0) {
        return "El stock no puede ser negativo.";
    }

    return undefined;
}

export function validarCantidad(valor: string): string | undefined {
    const error = validarTextoNoVacio(valor);

    if (error) {
        return error;
    }

    const cantidad = Number(valor);

    if (Number.isNaN(cantidad) || cantidad <= 0) {
        return "La cantidad debe ser mayor a cero.";
    }

    return undefined;
}

export function validarEstadoPedido(valor: string): string | undefined {
    const estados = ["PENDIENTE", "EN_PROCESO", "ENTREGADO", "CANCELADO"];

    if (!estados.includes(valor.toUpperCase())) {
        return "Estado inválido. Use PENDIENTE, EN_PROCESO, ENTREGADO o CANCELADO.";
    }

    return undefined;
}
