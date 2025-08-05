export interface BannerData {
  title?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  image_info?: {
    url: string | StaticImageData;
  };
}

export interface Section1 {
  data: BannerData;
}

export type Section2 = {
  description: string;
};

export type Section3 = {
  title: string;
  description: string;
};

export type Section4Item = {
  id: number;
  imageSrc: StaticImageData;
  title: string;
  description: string;
};

export interface Section5 {
  data: BannerData;
}

export type AboutUsInfoProps = {
  section1: Section1;
  section2: Section2;
  section3: Section3;
  section4: Section4Item[];
  section5: Section5;
};
