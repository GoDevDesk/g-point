import { Component, OnInit } from '@angular/core';
import { AdminService, AdminUser, AdminStats, RegistrationRequest } from '../../services/admin.service';

interface SearchTag {
  name: string;
  count: number;
}

interface SearchKeyword {
  name: string;
  count: number;
}

interface TopSeller {
  id: string;
  username: string;
  profilePicture: string;
  totalEarnings: number;
  albumsSold: number;
  personalContentSold: number;
  subscribers: number;
  donationsReceived: number;
}

interface TopSubscription {
  id: string;
  username: string;
  profilePicture: string;
  subscriberCount: number;
  premiumSubscribers: number;
  vipSubscribers: number;
  subscriptionRevenue: number;
  retentionRate: number;
}

interface SalesCategory {
  grossRevenue: number;
  creatorPayouts: number;
  commission: number;
  activeSubscriptions?: number;
  soldAlbums?: number;
  soldContent?: number;
  totalDonations?: number;
}

interface SalesData {
  subscriptions: SalesCategory;
  albums: SalesCategory;
  personalContent: SalesCategory;
  donations: SalesCategory;
}

interface FinancialData {
  totalRevenue: number;
  totalPayouts: number;
  netProfit: number;
  commissionEarned: number;
}

interface CreatorSource {
  subscriptions: number;
  albums: number;
  personalContent: number;
  donations: number;
}

interface TopCreator {
  id: string;
  username: string;
  profilePicture: string;
  grossRevenue: number;
  payout: number;
  commission: number;
  sources: CreatorSource;
}

interface FinancialTransaction {
  id: string;
  type: 'subscription' | 'album' | 'personal_content' | 'donation';
  productName: string;
  productType: string;
  grossAmount: number;
  commission: number;
  payout: number;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

interface CreatorFinancialDetail {
  creator: TopCreator;
  transactions: FinancialTransaction[];
  totalGrossRevenue: number;
  totalCommission: number;
  totalPayout: number;
  paymentHistory: {
    date: Date;
    amount: number;
    method: string;
    status: string;
  }[];
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  // Estadísticas del dashboard
  totalUsers: number = 0;
  activeUsers: number = 0;
  totalRevenue: number = 0;

  // Navegación
  activeSection: string = 'users';

  // Gestión de usuarios
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  searchTerm: string = '';
  statusFilter: string = '';
  subscriptionFilter: string = '';

  // Paginación
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;

  // Gestión de solicitudes de registro
  requests: RegistrationRequest[] = [];
  filteredRequests: RegistrationRequest[] = [];
  requestStatusFilter: string = '';
  currentRequestPage: number = 1;
  totalRequestPages: number = 1;

  // Estadísticas de solicitudes
  get pendingRequests(): RegistrationRequest[] {
    return this.requests.filter(r => r.status === 'pending');
  }

  get approvedRequests(): RegistrationRequest[] {
    return this.requests.filter(r => r.status === 'approved');
  }

  get rejectedRequests(): RegistrationRequest[] {
    return this.requests.filter(r => r.status === 'rejected');
  }

  // Análisis y estadísticas
  analyticsPeriod: string = '30';
  
  // Estadísticas de contenido
  contentStats = {
    totalAlbums: 0,
    totalPhotos: 0,
    totalVideos: 0,
    totalPersonalContent: 0
  };

  // Estadísticas de búsqueda
  searchStats = {
    topTags: [] as SearchTag[],
    topKeywords: [] as SearchKeyword[]
  };

  // Top vendedores
  topSellers: TopSeller[] = [];

  // Top suscripciones
  topSubscriptions: TopSubscription[] = [];

  // Contenido del sistema
  totalBalance = {
    creatorAccounts: 0,
    nonCreatorAccounts: 0,
    albums: 0,
    personalContent: 0,
    donations: 0,
    total: 0
  };

  // Crecimiento de la app
  appGrowth = {
    newUsers: 0,
    newUsersPercentage: 0,
    activeUsers: 0,
    activeUsersPercentage: 0,
    deletedUsers: 0,
    deletedUsersPercentage: 0,
    newContent: 0,
    newContentPercentage: 0,
    deletedContent: 0,
    deletedContentPercentage: 0,
    revenue: 0,
    revenuePercentage: 0
  };

  // Configuración de comisión
  commissionRate: number = 20; // 20% por defecto
  currentCommissionRate: number = 20; // Comisión actual para comparación
  showCommissionModal: boolean = false;
  adminPassword: string = '';
  showPassword: boolean = false;
  passwordError: string = '';
  isUpdating: boolean = false;

  // Datos financieros
  financialData: FinancialData = {
    totalRevenue: 0,
    totalPayouts: 0,
    netProfit: 0,
    commissionEarned: 0
  };

  // Datos de ventas por categoría
  salesData: SalesData = {
    subscriptions: {
      grossRevenue: 0,
      creatorPayouts: 0,
      commission: 0,
      activeSubscriptions: 0
    },
    albums: {
      grossRevenue: 0,
      creatorPayouts: 0,
      commission: 0,
      soldAlbums: 0
    },
    personalContent: {
      grossRevenue: 0,
      creatorPayouts: 0,
      commission: 0,
      soldContent: 0
    },
    donations: {
      grossRevenue: 0,
      creatorPayouts: 0,
      commission: 0,
      totalDonations: 0
    }
  };

  // Top creadores
  topCreators: TopCreator[] = [];
  paginatedCreators: TopCreator[] = [];
  currentCreatorsPage: number = 1;
  totalCreatorsPages: number = 1;
  creatorsPerPage: number = 10;

  // Paginación de transacciones
  paginatedTransactions: FinancialTransaction[] = [];
  currentTransactionsPage: number = 1;
  totalTransactionsPages: number = 1;
  transactionsPerPage: number = 10;

  // Modales
  showSellerModal = false;
  showSubscriptionModal = false;
  showCreatorDetailsModal = false;
  selectedSeller: any = null;
  selectedSubscription: any = null;
  selectedCreatorDetail: CreatorFinancialDetail | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadUsers();
    this.loadRegistrationRequests();
    this.loadAnalyticsData();
    this.loadSalesData();
  }

  // Navegación
  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  // Dashboard
  loadDashboardStats(): void {
    this.adminService.getDashboardStats().subscribe({
      next: (stats: AdminStats) => {
        this.totalUsers = stats.totalUsers;
        this.activeUsers = stats.activeUsers;
        this.totalRevenue = stats.totalRevenue;
      },
      error: (error) => {
        console.error('Error cargando estadísticas:', error);
        // Datos de ejemplo en caso de error
        this.totalUsers = 1250;
        this.activeUsers = 890;
        this.totalRevenue = 45000;
      }
    });
  }

  // Gestión de usuarios
  loadUsers(): void {
    const filters = {
      search: this.searchTerm,
      status: this.statusFilter,
      subscriptionType: this.subscriptionFilter,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    this.adminService.getUsers(filters).subscribe({
      next: (response) => {
        this.users = response.users;
        this.filteredUsers = response.users;
        this.totalPages = Math.ceil(response.total / this.itemsPerPage);
      },
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        // Datos de ejemplo en caso de error
        this.users = [
          {
            id: '1',
            username: 'usuario1',
            email: 'usuario1@example.com',
            profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
            subscriptionType: 'premium',
            status: 'active',
            registrationDate: new Date('2024-01-15'),
            lastActivity: new Date()
          },
          {
            id: '2',
            username: 'usuario2',
            email: 'usuario2@example.com',
            subscriptionType: 'free',
            status: 'active',
            registrationDate: new Date('2024-02-20'),
            lastActivity: new Date('2024-03-10')
          },
          {
            id: '3',
            username: 'usuario3',
            email: 'usuario3@example.com',
            subscriptionType: 'vip',
            status: 'blocked',
            registrationDate: new Date('2024-01-10'),
            lastActivity: new Date('2024-03-05')
          }
        ];
        this.filteredUsers = [...this.users];
        this.calculatePagination();
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1; // Resetear a la primera página
    this.loadUsers(); // Recargar usuarios con los filtros aplicados
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.subscriptionFilter = '';
    this.currentPage = 1;
    this.loadUsers(); // Recargar usuarios sin filtros
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesStatus = !this.statusFilter || user.status === this.statusFilter;
      const matchesSubscription = !this.subscriptionFilter || user.subscriptionType === this.subscriptionFilter;

      return matchesSearch && matchesStatus && matchesSubscription;
    });

    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  // Paginación
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Acciones de usuario
  viewUser(user: AdminUser): void {
    console.log('Ver usuario:', user);
    // TODO: Implementar modal o navegación para ver detalles del usuario
  }

  editUser(user: AdminUser): void {
    console.log('Editar usuario:', user);
    // TODO: Implementar modal de edición
  }

  toggleUserBlock(user: AdminUser): void {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    
    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.status = newStatus;
        console.log(`Usuario ${user.username} ${newStatus === 'blocked' ? 'bloqueado' : 'desbloqueado'}`);
      },
      error: (error) => {
        console.error('Error actualizando estado del usuario:', error);
        alert('Error al actualizar el estado del usuario');
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.username}?`)) {
      this.adminService.deleteUser(user.id).subscribe({
        next: () => {
          console.log('Usuario eliminado:', user);
          this.users = this.users.filter(u => u.id !== user.id);
          this.filterUsers();
        },
        error: (error) => {
          console.error('Error eliminando usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  // Gestión de solicitudes de registro
  loadRegistrationRequests(): void {
    // TODO: Implementar llamada al servicio
    this.requests = [
      {
        id: '1',
        username: 'nuevo_usuario1',
        email: 'nuevo1@example.com',
        status: 'pending',
        requestDate: new Date('2024-03-15'),
        motivo: 'Quiero compartir mi contenido'
      },
      {
        id: '2',
        username: 'nuevo_usuario2',
        email: 'nuevo2@example.com',
        status: 'approved',
        requestDate: new Date('2024-03-10'),
        motivo: 'Interesado en la plataforma'
      },
      {
        id: '3',
        username: 'nuevo_usuario3',
        email: 'nuevo3@example.com',
        status: 'rejected',
        requestDate: new Date('2024-03-05'),
        motivo: 'Motivo rechazado',
        adminNotes: 'Perfil no cumple con las políticas'
      }
    ];
    this.filteredRequests = [...this.requests];
    this.calculateRequestPagination();
  }

  applyRequestFilters(): void {
    this.currentRequestPage = 1;
    this.filterRequests();
  }

  clearRequestFilters(): void {
    this.requestStatusFilter = '';
    this.currentRequestPage = 1;
    this.filterRequests();
  }

  filterRequests(): void {
    this.filteredRequests = this.requests.filter(request => {
      const matchesStatus = !this.requestStatusFilter || request.status === this.requestStatusFilter;
      return matchesStatus;
    });
    this.calculateRequestPagination();
  }

  calculateRequestPagination(): void {
    this.totalRequestPages = Math.ceil(this.filteredRequests.length / this.itemsPerPage);
  }

  previousRequestPage(): void {
    if (this.currentRequestPage > 1) {
      this.currentRequestPage--;
    }
  }

  nextRequestPage(): void {
    if (this.currentRequestPage < this.totalRequestPages) {
      this.currentRequestPage++;
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'completed': return 'Completado';
      case 'failed': return 'Fallido';
      default: return status;
    }
  }

  approveRequest(request: RegistrationRequest): void {
    if (confirm(`¿Estás seguro de que quieres aprobar la solicitud de ${request.username}?`)) {
      // TODO: Implementar llamada al servicio
      request.status = 'approved';
      console.log('Solicitud aprobada:', request);
      this.filterRequests();
    }
  }

  rejectRequest(request: RegistrationRequest): void {
    const motivo = prompt('Motivo del rechazo:');
    if (motivo !== null) {
      // TODO: Implementar llamada al servicio
      request.status = 'rejected';
      request.adminNotes = motivo;
      console.log('Solicitud rechazada:', request);
      this.filterRequests();
    }
  }

  viewRequestDetails(request: RegistrationRequest): void {
    console.log('Ver detalles de solicitud:', request);
    // TODO: Implementar modal con detalles completos
  }

  deleteRequest(request: RegistrationRequest): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la solicitud de ${request.username}?`)) {
      // TODO: Implementar llamada al servicio
      this.requests = this.requests.filter(r => r.id !== request.id);
      this.filterRequests();
    }
  }

  // Métodos de análisis
  loadAnalyticsData(): void {
    this.loadContentStats();
    this.loadSearchStats();
    this.loadTopSellers();
    this.loadTopSubscriptions();
    this.loadTotalBalance();
    this.loadAppGrowth();
  }

  loadContentStats(): void {
    // TODO: Implementar llamada al servicio
    this.contentStats = {
      totalAlbums: 1250,
      totalPhotos: 15680,
      totalVideos: 890,
      totalPersonalContent: 2340
    };
  }

  loadSearchStats(): void {
    // TODO: Implementar llamada al servicio
    this.searchStats = {
      topTags: [
        { name: 'fitness', count: 1250 },
        { name: 'beauty', count: 980 },
        { name: 'lifestyle', count: 850 },
        { name: 'fashion', count: 720 },
        { name: 'travel', count: 650 }
      ],
      topKeywords: [
        { name: 'workout', count: 890 },
        { name: 'makeup', count: 750 },
        { name: 'diet', count: 680 },
        { name: 'outfit', count: 520 },
        { name: 'vacation', count: 480 }
      ]
    };
  }

  loadTopSellers(): void {
    // TODO: Implementar llamada al servicio
    this.topSellers = [
      {
        id: '1',
        username: 'fitness_girl',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        totalEarnings: 15420,
        albumsSold: 45,
        personalContentSold: 120,
        subscribers: 890,
        donationsReceived: 2300
      },
      {
        id: '2',
        username: 'beauty_queen',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        totalEarnings: 12850,
        albumsSold: 38,
        personalContentSold: 95,
        subscribers: 720,
        donationsReceived: 1800
      },
      {
        id: '3',
        username: 'lifestyle_pro',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        totalEarnings: 11200,
        albumsSold: 32,
        personalContentSold: 78,
        subscribers: 650,
        donationsReceived: 1500
      },
      {
        id: '4',
        username: 'fashion_icon',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        totalEarnings: 9800,
        albumsSold: 28,
        personalContentSold: 65,
        subscribers: 580,
        donationsReceived: 1200
      },
      {
        id: '5',
        username: 'travel_lover',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        totalEarnings: 8500,
        albumsSold: 25,
        personalContentSold: 55,
        subscribers: 520,
        donationsReceived: 1000
      }
    ];
  }

  loadTopSubscriptions(): void {
    // TODO: Implementar llamada al servicio
    this.topSubscriptions = [
      {
        id: '1',
        username: 'fitness_girl',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        subscriberCount: 890,
        premiumSubscribers: 450,
        vipSubscribers: 120,
        subscriptionRevenue: 12500,
        retentionRate: 85
      },
      {
        id: '2',
        username: 'beauty_queen',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        subscriberCount: 720,
        premiumSubscribers: 380,
        vipSubscribers: 95,
        subscriptionRevenue: 9800,
        retentionRate: 82
      },
      {
        id: '3',
        username: 'lifestyle_pro',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        subscriberCount: 650,
        premiumSubscribers: 320,
        vipSubscribers: 78,
        subscriptionRevenue: 8500,
        retentionRate: 79
      },
      {
        id: '4',
        username: 'fashion_icon',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        subscriberCount: 580,
        premiumSubscribers: 290,
        vipSubscribers: 65,
        subscriptionRevenue: 7200,
        retentionRate: 76
      },
      {
        id: '5',
        username: 'travel_lover',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        subscriberCount: 520,
        premiumSubscribers: 260,
        vipSubscribers: 55,
        subscriptionRevenue: 6500,
        retentionRate: 74
      }
    ];
  }

  loadTotalBalance(): void {
    // TODO: Implementar llamada al servicio
    this.totalBalance = {
      creatorAccounts: 450,
      nonCreatorAccounts: 800,
      albums: 890,
      personalContent: 2340,
      donations: 15680,
      total: 20160
    };
  }

  loadAppGrowth(): void {
    // TODO: Implementar llamada al servicio
    this.appGrowth = {
      newUsers: 1250,
      newUsersPercentage: 15,
      activeUsers: 8900,
      activeUsersPercentage: 8,
      deletedUsers: 85,
      deletedUsersPercentage: 12,
      newContent: 450,
      newContentPercentage: 22,
      deletedContent: 23,
      deletedContentPercentage: 8,
      revenue: 120000,
      revenuePercentage: 18
    };
  }

  // Métodos de modales
  viewSellerDetails(seller: any, event: any): void {
    this.selectedSeller = seller;
    this.showSellerModal = true;
    this.positionModal(event);
  }

  closeSellerModal(): void {
    this.showSellerModal = false;
    this.selectedSeller = null;
  }

  viewSubscriptionDetails(user: any, event: any): void {
    this.selectedSubscription = user;
    this.showSubscriptionModal = true;
    this.positionModal(event);
  }

  closeSubscriptionModal(): void {
    this.showSubscriptionModal = false;
    this.selectedSubscription = null;
  }

  positionModal(event: any): void {
    // El CSS se encarga del centrado automático
    // No necesitamos posicionamiento manual
  }

  // Métodos de ventas y finanzas
  showCommissionUpdateModal(): void {
    this.currentCommissionRate = this.commissionRate;
    this.showCommissionModal = true;
    this.adminPassword = '';
    this.passwordError = '';
    this.showPassword = false;
  }

  closeCommissionModal(): void {
    this.showCommissionModal = false;
    this.adminPassword = '';
    this.passwordError = '';
    this.showPassword = false;
    this.isUpdating = false;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    const passwordInput = document.getElementById('adminPassword') as HTMLInputElement;
    if (passwordInput) {
      passwordInput.type = this.showPassword ? 'text' : 'password';
    }
  }

  confirmCommissionUpdate(): void {
    if (!this.adminPassword.trim()) {
      this.passwordError = 'Por favor ingresa tu contraseña';
      return;
    }

    this.isUpdating = true;
    this.passwordError = '';

    // Simular validación de contraseña y actualización
    setTimeout(() => {
      // Aquí iría la validación real con el backend
      if (this.adminPassword === 'admin123') { // Contraseña de ejemplo
        this.currentCommissionRate = this.commissionRate;
        this.isUpdating = false;
        this.showCommissionModal = false;
        this.adminPassword = '';
        
        // Recargar datos con nueva comisión
        this.loadSalesData();
        
        // Mostrar mensaje de éxito
        alert('Comisión actualizada exitosamente a ' + this.commissionRate + '%');
      } else {
        this.passwordError = 'Contraseña incorrecta';
        this.isUpdating = false;
      }
    }, 1000);
  }

  updateCommission(): void {
    // Método original mantenido para compatibilidad
    this.showCommissionUpdateModal();
  }

  loadSalesData(): void {
    // TODO: Implementar llamada al servicio
    this.loadFinancialData();
    this.loadSalesByCategory();
    this.loadTopCreators();
  }

  loadFinancialData(): void {
    // TODO: Implementar llamada al servicio
    this.financialData = {
      totalRevenue: 125000,
      totalPayouts: 100000,
      netProfit: 25000,
      commissionEarned: 25000
    };
  }

  loadSalesByCategory(): void {
    // TODO: Implementar llamada al servicio
    this.salesData = {
      subscriptions: {
        grossRevenue: 45000,
        creatorPayouts: 36000,
        commission: 9000,
        activeSubscriptions: 1250
      },
      albums: {
        grossRevenue: 28000,
        creatorPayouts: 22400,
        commission: 5600,
        soldAlbums: 890
      },
      personalContent: {
        grossRevenue: 32000,
        creatorPayouts: 25600,
        commission: 6400,
        soldContent: 2340
      },
      donations: {
        grossRevenue: 20000,
        creatorPayouts: 16000,
        commission: 4000,
        totalDonations: 1500
      }
    };
  }

  loadTopCreators(): void {
    // TODO: Implementar llamada al servicio
    this.topCreators = [
      {
        id: '1',
        username: 'fitness_girl',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 15420,
        payout: 12336,
        commission: 3084,
        sources: {
          subscriptions: 8900,
          albums: 3200,
          personalContent: 2800,
          donations: 520
        }
      },
      {
        id: '2',
        username: 'beauty_queen',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 12850,
        payout: 10280,
        commission: 2570,
        sources: {
          subscriptions: 7200,
          albums: 2800,
          personalContent: 2200,
          donations: 650
        }
      },
      {
        id: '3',
        username: 'lifestyle_pro',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 11200,
        payout: 8960,
        commission: 2240,
        sources: {
          subscriptions: 6500,
          albums: 2500,
          personalContent: 1800,
          donations: 400
        }
      },
      {
        id: '4',
        username: 'fashion_icon',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 9800,
        payout: 7840,
        commission: 1960,
        sources: {
          subscriptions: 5800,
          albums: 2200,
          personalContent: 1500,
          donations: 300
        }
      },
      {
        id: '5',
        username: 'travel_lover',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 8500,
        payout: 6800,
        commission: 1700,
        sources: {
          subscriptions: 5200,
          albums: 1800,
          personalContent: 1200,
          donations: 300
        }
      },
      {
        id: '6',
        username: 'fitness_pro',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 7200,
        payout: 5760,
        commission: 1440,
        sources: {
          subscriptions: 4500,
          albums: 1500,
          personalContent: 1000,
          donations: 200
        }
      },
      {
        id: '7',
        username: 'beauty_expert',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 6800,
        payout: 5440,
        commission: 1360,
        sources: {
          subscriptions: 4200,
          albums: 1400,
          personalContent: 900,
          donations: 300
        }
      },
      {
        id: '8',
        username: 'lifestyle_coach',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 6200,
        payout: 4960,
        commission: 1240,
        sources: {
          subscriptions: 3800,
          albums: 1200,
          personalContent: 800,
          donations: 400
        }
      },
      {
        id: '9',
        username: 'fashion_stylist',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 5800,
        payout: 4640,
        commission: 1160,
        sources: {
          subscriptions: 3500,
          albums: 1100,
          personalContent: 700,
          donations: 500
        }
      },
      {
        id: '10',
        username: 'travel_guide',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 5400,
        payout: 4320,
        commission: 1080,
        sources: {
          subscriptions: 3200,
          albums: 1000,
          personalContent: 600,
          donations: 600
        }
      },
      {
        id: '11',
        username: 'wellness_guru',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 5000,
        payout: 4000,
        commission: 1000,
        sources: {
          subscriptions: 3000,
          albums: 900,
          personalContent: 500,
          donations: 600
        }
      },
      {
        id: '12',
        username: 'makeup_artist',
        profilePicture: 'assets/defaultIcons/defaultProfilePhoto.png',
        grossRevenue: 4600,
        payout: 3680,
        commission: 920,
        sources: {
          subscriptions: 2800,
          albums: 800,
          personalContent: 400,
          donations: 600
        }
      }
    ];
    
    this.calculateCreatorsPagination();
  }

  calculateCreatorsPagination(): void {
    this.totalCreatorsPages = Math.ceil(this.topCreators.length / this.creatorsPerPage);
    this.updatePaginatedCreators();
  }

  updatePaginatedCreators(): void {
    const startIndex = (this.currentCreatorsPage - 1) * this.creatorsPerPage;
    const endIndex = startIndex + this.creatorsPerPage;
    this.paginatedCreators = this.topCreators.slice(startIndex, endIndex);
  }

  previousCreatorsPage(): void {
    if (this.currentCreatorsPage > 1) {
      this.currentCreatorsPage--;
      this.updatePaginatedCreators();
    }
  }

  nextCreatorsPage(): void {
    if (this.currentCreatorsPage < this.totalCreatorsPages) {
      this.currentCreatorsPage++;
      this.updatePaginatedCreators();
    }
  }

  viewAllCreators(): void {
    // TODO: Implementar modal o página completa con todos los creadores
    console.log('Ver todos los creadores');
    alert('Funcionalidad para ver todos los creadores en desarrollo');
  }

  viewCreatorDetails(creator: TopCreator): void {
    // TODO: Implementar llamada al servicio para obtener detalles financieros
    this.selectedCreatorDetail = {
      creator: creator,
      transactions: [
        {
          id: '1',
          type: 'subscription',
          productName: 'Suscripción Premium',
          productType: 'Mensual',
          grossAmount: 25,
          commission: 5,
          payout: 20,
          date: new Date('2024-03-15'),
          status: 'completed'
        },
        {
          id: '2',
          type: 'album',
          productName: 'Álbum Fitness 2024',
          productType: 'Digital',
          grossAmount: 15,
          commission: 3,
          payout: 12,
          date: new Date('2024-03-14'),
          status: 'completed'
        },
        {
          id: '3',
          type: 'personal_content',
          productName: 'Video Personalizado',
          productType: 'Chat',
          grossAmount: 50,
          commission: 10,
          payout: 40,
          date: new Date('2024-03-13'),
          status: 'completed'
        },
        {
          id: '4',
          type: 'donation',
          productName: 'Donación',
          productType: 'Voluntaria',
          grossAmount: 10,
          commission: 2,
          payout: 8,
          date: new Date('2024-03-12'),
          status: 'completed'
        },
        {
          id: '5',
          type: 'subscription',
          productName: 'Suscripción VIP',
          productType: 'Anual',
          grossAmount: 100,
          commission: 20,
          payout: 80,
          date: new Date('2024-03-10'),
          status: 'completed'
        },
        {
          id: '6',
          type: 'album',
          productName: 'Álbum Beauty Tips',
          productType: 'Digital',
          grossAmount: 20,
          commission: 4,
          payout: 16,
          date: new Date('2024-03-08'),
          status: 'completed'
        },
        {
          id: '7',
          type: 'personal_content',
          productName: 'Foto Personalizada',
          productType: 'Chat',
          grossAmount: 30,
          commission: 6,
          payout: 24,
          date: new Date('2024-03-05'),
          status: 'completed'
        },
        {
          id: '8',
          type: 'subscription',
          productName: 'Suscripción Premium',
          productType: 'Mensual',
          grossAmount: 25,
          commission: 5,
          payout: 20,
          date: new Date('2024-03-01'),
          status: 'completed'
        },
        {
          id: '9',
          type: 'donation',
          productName: 'Donación',
          productType: 'Voluntaria',
          grossAmount: 15,
          commission: 3,
          payout: 12,
          date: new Date('2024-02-28'),
          status: 'completed'
        },
        {
          id: '10',
          type: 'album',
          productName: 'Álbum Workout',
          productType: 'Digital',
          grossAmount: 18,
          commission: 3.6,
          payout: 14.4,
          date: new Date('2024-02-25'),
          status: 'completed'
        },
        {
          id: '11',
          type: 'personal_content',
          productName: 'Video Tutorial',
          productType: 'Chat',
          grossAmount: 40,
          commission: 8,
          payout: 32,
          date: new Date('2024-02-20'),
          status: 'completed'
        },
        {
          id: '12',
          type: 'subscription',
          productName: 'Suscripción VIP',
          productType: 'Anual',
          grossAmount: 100,
          commission: 20,
          payout: 80,
          date: new Date('2024-02-15'),
          status: 'completed'
        }
      ],
      totalGrossRevenue: creator.grossRevenue,
      totalCommission: creator.commission,
      totalPayout: creator.payout,
      paymentHistory: [
        {
          date: new Date('2024-03-15'),
          amount: 160,
          method: 'Transferencia Bancaria',
          status: 'Completado'
        },
        {
          date: new Date('2024-02-15'),
          amount: 145,
          method: 'PayPal',
          status: 'Completado'
        },
        {
          date: new Date('2024-01-15'),
          amount: 132,
          method: 'Transferencia Bancaria',
          status: 'Completado'
        },
        {
          date: new Date('2023-12-15'),
          amount: 128,
          method: 'PayPal',
          status: 'Completado'
        },
        {
          date: new Date('2023-11-15'),
          amount: 115,
          method: 'Transferencia Bancaria',
          status: 'Completado'
        },
        {
          date: new Date('2023-10-15'),
          amount: 98,
          method: 'PayPal',
          status: 'Completado'
        },
        {
          date: new Date('2023-09-15'),
          amount: 87,
          method: 'Transferencia Bancaria',
          status: 'Completado'
        },
        {
          date: new Date('2023-08-15'),
          amount: 76,
          method: 'PayPal',
          status: 'Completado'
        }
      ]
    };
    
    this.calculateTransactionsPagination();
    this.showCreatorDetailsModal = true;
  }

  calculateTransactionsPagination(): void {
    if (this.selectedCreatorDetail) {
      this.totalTransactionsPages = Math.ceil(this.selectedCreatorDetail.transactions.length / this.transactionsPerPage);
      this.currentTransactionsPage = 1;
      this.updatePaginatedTransactions();
    }
  }

  updatePaginatedTransactions(): void {
    if (this.selectedCreatorDetail) {
      const startIndex = (this.currentTransactionsPage - 1) * this.transactionsPerPage;
      const endIndex = startIndex + this.transactionsPerPage;
      this.paginatedTransactions = this.selectedCreatorDetail.transactions.slice(startIndex, endIndex);
    }
  }

  previousTransactionsPage(): void {
    if (this.currentTransactionsPage > 1) {
      this.currentTransactionsPage--;
      this.updatePaginatedTransactions();
    }
  }

  nextTransactionsPage(): void {
    if (this.currentTransactionsPage < this.totalTransactionsPages) {
      this.currentTransactionsPage++;
      this.updatePaginatedTransactions();
    }
  }

  closeCreatorDetailsModal(): void {
    this.showCreatorDetailsModal = false;
    this.selectedCreatorDetail = null;
  }

  getTransactionTypeText(type: string): string {
    switch (type) {
      case 'subscription': return 'Suscripción';
      case 'album': return 'Álbum';
      case 'personal_content': return 'Contenido Personalizado';
      case 'donation': return 'Donación';
      default: return type;
    }
  }
}
