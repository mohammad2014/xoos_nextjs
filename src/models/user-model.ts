import { ImageTs } from "@/types/imageTs";
import { Role } from "./role-model";
import { RowData } from "./row-data";

interface City {
  id: number;
  title: string;
}

export interface User extends RowData {
  id: number;
  first_name: string;
  last_name: string;
  nickname: string;
  mobile: string;
  avatar_id: number | null;
  avatar: ImageTs;
  email: string;
  role_id: number;
  status: string;
  phone: string | null;
  phone_code: string | null;
  gender: "male" | "female" | string;
  birthdate_jalali: string;
  national_code: string;
  level: "bronze" | "silver" | "gold" | string;
  city_id: number;
  address: string;
  address_plaque: string;
  address_floor: string;
  address_unit: string;
  postal_code: string;
  education: string;
  job: string;
  date_marriage: string | null;
  full_name: string;
  phone_full: string;
  role: Role;
  city: City;
}
