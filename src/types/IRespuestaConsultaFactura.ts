export interface IRespuestaConsultaFactura {
    fecha: string;
    tipo: string;
    numeracion: string;
    numeroIdentificacion: number;
    razonSocial: string;
    monto: number; 
    idVenta: number;
    idMetodoDian: number;
    idTipoDocumento: number;   
    num_doc: string;
}