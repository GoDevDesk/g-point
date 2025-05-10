import { Component, OnInit } from '@angular/core';
import { ChartType, ChartData, ChartOptions } from 'chart.js';

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
  billingGoal: number = 20000;
  sidebarActive: boolean = false;
  showRankInfo: boolean = false;
  
  // Rank system
  ranks: Rank[] = [
    { name: 'Bronze', goal: 0, color: '#CD7F32', icon: '🥉' },
    { name: 'Silver', goal: 5000, color: '#C0C0C0', icon: '🥈' },
    { name: 'Gold', goal: 15000, color: '#FFEB3B', icon: '🥇' },
    { name: 'Diamond', goal: 30000, color: '#B9F2FF', icon: '💎' }
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

  constructor() { }

  ngOnInit(): void {
    this.loadData();
    this.updateChart();
  }

  loadData(): void {
    // Simulated data - Replace with real service call
    this.totalBilled = 19000;
    
    this.sales = {
      totalSales: 5000,
      albumsSold: 25,
      donationsReceived: 2000,
      donationsCount: 15,
      chatSales: 1000
    };

    this.community = {
      followers: 1000,
      subscribers: 500
    };

    this.content = {
      albumsCount: 10,
      photosCount: 150,
      videosCount: 25
    };
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
