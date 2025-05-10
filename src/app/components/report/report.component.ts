import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  // Datos de facturación
  totalFacturado: number = 0;
  objetivoFacturacion: number = 20000; // Objetivo establecido
  sidebarActive: boolean = false;
  showObjectiveSettings: boolean = false;
  nuevoObjetivo: number = 0;
  
  // Datos de ventas
  ventas: {
    totalVentas: number;
    albumesVendidos: number;
    donacionesRecibidas: number;
    ventasChat: number;
  } = {
    totalVentas: 0,
    albumesVendidos: 0,
    donacionesRecibidas: 0,
    ventasChat: 0
  };

  // Datos de comunidad
  comunidad: {
    seguidores: number;
    suscriptores: number;
    cantidadAlbums: number;
  } = {
    seguidores: 0,
    suscriptores: 0,
    cantidadAlbums: 0
  };

  // Secciones de navegación
  secciones = [
    { id: 'facturacion', nombre: 'Facturación' },
    { id: 'ventas', nombre: 'Ventas' },
    { id: 'comunidad', nombre: 'Comunidad' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Aquí se cargarían los datos reales desde un servicio
    this.cargarDatos();
  }

  cargarDatos(): void {
    // Simulación de datos - Reemplazar con llamada real al servicio
    this.totalFacturado = 15000;
    
    this.ventas = {
      totalVentas: 5000,
      albumesVendidos: 25,
      donacionesRecibidas: 2000,
      ventasChat: 1000
    };

    this.comunidad = {
      seguidores: 1000,
      suscriptores: 500,
      cantidadAlbums: 10
    };
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Cerrar el menú en móvil después de hacer clic
      if (window.innerWidth <= 768) {
        this.toggleSidebar();
      }
    }
  }

  // Calcular el porcentaje de progreso hacia el objetivo
  getProgresoObjetivo(): number {
    return (this.totalFacturado / this.objetivoFacturacion) * 100;
  }

  // Formatear el porcentaje para mostrar
  getProgresoFormateado(): string {
    return `${Math.min(this.getProgresoObjetivo(), 100).toFixed(1)}%`;
  }

  // Toggle del sidebar en móvil
  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  // Abrir configuración del objetivo
  openObjectiveSettings(): void {
    this.nuevoObjetivo = this.objetivoFacturacion;
    this.showObjectiveSettings = true;
  }

  // Guardar nuevo objetivo
  guardarObjetivo(): void {
    if (this.nuevoObjetivo > 0) {
      this.objetivoFacturacion = this.nuevoObjetivo;
    }
    this.showObjectiveSettings = false;
  }

  // Cancelar configuración
  cancelarConfiguracion(): void {
    this.showObjectiveSettings = false;
  }
}
