import { API_CONFIG } from "@/config/api.config";
import { IRespuestaConsultaFactura } from "@/types/IRespuestaConsultaFactura";
import { IRespuestaPrefijo } from "@/types/IRespuestaPrefijo";

export const PortalService = {
    async getFacturas(fechaInicial: string, fechaFinal: string, idMetodoDian: number, prefijo: string): Promise<IRespuestaConsultaFactura[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.FACTURA_LISTA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ fechaInicial: fechaInicial, fechaFinal: fechaFinal, idMetodoDian: idMetodoDian, prefijo: prefijo })
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar facturas lista');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en PortalService.getFacturas:', error);
            throw error;
        }
    },

    async getPrefijos(idMetodoDian: number): Promise<IRespuestaPrefijo[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.FACTURA_PREFIJOS),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idMetodoDian: idMetodoDian })
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar prefijos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en PortalService.getPrefijos:', error);
            throw error;
        }
    }
};