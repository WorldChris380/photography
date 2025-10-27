import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Sim = 'MSFS2020' | 'MSFS2024' | 'X-Plane' | 'P3D' | 'DCS' | 'FSX';
type Category = 'commercial' | 'community' | 'companion';
type PriceType = 'free' | 'pay' | 'subscription' | 'planned';
type PriceFilter = 'ALL' | 'free' | 'pay';

interface Addon {
  name: string;
  sims: Sim[];
  category: Category;
  priceType: PriceType;
  priceLabel: string; // e.g., 'Free', 'See website', 'Subscription'
  link: string;
  linkLabel: string;
  description: string;
  pros: string;
  cons: string;
}

interface Comment {
  id: string;
  author: string;
  date: Date;
  text: string;
}

@Component({
  selector: 'app-flight-simulation-career-addons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flight-simulation-career-addons.html',
  styleUrls: ['./flight-simulation-career-addons.scss']
})
export class FlightSimulationCareerAddons implements OnInit {
  sims: Array<Sim | 'ALL'> = ['ALL', 'MSFS2020', 'MSFS2024', 'X-Plane', 'P3D', 'DCS', 'FSX'];
  selectedSim: Sim | 'ALL' = 'ALL';
  
  priceFilters: Array<PriceFilter> = ['ALL', 'free', 'pay'];
  selectedPriceFilter: PriceFilter = 'ALL';

  // Comments
  comments: Comment[] = [];
  newCommentAuthor: string = '';
  newCommentText: string = '';
  private readonly STORAGE_KEY = 'flight-sim-blog-comments';

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.comments = JSON.parse(stored).map((c: any) => ({
        ...c,
        date: new Date(c.date)
      }));
    }
  }

  saveComments() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.comments));
  }

  addComment() {
    if (this.newCommentAuthor.trim() && this.newCommentText.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: this.newCommentAuthor.trim(),
        date: new Date(),
        text: this.newCommentText.trim()
      };
      this.comments.unshift(comment);
      this.saveComments();
      this.newCommentAuthor = '';
      this.newCommentText = '';
    }
  }

  deleteComment(id: string) {
    this.comments = this.comments.filter(c => c.id !== id);
    this.saveComments();
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  addons: Addon[] = [
    // Commercial/official (includes free services)
    {
      name: 'NeoFly 4',
      sims: ['MSFS2020', 'MSFS2024'],
      category: 'commercial',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://www.neofly.net',
      linkLabel: 'neofly.net',
      description: 'Mission system (charter, cargo, bush, passengers), economy & progression, community missions for solo careers.',
      pros: 'Free, active community, regular updates, varied missions',
      cons: 'MSFS only, UI can be overwhelming for beginners'
    },
    {
      name: 'OnAir (Airline Manager)',
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D', 'FSX'],
      category: 'commercial',
      priceType: 'subscription',
      priceLabel: 'Subscription',
      link: 'https://www.onair.company',
      linkLabel: 'onair.company',
      description: 'Real-world routes, airline management, finances, multiplayer economy. Great for VA management and online careers.',
      pros: 'Multi-sim support, deep economy, multiplayer, VA management',
      cons: 'Subscription required, steep learning curve, requires internet'
    },
    {
      name: 'Air Hauler 2',
      sims: ['MSFS2020', 'MSFS2024', 'P3D'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See store',
      link: 'https://www.justflight.com/product/air-hauler-2-microsoft-flight-simulator',
      linkLabel: 'Just Flight',
      description: 'Run your own airline/cargo company with management, finances, jobs, staff & VA support. Focus on economy and immersion.',
      pros: 'Deep business simulation, offline mode, mature product',
      cons: 'One-time cost, limited sim support, complex for casual players'
    },
    {
      name: 'FSEconomy',
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D', 'FSX'],
      category: 'commercial',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://www.fseconomy.net',
      linkLabel: 'fseconomy.net',
      description: 'Global persistent economy with jobs, market mechanics, aircraft leasing & airports. Community-driven service.',
      pros: 'Free, multi-sim, persistent world economy, large community',
      cons: 'Dated interface, steep learning curve, requires online connection'
    },
    {
      name: "A Pilot's Life (Chapter 2)",
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://www.simbitworld.com/apl-v2',
      linkLabel: 'SimBitWorld',
      description: 'Airline career with real schedules, ranks, ratings & progression. Strong realism focus.',
      pros: 'Real schedules, structured progression, multi-sim support',
      cons: 'Paid product, less flexibility than open-ended careers'
    },
    {
      name: 'The SkyPark (Parallel 42)',
      sims: ['MSFS2020', 'MSFS2024'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://theskypad.net/',
      linkLabel: 'theskypad.net',
      description: 'Mission network with passenger & cargo contracts, progression and online economy.',
      pros: 'Modern UI, integrated with MSFS, active development',
      cons: 'MSFS only, paid product, requires internet for full features'
    },
    {
      name: 'Fly The Line',
      sims: ['MSFS2020', 'MSFS2024'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://www.justflight.com/product/fly-the-line-microsoft-flight-simulator',
      linkLabel: 'Just Flight',
      description: 'Comprehensive airline-life simulator with off-duty activities, finances, health mechanics and career progression.',
      pros: 'Unique life simulation features, detailed career progression, immersive',
      cons: 'MSFS only, paid product, complex systems may overwhelm casual players'
    },
    {
      name: 'Passenger2',
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://www.passenger2.com/passenger2-classic/',
      linkLabel: 'Passenger2',
      description: 'Passenger simulation with in-flight services, passenger satisfaction, and career progression.',
      pros: 'Detailed passenger simulation, multi-sim support, immersive',
      cons: 'Paid product, focus on passenger flights only'
    },
    {
      name: 'Passenger X2',
      sims: ['P3D', 'FSX'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://www.passenger2.com/',
      linkLabel: 'Passenger X2',
      description: 'Advanced passenger simulation with dynamic events, in-flight announcements, and detailed analytics.',
      pros: 'Detailed passenger mechanics, realistic announcements',
      cons: 'Older sim platforms only, paid product, no MSFS/X-Plane support'
    },

    // Community / open-source career modes
    {
      name: 'BushTalk Radio Missions',
      sims: ['MSFS2020', 'MSFS2024'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://bushtalkradio.com',
      linkLabel: 'bushtalkradio.com',
      description: 'Story & mission system with worldwide audio tours. No economy, but great for role-play and immersion.',
      pros: 'Free, excellent audio tours, great for sightseeing',
      cons: 'No economy system, MSFS only, limited replayability'
    },
    {
      name: 'Mission Generator',
      sims: ['MSFS2020', 'MSFS2024'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://flightsim.to/file/2542/msfs-mission-generator',
      linkLabel: 'flightsim.to',
      description: 'Generates random charter, rescue and sightseeing missions; a lightweight career mode for single players.',
      pros: 'Free, simple to use, random mission variety',
      cons: 'Basic features, no economy, MSFS only, limited depth'
    },
    {
      name: 'DCS Liberation',
      sims: ['DCS'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://dcs-liberation.org/',
      linkLabel: 'dcs-liberation.org',
      description: 'Dynamic campaign generator for DCS World with persistent operations, logistics and strategy.',
      pros: 'Free, deep strategic gameplay, active development',
      cons: 'DCS only, complex setup, military focus only'
    },

    // Companions & tracking (no economy)
    {
      name: 'Volanta',
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D', 'FSX'],
      category: 'companion',
      priceType: 'free',
      priceLabel: 'Free (optional Plus)',
      link: 'https://volanta.app/',
      linkLabel: 'volanta.app',
      description: 'Flight tracking, logbook, community events. No economy — a great companion for any career mode.',
      pros: 'Free, multi-sim, excellent tracking, social features',
      cons: 'No career/economy features, Plus subscription for advanced features'
    },
    {
      name: 'SimToolkitPro',
      sims: ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D'],
      category: 'companion',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://simtoolkitpro.co.uk/',
      linkLabel: 'simtoolkitpro.co.uk',
      description: 'Planning, tracking, stats and integrations; a popular companion tool for many sims.',
      pros: 'Free, multi-sim, good integrations, detailed stats',
      cons: 'No career/economy features, learning curve for all features'
    }
  ];

  selectSim(sim: Sim | 'ALL') {
    this.selectedSim = sim;
  }

  selectPriceFilter(filter: PriceFilter) {
    this.selectedPriceFilter = filter;
  }

  filtered(category: Category): Addon[] {
    return this.addons.filter(a => {
      const simMatch = this.selectedSim === 'ALL' || a.sims.includes(this.selectedSim);
      const priceMatch = this.selectedPriceFilter === 'ALL' || 
                         (this.selectedPriceFilter === 'free' && (a.priceType === 'free')) ||
                         (this.selectedPriceFilter === 'pay' && (a.priceType === 'pay' || a.priceType === 'subscription'));
      return a.category === category && simMatch && priceMatch;
    });
  }

  hasSim(addon: Addon, sim: Sim): boolean {
    return addon.sims.includes(sim);
  }

  simLabel(sim: Sim): string {
    const labels: Record<Sim, string> = {
      MSFS2020: '2020',
      MSFS2024: '2024',
      'X-Plane': 'XP',
      P3D: 'P3D',
      DCS: 'DCS',
      FSX: 'FSX'
    };
    return labels[sim];
  }

  compatibilityLabel(a: Addon): string {
    const order: Sim[] = ['MSFS2020', 'MSFS2024', 'X-Plane', 'P3D', 'DCS', 'FSX'];
    const map: Record<Sim, string> = {
      MSFS2020: 'MSFS 2020',
      MSFS2024: 'MSFS 2024',
      'X-Plane': 'X-Plane 12',
      P3D: 'Prepar3D',
      DCS: 'DCS World',
      FSX: 'FSX'
    };
    return order.filter(s => a.sims.includes(s)).map(s => map[s] + ' ✓').join(' — ');
  }

  priceBadgeClass(a: Addon): string {
    switch (a.priceType) {
      case 'free': return 'badge free';
      case 'subscription': return 'badge pay';
      case 'pay': return 'badge pay';
      case 'planned': return 'badge';
    }
  }

}
