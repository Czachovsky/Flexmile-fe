export interface OfferFilters {
  car_brand?: string;
  car_model?: string;
  body_type?: string;
  fuel_type?: string;
  year_from?: number;
  year_to?: number;
  max_mileage?: number;
  price_from?: number;
  price_to?: number;
  page?: number;
  per_page?: number;
}

interface OfferAttributesModel {
  available_immediately: boolean;
  coming_soon: boolean;
  featured: boolean;
  new: boolean;
  popular: boolean;
}

interface OfferSpecsModel {
  color: string;
  doors: number;
  drivetrain: string;
  engine: string;
  engine_capacity: number;
  horsepower: number;
  mileage: number;
  seats: number;
  transmission: string;
  vin_number: string;
  year: number;
}

interface OfferPricingModel {
  lowest_price: number;
  mileage_limits: number[];
  rental_periods: number[];
  price_matrix: { [key: string]: number };
}

export interface OfferGalleryModel {
  id: number;
  large: string;
  medium: string;
  thumbnail: string;
  url: string;
}

export interface OfferModel {
  title: string;
  thumbnail: boolean;
  model: string;
  available: boolean;
  car_reference_id: string;
  id: number;
  description: string;
  fuel_type: string;
  brand: { name: string; slug: string; };
  body_type: string;
  attributes: OfferAttributesModel;
  specs: OfferSpecsModel;
  pricing: OfferPricingModel;
  gallery: OfferGalleryModel[];
  standard_equipment?: string[];
  additional_equipment?: string[];
}

interface OfferListMetaModel {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface OfferListOffersModel {
  title: string;
  model: string;
  available: boolean;
  id: number;


}

export interface OfferListModel {
  offers: OfferModel[];
  meta: OfferListMetaModel;
}

export enum TransmissionType {
  manual = 'Manualna',
  automatic = 'Automatyczna'
}

export enum DrivetrainType {
  FWD = 'FWD (przedni)',
  RWD = 'RWD (tylny)',
  AWD = 'AWD (4x4)',
  '4WD' = '4WD (4x4 dołączany)'
}

export enum FuelType {
  diesel = 'Diesel',
  petrol = 'Bezołowiowa',
  electric = 'Elektryczny',
  hybrid = 'Hybryda',
  plug_in_hybrid = 'Hybryda Plug-in'
}

export enum BodyType {
  suv = 'SUV',
  sedan = 'Sedan',
  hatchback = 'Hatchback',
  combi = 'Kombi',
  coupe = 'Coupe',
}
