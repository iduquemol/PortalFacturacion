import { useState, useEffect } from 'react';
import { Eye, FileDown, Mail, MoreHorizontal, Search, Filter, Calendar, ArrowLeft, Bell, Printer, CheckCircle, RefreshCw, FileSpreadsheet, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from 'react-router-dom';
import logoSvg from '@/assets/Logo2.svg';
import { PortalService } from '@/services/PortalService';
import { IRespuestaConsultaFactura } from '@/types/IRespuestaConsultaFactura';
import { IRespuestaPrefijo } from '@/types/IRespuestaPrefijo';
import FacturaModal from '@/features/reports/FacturaModal';
import { VentaService } from '@/services/VentaService';
import * as XLSX from 'xlsx';

const PortalNc = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facturasError, setFacturasError] = useState<string | null>(null);
  const [isLoadingFacturas, setIsLoadingFacturas] = useState(false);
  const [facturas, setFacturas] = useState<IRespuestaConsultaFactura[]>([]);
  const [prefijosError, setPrefijosError] = useState<string | null>(null);
  const [isLoadingPrefijos, setIsLoadingPrefijos] = useState(false);
  const [prefijos, setPrefijos] = useState<IRespuestaPrefijo[]>([]);
  const [fechaInicial, setFechaInicial] = useState('2025-01-01');
  const [fechaFinal, setFechaFinal] = useState('2026-12-30');
  const [idMetodoDian, setIdMetodoDian] = useState(3);
  const [prefijo, setPrefijo] = useState('FEBO');
  const [selectedFacturaId, setSelectedFacturaId] = useState<number | null>(null);
  const [selectedFacturaData, setSelectedFacturaData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingFactura, setLoadingFactura] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailMessage, setEmailMessage] = useState('');
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [loadingResend, setLoadingResend] = useState(false);

  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcular datos de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFacturas = facturas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(facturas.length / itemsPerPage);

  // Funciones de paginación
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Resetear página al consultar nuevas facturas
  useEffect(() => {
    setCurrentPage(1);
  }, [facturas]);

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Validado DIAN':
        return <Badge className="bg-cyan-500 hover:bg-cyan-600 text-white border-0">Validado DIAN</Badge>;
      case 'Acepta de Tercero':
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">Acepta de Tercero</Badge>;
      case 'Aceptación Expresa':
        return <Badge className="bg-green-500 hover:bg-green-600 text-white border-0">Aceptación Expresa</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const handleOpenFacturaModal = async (idVenta: number, idMetodoDian: number) => {
    try {
      setLoadingFactura(true);
      setSelectedFacturaId(idVenta);
      const dataPrint = await VentaService.printById(idVenta, idMetodoDian);
      setSelectedFacturaData(dataPrint);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error al cargar factura:', error);
    } finally {
      setLoadingFactura(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFacturaId(null);
    setSelectedFacturaData(null);
  };

  const handleDownloadXml = async (numDoc: string) => {
    try {
      const xmlBlob = await VentaService.obtenerXml(numDoc);
      const url = URL.createObjectURL(xmlBlob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${numDoc}.xml`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadedFileName(fileName);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error al descargar XML:', error);
    }
  };

  const handleSendMail = async (numDoc: string, idMetodoDian: number) => {
    try {
      setLoadingEmail(true);
      const mensaje = await VentaService.enviarCorreo(numDoc, idMetodoDian);
      const response = JSON.parse(mensaje);
      setEmailMessage(response.message);
      setShowEmailDialog(true);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      setEmailMessage('Error al enviar el correo electrónico');
      setShowEmailDialog(true);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleResend = async (idVenta: number, idMetodoDian: number) => {
    try {
      setLoadingResend(true);
      const response = await VentaService.resend(idVenta, idMetodoDian);
      setResendMessage(response.message ?? 'Mensaje no disponible');
      setShowResendDialog(true);
    } catch (error) {
      console.error('Error al reenviar factura:', error);
      setResendMessage('Error al reenviar la factura a la DIAN');
      setShowResendDialog(true);
    } finally {
      setLoadingResend(false);
    }
  };

  // Función para exportar a Excel
  const handleDownloadExcel = () => {
    try {
      // Preparar los datos para Excel
      const excelData = facturas.map((factura, index) => ({
        'N°': index + 1,
        'FECHA': formatDate(factura.fecha),
        'TIPO': factura.tipo,
        'NUMERACIÓN': factura.numeracion,
        'IDENTIFICACIÓN': factura.numeroIdentificacion,
        'RAZÓN SOCIAL CLIENTE': factura.razonSocial,
        'MONTO': factura.monto,
      }));

      // Crear un libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Notas');

      // Configurar anchos de columna
      const columnWidths = [
        { wch: 5 },  // N°
        { wch: 12 }, // FECHA
        { wch: 15 }, // TIPO
        { wch: 20 }, // NUMERACIÓN
        { wch: 18 }, // IDENTIFICACIÓN
        { wch: 40 }, // RAZÓN SOCIAL
        { wch: 15 }, // MONTO
      ];
      worksheet['!cols'] = columnWidths;

      // Generar el archivo con nombre descriptivo
      const fileName = `Notas_${prefijo}_${fechaInicial.replace(/-/g, '')}_${fechaFinal.replace(/-/g, '')}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // Mostrar mensaje de éxito
      setDownloadedFileName(fileName);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error al generar archivo Excel:', error);
    }
  };

  const fetchFacturas = async () => {
    try {
      setFacturasError(null);
      setIsLoadingFacturas(true);
      const data = await PortalService.getFacturas(fechaInicial, fechaFinal, idMetodoDian, prefijo);
      setFacturas(data);
    } catch (error) {
      console.error('Error:', error);
      setFacturasError('Error al cargar las facturas');
    } finally {
      setIsLoadingFacturas(false);
    }
  };

  const fetchPrefijos = async () => {
    try {
      setPrefijosError(null);
      setIsLoadingPrefijos(true);
      const data = await PortalService.getPrefijos(idMetodoDian);
      setPrefijos(data);
    } catch (error) {
      console.error('Error:', error);
      setPrefijosError('Error al cargar los prefijos');
    } finally {
      setIsLoadingPrefijos(false);
    }
  };

  const initializeComponent = async () => {
    await Promise.all([
      fetchPrefijos(),
    ]);
  };

  useEffect(() => {
    initializeComponent();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
            <div className="bg-black p-4 rounded-xl">
              <img src={logoSvg} alt="AstilPro Logo" className="h-16 w-16" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">Astil</h1>
              <p className="text-sm text-gray-600">Portal de Facturación Electrónica</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="relative border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-orange-500 border-0">0</Badge>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <span className="text-sm font-medium text-[#1F2937]">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Card className="w-full bg-white border-gray-200 shadow-md">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-3xl font-bold text-[#1F2937]">Notas Crédito</CardTitle>
              <div className="flex items-center gap-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleDownloadExcel}
                        className="bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                        disabled={facturas.length === 0}
                      >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Exportar a Excel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Descargar tabla en formato Excel</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 px-4 py-2">
                  {facturas.length} notas crédito
                </Badge>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
                <Input
                  type="date"
                  value={fechaInicial}
                  onChange={(e) => setFechaInicial(e.target.value)}
                  className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
                <Input
                  type="date"
                  value={fechaFinal}
                  onChange={(e) => setFechaFinal(e.target.value)}
                  className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-all"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prefijo</label>
                <Select value={prefijo} onValueChange={setPrefijo}>
                  <SelectTrigger className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500">
                    <SelectValue placeholder="Seleccione un prefijo" />
                  </SelectTrigger>
                  <SelectContent>
                    {prefijos.map((p) => (
                      <SelectItem key={p.prefijoConsecutivo} value={p.prefijoConsecutivo}>
                        {p.prefijoConsecutivo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={fetchFacturas}
                  className="h-11 bg-orange-500 hover:bg-orange-600 text-white transition-all"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Consultar
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-b border-orange-200">
                    <TableHead className="font-semibold text-[#1F2937]">FECHA</TableHead>
                    <TableHead className="font-semibold text-[#1F2937]">TIPO</TableHead>
                    <TableHead className="font-semibold text-[#1F2937]">NUMERACIÓN</TableHead>
                    <TableHead className="font-semibold text-[#1F2937]">IDENTIFICACIÓN</TableHead>
                    <TableHead className="font-semibold text-[#1F2937]">RAZÓN SOCIAL CLIENTE</TableHead>
                    <TableHead className="font-semibold text-[#1F2937] text-right">MONTO</TableHead>
                    {/* <TableHead className="font-semibold text-[#1F2937]">ESTADO DIAN</TableHead> */}
                    <TableHead className="font-semibold text-[#1F2937]">OPCIONES</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFacturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No hay facturas para mostrar
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentFacturas.map((factura, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-orange-50/50 transition-colors border-b border-gray-100 last:border-0"
                      >
                        <TableCell className="font-medium text-gray-700">{formatDate(factura.fecha)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium border-orange-200 text-orange-700 bg-orange-50">
                            {factura.tipo}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-orange-600 font-medium">
                          📄 {factura.numeracion}
                        </TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">{factura.numeroIdentificacion}</TableCell>
                        {/* <TableCell className="font-mono text-sm text-gray-600">{factura.num_doc}</TableCell> */}
                        <TableCell className="max-w-xs truncate text-gray-700" title={factura.razonSocial}>
                          {factura.razonSocial}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[#1F2937]">
                          {formatCurrency(factura.monto)}
                        </TableCell>
                        {/* <TableCell>{getStatusBadge(factura.estado)}</TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-orange-600 hover:text-orange-800 hover:bg-orange-50 transition-all"
                                    onClick={() => handleOpenFacturaModal(factura.idVenta, factura.idMetodoDian)}
                                    disabled={loadingFactura}
                                  >
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Imprimir nota crédito</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {isModalOpen && selectedFacturaId === factura.idVenta && selectedFacturaData && (
                              <FacturaModal
                                idVenta={factura.idVenta}
                                idMetodoDian={idMetodoDian}
                                facturaData={selectedFacturaData}
                                isOpen={isModalOpen}
                                onClose={handleCloseModal}
                              />
                            )}

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all"
                                    onClick={() => handleDownloadXml(factura.num_doc)}
                                  >
                                    <FileDown className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Descargar XML</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600 hover:text-green-800 hover:bg-green-50 transition-all"
                                    onClick={() => handleSendMail(factura.num_doc, factura.idMetodoDian)}
                                    disabled={loadingEmail}
                                  >
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enviar por correo</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-all"
                                    onClick={() => handleResend(factura.idVenta, factura.idMetodoDian)}
                                    disabled={loadingResend}
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Reenviar a DIAN</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

             {/* Paginación */}
            {facturas.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-600 font-medium">
                    Mostrando{' '}
                    <span className="text-orange-600 font-semibold">{indexOfFirstItem + 1}</span>
                    {' '}-{' '}
                    <span className="text-orange-600 font-semibold">
                      {Math.min(indexOfLastItem, facturas.length)}
                    </span>
                    {' '}de{' '}
                    <span className="text-orange-600 font-semibold">{facturas.length}</span>
                    {' '}facturas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Botón anterior */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="border-gray-300 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  {/* Números de página */}
                  <div className="flex items-center gap-1">
                    {totalPages > 0 && Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                      // Mostrar solo algunas páginas alrededor de la página actual
                      const showPage =
                        totalPages <= 7 || // Mostrar todas si son 7 o menos
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1);

                      const showEllipsisBefore =
                        pageNumber === 2 && currentPage > 3 && totalPages > 7;

                      const showEllipsisAfter =
                        pageNumber === totalPages - 1 && currentPage < totalPages - 2 && totalPages > 7;

                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={`ellipsis-${pageNumber}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <Button
                          key={`page-${pageNumber}`}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNumber)}
                          className={
                            currentPage === pageNumber
                              ? "bg-orange-500 hover:bg-orange-600 text-white border-0 min-w-[36px]"
                              : "border-gray-300 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700 transition-all min-w-[36px]"
                          }
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  {/* Botón siguiente */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="border-gray-300 hover:bg-orange-50 hover:border-orange-500 hover:text-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* Modal de descarga exitosa */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Descarga Exitosa
              </DialogTitle>
              <DialogDescription className="pt-4">
                <div className="space-y-2">
                  <p className="text-gray-700">Se ha descargado correctamente el archivo XML de la factura:</p>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-mono text-sm text-gray-800 break-all">{downloadedFileName}</p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowSuccessDialog(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Aceptar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Modal de envío de correo */}
        <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Mail className="h-5 w-5" />
                Envío de Correo
              </DialogTitle>
              <DialogDescription className="pt-4">
                <div className="space-y-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{emailMessage}</p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowEmailDialog(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Aceptar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Modal de reenvío a DIAN */}
        <Dialog open={showResendDialog} onOpenChange={setShowResendDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600">
                <MoreHorizontal className="h-5 w-5" />
                Reenvío a DIAN
              </DialogTitle>
              <DialogDescription className="pt-4">
                <div className="space-y-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm text-gray-800">{resendMessage}</p>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowResendDialog(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Aceptar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PortalNc;