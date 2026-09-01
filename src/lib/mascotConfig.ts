export type MascotRole = 'CUSTOMER' | 'WORKER';

export type CustomerMascotKey = 
  | 'PLUMBER' 
  | 'ELECTRICIAN' 
  | 'HOUSEHELP' 
  | 'GARDENER' 
  | 'TEACHER' 
  | 'DOCTOR' 
  | 'COOK';

export type WorkerMascotKey = 
  | 'HERA_PHERI' 
  | 'SRK_SALMAN' 
  | 'BARFI' 
  | 'MUNNA_CIRCUIT' 
  | 'GEET' 
  | 'DEEPIKA' 
  | 'JAI_VEERU';

export const customerMascots: Record<CustomerMascotKey, { image: string; name: string }> = {
  PLUMBER: { image: '/mascots/customer/plumber.jpg', name: 'Plumber' },
  ELECTRICIAN: { image: '/mascots/customer/electrician.jpg', name: 'Electrician' },
  HOUSEHELP: { image: '/mascots/customer/househelp.jpg', name: 'Househelp' },
  GARDENER: { image: '/mascots/customer/gardener.jpg', name: 'Gardener' },
  TEACHER: { image: '/mascots/customer/teacher.jpg', name: 'Teacher' },
  DOCTOR: { image: '/mascots/customer/doctor.jpg', name: 'Doctor' },
  COOK: { image: '/mascots/customer/cook.jpg', name: 'Cook' },
};

export const workerMascots: Record<WorkerMascotKey, { image: string; name: string }> = {
  HERA_PHERI: { image: '/mascots/worker/hera-pheri.jpeg', name: 'Hera Pheri Trio' },
  SRK_SALMAN: { image: '/mascots/worker/srk-salman.jpg', name: 'SRK & Salman' },
  BARFI: { image: '/mascots/worker/barfi.jpg', name: 'Barfi' },
  MUNNA_CIRCUIT: { image: '/mascots/worker/munna-circuit.jpg', name: 'Munna & Circuit' },
  GEET: { image: '/mascots/worker/geet.jpg', name: 'Geet' },
  DEEPIKA: { image: '/mascots/worker/deepika.jpg', name: 'Deepika' },
  JAI_VEERU: { image: '/mascots/worker/jai-veeru.jpg', name: 'Jai & Veeru' },
};

export function getMascotAsset(role: MascotRole, key: string | null): string {
  if (!key) return ''; // Return empty string or a default asset if none selected
  if (role === 'CUSTOMER') {
    const mascot = customerMascots[key as CustomerMascotKey];
    return mascot ? mascot.image : '';
  } else {
    const mascot = workerMascots[key as WorkerMascotKey];
    return mascot ? mascot.image : '';
  }
}
