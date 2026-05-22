export interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
  propertiesCount: number;
  averagePrice: string;
  description: string;
  popularFor: string;
  tag: string;
}

export const CITIES: City[] = [
  {
    id: "florianopolis",
    name: "Florianópolis",
    lat: -27.5954,
    lng: -48.5480,
    zoom: 11,
    propertiesCount: 342,
    averagePrice: "R$ 1.2M",
    description: "A Ilha da Magia combina praias deslumbrantes, qualidade de vida excepcional e infraestrutura de ponta.",
    popularFor: "Jurerê Internacional, Campeche, Lagoa da Conceição",
    tag: "Capital & Natureza"
  },
  {
    id: "balneario-camboriu",
    name: "Balneário Camboriú",
    lat: -26.9931,
    lng: -48.6343,
    zoom: 13,
    propertiesCount: 512,
    averagePrice: "R$ 4.5M",
    description: "Conhecida como a 'Dubai Brasileira', possui os maiores arranha-céus da América Latina e alta valorização imobiliária.",
    popularFor: "Barra Sul, Avenida Atlântica, Praia dos Amores",
    tag: "Luxo & Arranha-céus"
  },
  {
    id: "itapema",
    name: "Itapema",
    lat: -27.0898,
    lng: -48.6133,
    zoom: 12.5,
    propertiesCount: 284,
    averagePrice: "R$ 1.8M",
    description: "Uma das cidades que mais cresce no estado, com praias calmas, águas cristalinas e excelente infraestrutura familiar.",
    popularFor: "Meia Praia, Canto da Praia, Centro",
    tag: "Crescimento & Família"
  },
  {
    id: "bombinhas",
    name: "Bombinhas",
    lat: -27.1508,
    lng: -48.5165,
    zoom: 13,
    propertiesCount: 156,
    averagePrice: "R$ 1.1M",
    description: "A capital do mergulho ecológico, com praias de preservação ambiental, costões e mar calmo.",
    popularFor: "Praia de Bombas, Mariscal, Sepultura",
    tag: "Ecoturismo & Mergulho"
  },
  {
    id: "imbituba",
    name: "Imbituba",
    lat: -28.2400,
    lng: -48.6703,
    zoom: 11.5,
    propertiesCount: 98,
    averagePrice: "R$ 850k",
    description: "Reduto da Baleia Franca e paraíso dos surfistas, com praias selvagens e lagoas preservadas.",
    popularFor: "Praia do Rosa, Ibiraquera, Vila Nova",
    tag: "Surf & Baleias"
  }
];

export const SANTA_CATARINA_CENTER = {
  lat: -27.24,
  lng: -50.21,
  zoom: 7.2
};
