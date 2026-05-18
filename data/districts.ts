import type { District } from "@/types";

const names: Record<string, string[]> = {
  dodoma: ["Dodoma Urban", "Chamwino", "Kongwa", "Mpwapwa", "Bahi"],
  shinyanga: ["Shinyanga Urban", "Kahama", "Kishapu", "Ushetu"],
  mwanza: ["Ilemela", "Nyamagana", "Sengerema", "Misungwi"],
  arusha: ["Arusha Urban", "Arumeru", "Karatu", "Monduli"],
  kilimanjaro: ["Moshi", "Hai", "Rombo", "Siha"],
  morogoro: ["Morogoro Urban", "Kilosa", "Kilombero", "Mvomero"],
  mbeya: ["Mbeya Urban", "Rungwe", "Kyela", "Mbarali"],
  iringa: ["Iringa Urban", "Kilolo", "Mufindi", "Iringa Rural"],
  njombe: ["Njombe Town", "Makambako", "Wanging'ombe", "Ludewa"],
  mtwara: ["Mtwara Urban", "Masasi", "Newala", "Tandahimba"],
  lindi: ["Lindi Urban", "Nachingwea", "Ruangwa", "Kilwa"],
  tanga: ["Tanga City", "Muheza", "Lushoto", "Korogwe"],
  kagera: ["Bukoba", "Muleba", "Karagwe", "Missenyi"],
  ruvuma: ["Songea", "Mbinga", "Tunduru", "Namtumbo"],
  singida: ["Singida Urban", "Manyoni", "Iramba", "Ikungi"],
  tabora: ["Tabora Urban", "Nzega", "Urambo", "Sikonge"],
  manyara: ["Babati", "Hanang", "Mbulu", "Simanjiro"],
  "dar-es-salaam": ["Kinondoni", "Ilala", "Temeke", "Ubungo", "Kigamboni"],
};

export const districts: District[] = Object.entries(names).flatMap(([regionId, districtNames]) =>
  districtNames.map((name) => ({ id: `${regionId}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, regionId, name })),
);
