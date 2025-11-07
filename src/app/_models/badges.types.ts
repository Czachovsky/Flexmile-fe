export enum CarBadgeType {
  AVAILABLE = 'AVAILABLE',
  NEW = 'NEW',
  USED = 'USED',
  RESERVED = 'RESERVED',
  SALE = 'SALE',
  HOT = 'HOT',
  IMPORTED = 'IMPORTED',
  DEMO = 'DEMO',
  COMING_SOON = 'COMING_SOON'
}

export const CAR_BADGE_CONFIG = {
  [CarBadgeType.AVAILABLE]: {
    label: 'DOSTĘPNY OD RĘKI!',
    icon: 'pi pi-check-circle',
    class: 'car-tile__badge--available'
  },
  [CarBadgeType.NEW]: {
    label: 'NOWY SAMOCHÓD',
    icon: '',
    class: 'car-tile__badge--new'
  },
  [CarBadgeType.USED]: {
    label: 'UŻYWANY',
    icon: '',
    class: 'car-tile__badge--used'
  },
  [CarBadgeType.RESERVED]: {
    label: 'ZAREZERWOWANY',
    icon: 'pi pi-lock',
    class: 'car-tile__badge--reserved'
  },
  [CarBadgeType.SALE]: {
    label: 'PROMOCJA',
    icon: 'pi pi-percentage',
    class: 'car-tile__badge--sale'
  },
  [CarBadgeType.HOT]: {
    label: 'HOT OFERTA',
    icon: 'pi pi-fire',
    class: 'car-tile__badge--hot'
  },
  [CarBadgeType.IMPORTED]: {
    label: 'SPROWADZONY',
    icon: 'pi pi-globe',
    class: 'car-tile__badge--imported'
  },
  [CarBadgeType.DEMO]: {
    label: 'AUTO DEMO',
    icon: 'pi pi-star',
    class: 'car-tile__badge--demo'
  },
  [CarBadgeType.COMING_SOON]: {
    label: 'WKRÓTCE',
    icon: 'pi pi-clock',
    class: 'car-tile__badge--coming-soon'
  }
};
