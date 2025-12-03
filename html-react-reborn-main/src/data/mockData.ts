export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  estado: string;
  status: 'Em serviço' | 'Em manutenção' | 'Fora de serviço';
  quilometragem: string;
  combustivel: string;
  ano: number;
  tipoVeiculo: string;
  tipoCarroceria: string;
  capacidade: string;
  condicao: string;
  dataAquisicao: string;
  cor: string;
  potencia: string;
  estadoUF: string;
  imageSrc: string | null;
}

export interface Driver {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  categoriaCNH: string;
  validadeCNH: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  status: 'Disponível' | 'Em serviço' | 'Fora de serviço';
  imageSrc: string | null;
}

export const initialVehicles: Vehicle[] = [
  {
    id: 1,
    placa: 'SGF1525',
    modelo: 'KANGOO',
    marca: 'RENAULT',
    estado: 'Madeira',
    status: 'Em serviço',
    quilometragem: '100.654',
    combustivel: 'Diesel',
    ano: 2021,
    tipoVeiculo: 'van',
    tipoCarroceria: 'van',
    capacidade: '1000kg',
    condicao: 'proprio',
    dataAquisicao: '2021-01-15',
    cor: 'Preto',
    potencia: '75 CV',
    estadoUF: 'SP',
    imageSrc: 'https://picsum.photos/seed/renault-kangoo-van/300/200'
  },
  {
    id: 2,
    placa: 'ABC1234',
    modelo: 'TRANSIT',
    marca: 'FORD',
    estado: 'São Paulo',
    status: 'Em serviço',
    quilometragem: '85.320',
    combustivel: 'Diesel',
    ano: 2020,
    tipoVeiculo: 'van',
    tipoCarroceria: 'van',
    capacidade: '1200kg',
    condicao: 'proprio',
    dataAquisicao: '2020-05-10',
    cor: 'Branco',
    potencia: '85 CV',
    estadoUF: 'SP',
    imageSrc: 'https://picsum.photos/seed/ford-transit-van/300/200'
  },
  {
    id: 3,
    placa: 'XYZ5678',
    modelo: 'SAVEIRO',
    marca: 'VOLKSWAGEN',
    estado: 'Rio de Janeiro',
    status: 'Em manutenção',
    quilometragem: '45.780',
    combustivel: 'Gasolina',
    ano: 2022,
    tipoVeiculo: 'carro',
    tipoCarroceria: 'picape',
    capacidade: '650kg',
    condicao: 'proprio',
    dataAquisicao: '2022-03-20',
    cor: 'Prata',
    potencia: '128 CV',
    estadoUF: 'RJ',
    imageSrc: 'https://picsum.photos/seed/volkswagen-saveiro/300/200'
  },
  {
    id: 4,
    placa: 'DEF9012',
    modelo: 'SPRINTER',
    marca: 'MERCEDES-BENZ',
    estado: 'Minas Gerais',
    status: 'Fora de serviço',
    quilometragem: '150.200',
    combustivel: 'Diesel',
    ano: 2019,
    tipoVeiculo: 'van',
    tipoCarroceria: 'van',
    capacidade: '1500kg',
    condicao: 'proprio',
    dataAquisicao: '2019-08-15',
    cor: 'Azul',
    potencia: '143 CV',
    estadoUF: 'MG',
    imageSrc: 'https://picsum.photos/seed/mercedes-sprinter/300/200'
  }
];

export const initialDrivers: Driver[] = [
  {
    id: 1,
    nome: 'João Silva Santos',
    cpf: '123.456.789-00',
    cnh: '12345678901',
    categoriaCNH: 'B',
    validadeCNH: '2025-06-15',
    dataNascimento: '1985-03-10',
    telefone: '(11) 98765-4321',
    email: 'joao.silva@email.com',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    status: 'Disponível',
    imageSrc: 'https://picsum.photos/seed/driver-joao/300/300'
  },
  {
    id: 2,
    nome: 'Maria Santos Oliveira',
    cpf: '234.567.890-11',
    cnh: '23456789012',
    categoriaCNH: 'B',
    validadeCNH: '2024-08-20',
    dataNascimento: '1980-05-15',
    telefone: '(11) 91234-5678',
    email: 'maria.santos@email.com',
    endereco: 'Av. Paulista, 456',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    status: 'Em serviço',
    imageSrc: 'https://picsum.photos/seed/driver-maria/300/300'
  },
  {
    id: 3,
    nome: 'Carlos Pereira Souza',
    cpf: '345.678.901-22',
    cnh: '34567890123',
    categoriaCNH: 'C',
    validadeCNH: '2026-12-10',
    dataNascimento: '1975-11-22',
    telefone: '(11) 99876-5432',
    email: 'carlos.pereira@email.com',
    endereco: 'Rua Augusta, 789',
    bairro: 'Consolação',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01304-000',
    status: 'Fora de serviço',
    imageSrc: 'https://picsum.photos/seed/driver-carlos/300/300'
  },
  {
    id: 4,
    nome: 'Ana Costa Lima',
    cpf: '456.789.012-33',
    cnh: '45678901234',
    categoriaCNH: 'B',
    validadeCNH: '2025-03-05',
    dataNascimento: '1988-07-30',
    telefone: '(11) 97654-3210',
    email: 'ana.costa@email.com',
    endereco: 'Rua Oscar Freire, 321',
    bairro: 'Jardins',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01426-001',
    status: 'Disponível',
    imageSrc: 'https://picsum.photos/seed/driver-ana/300/300'
  }
];

export const marcasVeiculos = [
  'RENAULT', 'FORD', 'VOLKSWAGEN', 'MERCEDES-BENZ', 'PEUGEOT', 
  'CITROEN', 'OPEL', 'NISSAN', 'TOYOTA', 'HONDA'
];

export const tiposVeiculo = [
  { value: 'carro', label: 'Carro' },
  { value: 'van', label: 'Van' },
  { value: 'onibus', label: 'Ônibus' },
  { value: 'caminhao', label: 'Caminhão' }
];

export const tiposCarroceria = [
  { value: 'hatch', label: 'Hatch' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'perua', label: 'Perua' },
  { value: 'van', label: 'Van' },
  { value: 'picape', label: 'Picape' }
];

export const estadosBrasileiros = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

export const categoriasCNH = ['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'];
