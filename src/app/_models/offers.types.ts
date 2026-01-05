export interface OfferFilters {
  car_brand?: string;
  car_model?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  year_from?: number;
  year_to?: number;
  max_mileage?: number;
  price_from?: number;
  price_to?: number;
  page?: number;
  per_page?: number;
  order?: string;
  orderby?: string;
  available_immediately?: boolean;
  only_reserved?: boolean;
}

interface OfferAttributesModel {
  available_immediately: boolean;
  coming_soon: boolean;
  new: boolean;
  popular: boolean;
}

interface OfferSpecsModel {
  color: string;
  doors: number;
  drivetrain: string;
  engine: string;
  engine_capacity: number;
  seats: number;
  transmission: string;
  year: number;
  horsepower: number;
  co2_emission: number;
  condition: string;
  interior_color: string;
  mileage?: number;
}

interface OfferPricingModel {
  lowest_price: number;
  display_price?: number;
  mileage_limits: number[];
  rental_periods: number[];
  initial_payments: number[];
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
  coming_soon_date?: string;
  custom_additional_data: {title: string, description: string}[];
  additional_services: AdditionalServicesModel;
}

interface AdditionalServicesModel {
  financing: AdditionalServiceModel;
  vehicle_service: AdditionalServiceModel;
  insurance_oc_ac_nnw: AdditionalServiceModel;
  assistance_24h: AdditionalServiceModel;
  summer_winter_tires: AdditionalServiceModel;
  [key: string]: any;
}

interface AdditionalServiceModel {
  enabled: boolean;
  description: string;
  title: string;
}

interface OfferListMetaModel {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}



export interface OfferListOffersModel {
  id: number;
  car_reference_id: string;
  title: string;
  slug: string;
  image: string;
  engine: string;
  horsepower: number;
  transmission: string;
  year: number;
  mileage: number;
  brand: {
    slug: string;
    name: string;
  };
  model: string;
  body_type: string;
  fuel_type: string;
  price_from: number;
  attributes: OfferAttributesModel;
  available: boolean;
  engine_capacity: number;
  coming_soon_date?: string;
  additional_services: AdditionalServicesModel;
}

export interface OfferListModel {
  offers: OfferListOffersModel[];
  meta: OfferListMetaModel;
}

export enum ConditionType {
  demo = 'Demo',
  new = 'Nowy',
  used = 'Używany',
  ex_lease = 'Poleasingowy',
  ex_contract = 'Pokontraktowy'
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
  petrol = 'Benzyna',
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
  dostawczy = 'Dostawczy',
  van = 'Van'
}

export enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderbyType {
  date = 'date',
  price = 'price',
}

export interface SortByListModel {
  label: string;
  selected: boolean;
  order: OrderType;
  orderBy: OrderbyType;
}
