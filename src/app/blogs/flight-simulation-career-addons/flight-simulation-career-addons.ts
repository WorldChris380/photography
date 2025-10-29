import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

type Sim = 'MSFS' | 'X-Plane' | 'P3D' | 'DCS' | 'FSX';
type Category = 'commercial' | 'community' | 'companion';
type PriceType = 'free' | 'pay' | 'subscription' | 'planned';

interface Addon {
  name: string;
  sims: Sim[];
  category: Category;
  priceType: PriceType;
  priceLabel: string; // e.g., 'Free', 'See website', 'Subscription'
  link: string;
  linkLabel: string;
  description: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-simulation-career-addons.html',
  styleUrls: ['./flight-simulation-career-addons.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Blog {
  sims: Array<Sim | 'ALL'> = ['ALL', 'MSFS', 'X-Plane', 'P3D', 'DCS', 'FSX'];
  selectedSim: Sim | 'ALL' = 'ALL';

  addons: Addon[] = [
    {
      name: 'NeoFly 4',
      sims: ['MSFS'],
      category: 'commercial',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://www.neofly.net',
      linkLabel: 'neofly.net',
      description: 'Mission system (charter, cargo, bush, passengers), economy & progression, community missions for solo careers.'
    },
    {
      name: 'OnAir (Airline Manager)',
      sims: ['MSFS', 'X-Plane', 'P3D', 'FSX'],
      category: 'commercial',
      priceType: 'subscription',
      priceLabel: 'Subscription',
      link: 'https://www.onair.company',
      linkLabel: 'onair.company',
      description: 'Real-world routes, airline management, finances, multiplayer economy. Great for VA management and online careers.'
    },
    {
      name: 'Air Hauler 2',
      sims: ['MSFS', 'P3D'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See store',
      link: 'https://www.justflight.com/product/air-hauler-2-microsoft-flight-simulator',
      linkLabel: 'Just Flight',
      description: 'Run your own airline/cargo company with management, finances, jobs, staff & VA support. Focus on economy and immersion.'
    },
    {
      name: 'FSEconomy',
      sims: ['MSFS', 'X-Plane', 'P3D', 'FSX'],
      category: 'commercial',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://www.fseconomy.net',
      linkLabel: 'fseconomy.net',
      description: 'Global persistent economy with jobs, market mechanics, aircraft leasing & airports. Community-driven service.'
    },
    {
      name: "A Pilot's Life (Chapter 2)",
      sims: ['MSFS', 'X-Plane', 'P3D'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://www.simbitworld.com/apl-v2',
      linkLabel: 'SimBitWorld',
      description: 'Airline career with real schedules, ranks, ratings & progression. Strong realism focus.'
    },
    {
      name: 'The SkyPark (Parallel 42)',
      sims: ['MSFS'],
      category: 'commercial',
      priceType: 'pay',
      priceLabel: 'See website',
      link: 'https://theskypad.net/',
      linkLabel: 'theskypad.net',
      description: 'Mission network with passenger & cargo contracts, progression and online economy.'
    },
    {
      name: 'Fly The Line (announced)',
      sims: ['MSFS'],
      category: 'commercial',
      priceType: 'planned',
      priceLabel: 'TBD',
      link: 'https://www.justflight.com/',
      linkLabel: 'Just Flight (announcement)',
      description: 'Ambitious airline-life project with off-duty, finance and health mechanics. In development.'
    },

    // Community / open-source career modes
    {
      name: 'BushTalk Radio Missions',
      sims: ['MSFS'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://bushtalkradio.com',
      linkLabel: 'bushtalkradio.com',
      description: 'Story & mission system with worldwide audio tours. No economy, but great for role-play and immersion.'
    },
    {
      name: 'Mission Generator',
      sims: ['MSFS'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://flightsim.to/file/2542/msfs-mission-generator',
      linkLabel: 'flightsim.to',
      description: 'Generates random charter, rescue and sightseeing missions; a lightweight career mode for single players.'
    },
    {
      name: 'DCS Liberation',
      sims: ['DCS'],
      category: 'community',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://dcs-liberation.org/',
      linkLabel: 'dcs-liberation.org',
      description: 'Dynamic campaign generator for DCS World with persistent operations, logistics and strategy.'
    },

    // Companions & tracking (no economy)
    {
      name: 'Volanta',
      sims: ['MSFS', 'X-Plane', 'P3D', 'FSX'],
      category: 'companion',
      priceType: 'free',
      priceLabel: 'Free (optional Plus)',
      link: 'https://volanta.app/',
      linkLabel: 'volanta.app',
      description: 'Flight tracking, logbook, community events. No economy — a great companion for any career mode.'
    },
    {
      name: 'SimToolkitPro',
      sims: ['MSFS', 'X-Plane', 'P3D'],
      category: 'companion',
      priceType: 'free',
      priceLabel: 'Free',
      link: 'https://simtoolkitpro.co.uk/',
      linkLabel: 'simtoolkitpro.co.uk',
      description: 'Planning, tracking, stats and integrations; a popular companion tool for many sims.'
    }
  ];

  selectSim(sim: Sim | 'ALL') {
    this.selectedSim = sim;
  }

  filtered(category: Category): Addon[] {
    return this.addons.filter(a => a.category === category && (this.selectedSim === 'ALL' || a.sims.includes(this.selectedSim)));
  }

  compatibilityLabel(a: Addon): string {
    const order: Sim[] = ['MSFS', 'X-Plane', 'P3D', 'DCS', 'FSX'];
    const map: Record<Sim, string> = {
      MSFS: 'MSFS 2020/2024',
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
