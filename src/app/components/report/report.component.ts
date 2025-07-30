import { Component, OnInit } from '@angular/core';
import { ChartType, ChartData, ChartOptions } from 'chart.js';
import { InformationService } from '../../services/information.service';
import { Information } from '../../models/information';

interface Rank {
  name: string;
  goal: number;
  color: string;
  icon: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  // Billing data
  totalBilled: number = 0;
  sidebarActive: boolean = false;
  showRankInfo: boolean = false;
  loading: boolean = true;
  
  // Rank system
  ranks: Rank[] = [
    { name: 'Bronze', goal: 0, color: '#CD7F32', icon: '🥉' },
    { name: 'Silver', goal: 500000, color: '#C0C0C0', icon: '🥈' },
    { name: 'Gold', goal: 2500000, color: '#FFEB3B', icon: '🥇' },
    { name: 'Diamond', goal: 10000000, color: '#B9F2FF', icon: '💎' }
  ];

  // Sales data
  sales: {
    totalSales: number;
    albumsSold: number;
    donationsReceived: number;
    donationsCount: number;
    chatSales: number;
  } = {
    totalSales: 0,
    albumsSold: 0,
    donationsReceived: 0,
    donationsCount: 0,
    chatSales: 0
  };

  // Community data
  community: {
    followers: number;
    subscribers: number;
  } = {
    followers: 0,
    subscribers: 0
  };

  // Content data
  content: {
    albumsCount: number;
    photosCount: number;
    videosCount: number;
  } = {
    albumsCount: 0,
    photosCount: 0,
    videosCount: 0
  };

  // Navigation sections
  sections = [
    { id: 'billing', name: 'Billing' },
    { id: 'sales', name: 'Sales' },
    { id: 'community', name: 'Community' },
    { id: 'content', name: 'Content' },
    { id: 'analysis', name: 'Analysis' }
  ];

  // Análisis de ventas
  chartType: ChartType = 'line';
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Evolución de Ventas'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };
  selectedFilter: string = 'all';

  // Datos de ejemplo para el gráfico (simulados)
  private salesHistory = {
    dates: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    albums: [1000, 1500, 2000, 1800, 2200, 2500],
    chat: [500, 800, 1200, 1000, 1500, 1800],
    donations: [800, 1200, 1500, 1300, 1600, 2000]
  };

  constructor(private informationService: InformationService) { }

  ngOnInit(): void {
    this.loadData();
    this.updateChart();
  }

  loadData(): void {
    this.loading = true;
    this.informationService.getInformation().subscribe({
      next: (data: Information) => {
        // Actualizar datos de facturación
        this.totalBilled = data.totalAmount;
        
        // Actualizar datos de ventas
        this.sales = {
          totalSales: data.totalSales,
          albumsSold: data.selledAlbums,
          donationsReceived: data.donationsAmount,
          donationsCount: data.selledDonations,
          chatSales: data.chatAmount
        };

        // Actualizar datos de comunidad
        this.community = {
          followers: 0,
          subscribers: data.activeSubscriptions
        };

        // Actualizar datos de contenido
        this.content = {
          albumsCount: data.publishedAlbums,
          photosCount: data.photos,
          videosCount: data.videos
        };
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar la información:', error);
        // Mantener datos por defecto en caso de error
        this.loading = false;
      }
    });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 768) {
        this.toggleSidebar();
      }
    }
  }

  getCurrentRank(): Rank {
    return this.ranks.reduce((prev, current) => {
      return (this.totalBilled >= current.goal) ? current : prev;
    });
  }

  getNextRank(): Rank | null {
    const currentRank = this.getCurrentRank();
    const currentIndex = this.ranks.indexOf(currentRank);
    return currentIndex < this.ranks.length - 1 ? this.ranks[currentIndex + 1] : null;
  }

  getCurrentLevelProgress(): number {
    const currentRank = this.getCurrentRank();
    const nextRank = this.getNextRank();
    
    if (!nextRank) return 100;
    
    const levelStart = currentRank.goal;
    const levelEnd = nextRank.goal;
    const currentProgress = this.totalBilled - levelStart;
    const levelTotal = levelEnd - levelStart;
    
    return (currentProgress / levelTotal) * 100;
  }

  getFormattedProgress(): string {
    return `${Math.min(this.getCurrentLevelProgress(), 100).toFixed(1)}%`;
  }

  toggleSidebar(): void {
    this.sidebarActive = !this.sidebarActive;
  }

  toggleRankInfo(): void {
    this.showRankInfo = !this.showRankInfo;
  }

  updateChart(): void {
    const datasets = [];
    
    if (this.selectedFilter === 'all' || this.selectedFilter === 'albums') {
      datasets.push({
        label: 'Ventas de Álbumes',
        data: this.salesHistory.albums,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4
      });
    }
    
    if (this.selectedFilter === 'all' || this.selectedFilter === 'chat') {
      datasets.push({
        label: 'Ventas por Chat',
        data: this.salesHistory.chat,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        tension: 0.4
      });
    }
    
    if (this.selectedFilter === 'all' || this.selectedFilter === 'donations') {
      datasets.push({
        label: 'Donaciones',
        data: this.salesHistory.donations,
        borderColor: '#FF9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        tension: 0.4
      });
    }

    this.chartData = {
      labels: this.salesHistory.dates,
      datasets: datasets
    };
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.updateChart();
  }
}
