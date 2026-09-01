import React, { Suspense } from 'react';
import { FilterPanel } from '@/components/search/FilterPanel';
import { SearchResults } from '@/components/search/SearchResults';
import { Search as SearchIcon } from 'lucide-react';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold mb-2 text-[var(--foreground)]">Find Help Near You</h1>
        <p className="opacity-70 text-lg">Browse verified professionals ready to assist you.</p>
      </div>

      {/* Main Search Bar */}
      <div className="relative mb-10 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--primary)]">
          <SearchIcon size={24} />
        </div>
        <input 
          type="text" 
          placeholder="What do you need help with?" 
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all text-lg font-medium"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <FilterPanel />
        </div>

        {/* Results Grid */}
        <div className="w-full lg:w-3/4">
          <Suspense 
            key={JSON.stringify(params)} 
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-44" />)}
              </div>
            }
          >
            <SearchResults searchParams={Promise.resolve(params as any)} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
