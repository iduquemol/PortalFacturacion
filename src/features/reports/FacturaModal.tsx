import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download, X } from 'lucide-react';
import { VentaService } from '@/services/VentaService';

interface FacturaModalProps {
  idVenta: number;
  idMetodoDian?: number;
  facturaData?: any;
  triggerText?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  isOpen?: boolean;
  onClose?: () => void;
}

const FacturaModal: React.FC<FacturaModalProps> = ({
  idVenta,
  idMetodoDian,
  facturaData,
  triggerText = "Ver Factura",
  triggerVariant = "default",
  isOpen: externalIsOpen,
  onClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usar isOpen externa si está disponible, si no usar la interna
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose !== undefined
    ? (open: boolean) => { if (!open) onClose(); }
    : setInternalIsOpen;

  // Cargar el PDF cuando se abre el modal
  useEffect(() => {
    if (!isOpen || pdfUrl) return;

    let active = true;

    const fetchPdf = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const pdfBlob = await VentaService.previewPdf(idVenta, idMetodoDian ?? 1);
        if (active) {
          const url = URL.createObjectURL(pdfBlob);
          setPdfUrl(url);
        }
      } catch (err) {
        if (active) {
          console.error('Error al cargar PDF:', err);
          setError('Error al cargar la factura. Por favor intente nuevamente.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchPdf();
    return () => { active = false; };
  }, [isOpen, idVenta, idMetodoDian]);

  // Limpiar URL cuando se cierra el modal o cambia
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const loadPdf = async () => {
    setPdfUrl(null);
  };

  const handleDownload = async () => {
    try {
      const pdfBlob = await VentaService.previewPdf(idVenta, idMetodoDian ?? 1);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName(idMetodoDian);
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar PDF:', err);
    }
  };

  const getFileName = (idMetodoDian?: number) => {
    if (facturaData?.numeroVenta) {
      return idMetodoDian === 3
        ? `NotaCredito_${facturaData.numeroVenta}.pdf`
        : `Factura_${facturaData.numeroVenta}.pdf`;
    }
    return idMetodoDian === 3
      ? `NotaCredito_${idVenta}_${new Date().toISOString().split('T')[0]}.pdf`
      : `Factura_${idVenta}_${new Date().toISOString().split('T')[0]}.pdf`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Solo mostrar el trigger si no se está controlando externamente */}
      {externalIsOpen === undefined && (
        <DialogTrigger asChild>
          <Button variant={triggerVariant} className="h-10 px-4 flex items-center gap-2">
            <Printer size={16} />
            {triggerText}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{idMetodoDian === 3 ? 'Nota Crédito' : 'Factura Electrónica'}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-8 px-3"
              >
                <Download size={14} className="mr-2" />
                Descargar
              </Button>
            </div>
          </DialogTitle>

          <DialogDescription>
            {facturaData && (
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <span className="font-semibold">Cliente:</span>{' '}
                  {facturaData.clienteRazonSocial || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Número:</span>{' '}
                  {facturaData.numeroVenta || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Fecha:</span>{' '}
                  {facturaData.fechaHoraAutorizacion || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Total:</span>{' '}
                  ${facturaData.totalVenta?.toLocaleString() || '0'}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Visor del PDF */}
        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-gray-600">{idMetodoDian === 3 ? 'Cargando Nota Crédito...' : 'Cargando factura...'}</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadPdf}
                  className="mt-4"
                >
                  Reintentar
                </Button>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Vista previa de factura"
            />
          ) : null}
        </div>

        {/* Footer con información adicional */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>ID Venta: {idVenta}</span>
            {facturaData?.cufe && (
              <span className="text-xs">CUFE: {facturaData.cufe.substring(0, 20)}...</span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Generado automáticamente
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacturaModal;