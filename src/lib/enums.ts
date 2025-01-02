export enum EmailPriority {
  IMMEDIATE = 'immediate',
  REGULAR = 'regular',
  DELAYED = 'delayed',
}

export enum CacheNameEnum {
  EMAIL_JOB = 'email_job',
}

export enum ProfileTypes {
  SERVICE_PROVIDER_USER = 'service_provider_user',
  SERVICE_SUBSCRIBER_USER = 'service_subscriber_user',
}

export enum HospitalityServiceType {
  SUITE_PROPERTY = 'suite-property',
  AUTO_SERVICE = 'auto-service',
  TOURISM = 'tourism',
  VISA = 'visa-service',
}

export enum BookingStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  // AWAITING_PAYMENT = 'awaiting_payment',
  // PAYMENT_CONFIRMED = 'payment_confirmed',
  // PAYMENT_FAILED = 'payment_failed',
}

export enum SuitePropertyType {
  ROOMS = 'rooms',
  // service-apartment
  APARTMENT = 'apartment',
  EVENT_HALL = 'event-hall',
  BEACH_HOUSE = 'beach-house',
}

export enum SuitePropertyCategory {
  ADJACENT_ROOMS = 'adjacent-rooms',
  ACCESIBLE_ROOMS = 'accessible-rooms',
  DUPLEX_ROOMS_SUITE = 'duplex-rooms-suite',
  ADJOINING_JOINT_ROOMS = 'adjoining_joint_rooms',
  CABANA = 'cubana',
  CONNECTING_ROOMS = 'connecting_rooms',
  DOUBLE_ROOM = 'double_room',
  DELUXE_ROOMS = 'deluxe_room',
  DOUBLE_DOUBLE_ROOM = 'double_double_room',
  EXECUTIVE_ROOM = 'executive_room',
  HOLLYWOOD_TWIN = 'hollywood_twin',
  HOSTEL_DORM_ROOM = 'hostel_dorm_room',
  JUNIOR_SUITE_MINI_SUITE = 'junior_suite_mini_suite',
  KING_ROOM = 'king_room',
  MASTER_SUITE_SUITE = 'master_suite_suite',
  MURPHY_ROOM = 'murphy_town',
  PENTHOUSE_ROOM = 'penthouse_room',
  PRESIDENTAL_ROYAL_SUITE = 'presidental_royal_suite',
  POOL_SUITE = 'pool_suite',
  POOL_ACCESS_ROOM = 'pool_access_room',
  QUAD_ROOM = 'quad_room',
  QUEEN_ROOM = 'queen_room',
  SINGLE_ROOM = 'single_room',
  STUDIO_APARTMENT_ROOM = 'studio_apartment_room',
  SMOKING_ROOM = 'smoking_room',
  SUPER_DELUXE = 'super_deluxe',
  TRIPLE_ROOM = 'triple_room',
  TWIN_ROOM = 'twin_room',
  VILLA = 'villa',
  APARTMENT_EXTENDED_STAY_HOTEL_ROOM = 'apartment_extended_stay_hotel_room',
}

export enum TokenCreationPurpose {
  SIGN_UP = 'sign_up',
  RESET_PASSWORD = 'reset_password',
  ACCESS_TOKEN = 'access_token',
  INVITATION_TOKEN = 'invitation_token',
  SINGLE_SIGN_IN = 'single_sign_in',
}

export enum FileMimeType {
  // Images
  JPEG = 'image/jpeg',
  PNG = 'image/png',
  GIF = 'image/gif',
  SVG = 'image/svg+xml',
  WEBP = 'image/webp',

  // Documents
  PDF = 'application/pdf',
  DOC = 'application/msword',
  DOCX = 'app/vnd.ooxml.wordprocessing', // shortened
  XLS = 'application/vnd.ms-excel',
  XLSX = 'app/vnd.ooxml.spreadsheet', // shortened
  PPT = 'application/vnd.ms-powerpoint',
  PPTX = 'app/vnd.ooxml.presentation', // shortened

  // Text
  TXT = 'text/plain',
  RTF = 'application/rtf',

  // Web
  HTML = 'text/html',
  CSS = 'text/css',
  JS = 'application/javascript',
  JSON = 'application/json',

  // Audio
  MP3 = 'audio/mpeg',
  WAV = 'audio/wav',
  OGG = 'audio/ogg',

  // Video
  MP4 = 'video/mp4',
  WEBM = 'video/webm',
  AVI = 'video/x-msvideo',

  // Archives
  ZIP = 'application/zip',
  RAR = 'application/x-rar-compressed',

  // Fallback
  UNKNOWN = 'application/octet-stream',
}

export enum PriceDurations {
  PerHour = 'per_hour',
  PerDay = 'per_day',
  PerNight = 'per_night',
  PerWeek = 'per_week',
  PerMonth = 'per_month',
  PerQuarter = 'per_quarter',
  PerYear = 'per_year',
  PerTwoYears = 'per_two_years',
  PerThreeYears = 'per_three_years',
  PerFourYears = 'per_four_years',
  PerFiveYears = 'per_five_years',
  PerSixYears = 'per_six_years',
  PerSevenYears = 'per_seven_years',
  PerEightYears = 'per_eight_years',
  PerNineYears = 'per_nine_years',
  PerTenYears = 'per_ten_years',
  PerTwentyYears = 'per_twenty_years',
  PerTwentyFiveYears = 'per_twenty_five_years',
}

export enum DynamicFormFieldEnum {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  TEXTAREA = 'textarea',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  FILE = 'file',
}
