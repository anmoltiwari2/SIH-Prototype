import React from 'react';
import { WorkerCard } from './WorkerCard';
import { prisma } from '@/lib/prisma';

interface SearchResultsProps {
  searchParams: Promise<{
    category?: string;
    mode?: string;
    minRating?: string;
  }>;
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
  // Add a small artificial delay so the Suspense boundary shimmer is visible during navigation
  await new Promise(resolve => setTimeout(resolve, 300));

  const params = await searchParams;

  // Next.js searchParams can be arrays if a query param is repeated. 
  // We must strictly cast them to single strings to avoid Prisma type mismatch errors (PrismaClientKnownRequestError).
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const mode = Array.isArray(params.mode) ? params.mode[0] : params.mode;
  const minRatingStr = Array.isArray(params.minRating) ? params.minRating[0] : params.minRating;
  
  let minRating = parseFloat(minRatingStr || '0');
  if (isNaN(minRating)) minRating = 0;

  // Build the Prisma query
  const whereClause: any = {
    cumulativeRating: { gte: minRating },
  };

  const serviceFilter: any = {};

  if (category && category !== 'All Categories') {
    serviceFilter.category = category;
  }

  if (mode === 'ONLINE') {
    serviceFilter.supportsOnline = true;
  } else if (mode === 'OFFLINE') {
    serviceFilter.supportsOffline = true;
  }

  if (Object.keys(serviceFilter).length > 0) {
    whereClause.servicesOffered = {
      some: serviceFilter
    };
  }

  const orderByClause: any = mode === 'OFFLINE'
    ? [
        { serviceRadiusKm: 'asc' },
        { cumulativeRating: 'desc' }
      ]
    : { cumulativeRating: 'desc' };

  let workers: any[] = [];
  try {
    workers = await prisma.workerProfile.findMany({
      where: whereClause,
      include: {
        servicesOffered: true,
      },
      orderBy: orderByClause,
      take: 50 // Limit for safety
    });
  } catch (e) {
    console.warn("Database connection failed in SearchResults, using mock data for prototype.");
    // Generate some mock workers so the search page doesn't look empty!
    workers = [
      {
        id: 'mock-1',
        name: 'Raju Plumber',
        cumulativeRating: 4.8,
        ratingCount: 42,
        gradeTier: 'GOLD',
        serviceRadiusKm: 2.5,
        vouchCount: 12,
        servicesOffered: [
          { category: 'Skilled Home Trades', subcategory: 'Plumbing', payRate: 400, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-2',
        name: 'Anita Cleaner',
        cumulativeRating: 4.5,
        ratingCount: 28,
        gradeTier: 'SILVER',
        serviceRadiusKm: 5.1,
        vouchCount: 8,
        servicesOffered: [
          { category: 'Cleaning', subcategory: 'Deep Cleaning', payRate: 300, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-3',
        name: 'Vikram Electrician',
        cumulativeRating: 4.9,
        ratingCount: 156,
        gradeTier: 'DIAMOND',
        serviceRadiusKm: 1.2,
        vouchCount: 45,
        servicesOffered: [
          { category: 'Skilled Home Trades', subcategory: 'Electrical Repair', payRate: 500, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-4',
        name: 'Priya Tutor',
        cumulativeRating: 4.7,
        ratingCount: 89,
        gradeTier: 'GOLD',
        serviceRadiusKm: 8.4,
        vouchCount: 24,
        servicesOffered: [
          { category: 'Education', subcategory: 'Math Tutoring', payRate: 600, payUnit: 'HOURLY', supportsOnline: true }
        ]
      },
      {
        id: 'mock-5',
        name: 'Suresh Appliance Doctor',
        cumulativeRating: 4.6,
        ratingCount: 54,
        gradeTier: 'GOLD',
        serviceRadiusKm: 3.8,
        vouchCount: 15,
        servicesOffered: [
          { category: 'Repair', subcategory: 'AC Servicing', payRate: 800, payUnit: 'FIXED', supportsOnline: false }
        ]
      },
      {
        id: 'mock-6',
        name: 'Kavita Beautician',
        cumulativeRating: 4.9,
        ratingCount: 210,
        gradeTier: 'DIAMOND',
        serviceRadiusKm: 4.5,
        vouchCount: 65,
        servicesOffered: [
          { category: 'Personal Care', subcategory: 'Salon at Home', payRate: 1200, payUnit: 'FIXED', supportsOnline: false }
        ]
      },
      {
        id: 'mock-7',
        name: 'Amit Gardener',
        cumulativeRating: 4.4,
        ratingCount: 19,
        gradeTier: 'SILVER',
        serviceRadiusKm: 6.2,
        vouchCount: 4,
        servicesOffered: [
          { category: 'Maintenance', subcategory: 'Landscaping', payRate: 350, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-8',
        name: 'Neha Cook',
        cumulativeRating: 4.8,
        ratingCount: 112,
        gradeTier: 'GOLD',
        serviceRadiusKm: 2.1,
        vouchCount: 38,
        servicesOffered: [
          { category: 'Culinary', subcategory: 'Weekly Meal Prep', payRate: 2500, payUnit: 'FIXED', supportsOnline: false }
        ]
      },
      {
        id: 'mock-9',
        name: 'Rajesh Painter',
        cumulativeRating: 4.6,
        ratingCount: 67,
        gradeTier: 'SILVER',
        serviceRadiusKm: 5.5,
        vouchCount: 19,
        servicesOffered: [
          { category: 'Skilled Home Trades', subcategory: 'Wall Painting', payRate: 350, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-10',
        name: 'Sneha Babysitter',
        cumulativeRating: 4.9,
        ratingCount: 88,
        gradeTier: 'GOLD',
        serviceRadiusKm: 3.0,
        vouchCount: 42,
        servicesOffered: [
          { category: 'Caregiving', subcategory: 'Child Care', payRate: 400, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-11',
        name: 'Manoj Mechanic',
        cumulativeRating: 4.7,
        ratingCount: 134,
        gradeTier: 'DIAMOND',
        serviceRadiusKm: 7.2,
        vouchCount: 56,
        servicesOffered: [
          { category: 'Mechanical', subcategory: 'Car Repair', payRate: 1500, payUnit: 'FIXED', supportsOnline: false }
        ]
      },
      {
        id: 'mock-12',
        name: 'Sunita Yoga Instructor',
        cumulativeRating: 4.9,
        ratingCount: 201,
        gradeTier: 'DIAMOND',
        serviceRadiusKm: 0,
        vouchCount: 89,
        servicesOffered: [
          { category: 'Fitness', subcategory: 'Yoga Training', payRate: 600, payUnit: 'HOURLY', supportsOnline: true }
        ]
      },
      {
        id: 'mock-13',
        name: 'Deepak Carpenter',
        cumulativeRating: 4.5,
        ratingCount: 45,
        gradeTier: 'SILVER',
        serviceRadiusKm: 4.8,
        vouchCount: 11,
        servicesOffered: [
          { category: 'Skilled Home Trades', subcategory: 'Furniture Repair', payRate: 500, payUnit: 'HOURLY', supportsOnline: false }
        ]
      },
      {
        id: 'mock-14',
        name: 'Pooja Pet Sitter',
        cumulativeRating: 4.8,
        ratingCount: 76,
        gradeTier: 'GOLD',
        serviceRadiusKm: 2.8,
        vouchCount: 33,
        servicesOffered: [
          { category: 'Caregiving', subcategory: 'Dog Walking', payRate: 200, payUnit: 'HOURLY', supportsOnline: false }
        ]
      }
    ];

    // Simple in-memory filtering for the mock data so search actually works
    if (category && category !== 'All Categories') {
      workers = workers.filter(w => w.servicesOffered.some(s => s.category === category));
    }
    if (mode === 'ONLINE') {
      workers = workers.filter(w => w.servicesOffered.some(s => s.supportsOnline));
    } else if (mode === 'OFFLINE') {
      workers = workers.filter(w => w.servicesOffered.some(s => !s.supportsOnline));
    }
    if (minRating > 0) {
      workers = workers.filter(w => w.cumulativeRating >= minRating);
    }
  }

  if (workers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-[var(--glass-border)] rounded-2xl bg-[var(--glass-bg)] backdrop-blur-md">
        <h3 className="text-xl font-bold mb-2">No workers found</h3>
        <p className="opacity-70">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
      {workers.map(worker => {
        // Find primary service for card display
        const primaryService = worker.servicesOffered[0] || { category: 'Unknown', subcategory: 'Unknown', payRate: 0, payUnit: 'HOURLY' };
        
        return (
          <WorkerCard 
            key={worker.id} 
            worker={{
              id: worker.id,
              name: worker.name,
              category: primaryService.category,
              subcategory: primaryService.subcategory,
              gradeTier: worker.gradeTier,
              cumulativeRating: worker.cumulativeRating,
              reviewCount: worker.ratingCount,
              price: primaryService.payRate,
              priceUnit: primaryService.payUnit,
              distanceKm: Math.round(worker.serviceRadiusKm || 5),
              isOnline: primaryService.supportsOnline,
              vouched: worker.vouchCount > 5,
              avatar: `https://i.pravatar.cc/150?u=${worker.id}`
            }} 
          />
        );
      })}
    </div>
  );
}
