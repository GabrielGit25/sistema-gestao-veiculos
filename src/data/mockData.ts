export interface VehicleFotos {
  dianteira: string | null;
  lateralDireita: string | null;
  lateralEsquerda: string | null;
  traseira: string | null;
  painelInstrumentos: string | null;
  cambio: string | null;
  painel: string | null;
  motor: string | null;
  pneuDianteiroDireito: string | null;
  pneuDianteiroEsquerdo: string | null;
  pneuTraseiroDireito: string | null;
  pneuTraseiroEsquerdo: string | null;
}

export interface VehicleDocumento {
  id: string;
  nome: string;
  tipo: string;
  dataUpload: string;
  arquivo: string | null;
  descricao?: string;
}

export interface Vehicle {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  estado: string;
  motorista: string;
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
  fotos?: VehicleFotos;
  documentos?: VehicleDocumento[];
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
  veiculo: string;
  status: 'Disponível' | 'Em serviço' | 'Fora de serviço';
  imageSrc: string | null;
}

export interface VehicleAlert {
  id: number;
  vehicleId: number;
  tipo: 'troca_oleo' | 'bateria' | 'pneu' | 'revisao' | 'documento' | 'outro';
  descricao: string;
  dataCriacao: string;
  dataExpiracao: string;
  dataConclusao: string | null;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'concluido' | 'expirado';
  observacoes?: string;
}

export const initialVehicles: Vehicle[] = [
  {
    id: 1,
    placa: 'SGF1525',
    modelo: 'KANGOO',
    marca: 'RENAULT',
    estado: 'Madeira',
    motorista: 'João Silva',
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
    imageSrc: 'https://picsum.photos/seed/renault-kangoo-van/300/200',
    fotos: {
      dianteira: null,
      lateralDireita: null,
      lateralEsquerda: null,
      traseira: null,
      painelInstrumentos: null,
      cambio: null,
      painel: null,
      motor: null,
      pneuDianteiroDireito: null,
      pneuDianteiroEsquerdo: null,
      pneuTraseiroDireito: null,
      pneuTraseiroEsquerdo: null
    }
  },
  {
    id: 2,
    placa: 'ABC1234',
    modelo: 'TRANSIT',
    marca: 'FORD',
    estado: 'São Paulo',
    motorista: 'Maria Santos',
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
    imageSrc: 'https://picsum.photos/seed/ford-transit-van/300/200',
    fotos: {
      dianteira: null,
      lateralDireita: null,
      lateralEsquerda: null,
      traseira: null,
      painelInstrumentos: null,
      cambio: null,
      painel: null,
      motor: null,
      pneuDianteiroDireito: null,
      pneuDianteiroEsquerdo: null,
      pneuTraseiroDireito: null,
      pneuTraseiroEsquerdo: null
    }
  },
  {
    id: 3,
    placa: 'XYZ5678',
    modelo: 'SAVEIRO',
    marca: 'VOLKSWAGEN',
    estado: 'Rio de Janeiro',
    motorista: 'Ana Costa',
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
    imageSrc: 'https://picsum.photos/seed/volkswagen-saveiro/300/200',
    fotos: {
      dianteira: null,
      lateralDireita: null,
      lateralEsquerda: null,
      traseira: null,
      painelInstrumentos: null,
      cambio: null,
      painel: null,
      motor: null,
      pneuDianteiroDireito: null,
      pneuDianteiroEsquerdo: null,
      pneuTraseiroDireito: null,
      pneuTraseiroEsquerdo: null
    }
  },
  {
    id: 4,
    placa: 'DEF9012',
    modelo: 'SPRINTER',
    marca: 'MERCEDES-BENZ',
    estado: 'Minas Gerais',
    motorista: '-',
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
    imageSrc: 'https://picsum.photos/seed/mercedes-sprinter/300/200',
    fotos: {
      dianteira: null,
      lateralDireita: null,
      lateralEsquerda: null,
      traseira: null,
      painelInstrumentos: null,
      cambio: null,
      painel: null,
      motor: null,
      pneuDianteiroDireito: null,
      pneuDianteiroEsquerdo: null,
      pneuTraseiroDireito: null,
      pneuTraseiroEsquerdo: null
    }
  }
];

export const initialDrivers: Driver[] = [
  {
    id: 1,
    nome: 'João Silva',
    cpf: '123.456.789-00',
    cnh: '123456789',
    categoriaCNH: 'B',
    validadeCNH: '2025-12-31',
    dataNascimento: '1985-05-15',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    endereco: 'Rua das Flores, 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
    veiculo: 'SGF1525',
    status: 'Em serviço',
    imageSrc: null
  },
  {
    id: 2,
    nome: 'Maria Santos',
    cpf: '987.654.321-00',
    cnh: '987654321',
    categoriaCNH: 'B',
    validadeCNH: '2024-06-30',
    dataNascimento: '1990-08-20',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    endereco: 'Av. Paulista, 1000',
    bairro: 'Bela Vista',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    veiculo: 'ABC1234',
    status: 'Em serviço',
    imageSrc: null
  },
  {
    id: 3,
    nome: 'Ana Costa',
    cpf: '456.789.123-00',
    cnh: '456789123',
    categoriaCNH: 'B',
    validadeCNH: '2023-09-15',
    dataNascimento: '1988-12-10',
    telefone: '(21) 77777-7777',
    email: 'ana@email.com',
    endereco: 'Rua do Ouvidor, 50',
    bairro: 'Centro',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '20040-030',
    veiculo: 'XYZ5678',
    status: 'Em serviço',
    imageSrc: null
  }
];

export const initialAlerts: VehicleAlert[] = [
  {
    id: 1,
    vehicleId: 1,
    tipo: 'troca_oleo',
    descricao: 'Troca de óleo do motor',
    dataCriacao: '2024-12-01',
    dataExpiracao: '2024-12-15',
    dataConclusao: null,
    prioridade: 'alta',
    status: 'expirado',
    observacoes: 'Óleo precisa ser trocado urgentemente'
  },
  {
    id: 2,
    vehicleId: 1,
    tipo: 'bateria',
    descricao: 'Verificação da bateria',
    dataCriacao: '2024-12-05',
    dataExpiracao: '2024-12-20',
    dataConclusao: null,
    prioridade: 'media',
    status: 'pendente',
    observacoes: 'Bateria com 2 anos de uso'
  },
  {
    id: 3,
    vehicleId: 2,
    tipo: 'pneu',
    descricao: 'Rotação dos pneus',
    dataCriacao: '2024-12-10',
    dataExpiracao: '2024-12-25',
    dataConclusao: null,
    prioridade: 'media',
    status: 'pendente'
  },
  {
    id: 4,
    vehicleId: 3,
    tipo: 'revisao',
    descricao: 'Revisão geral 45.000 km',
    dataCriacao: '2024-12-08',
    dataExpiracao: '2024-12-22',
    dataConclusao: null,
    prioridade: 'alta',
    status: 'pendente'
  },
  {
    id: 5,
    vehicleId: 4,
    tipo: 'documento',
    descricao: 'Vencimento do licenciamento',
    dataCriacao: '2024-12-03',
    dataExpiracao: '2024-12-09',
    dataConclusao: null,
    prioridade: 'alta',
    status: 'expirado',
    observacoes: 'Licenciamento vence hoje'
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

export const categoriasCNH = [
  { value: 'A', label: 'A - Motocicleta' },
  { value: 'B', label: 'B - Automóvel' },
  { value: 'C', label: 'C - Caminhão' },
  { value: 'D', label: 'D - Ônibus' },
  { value: 'E', label: 'E - Reboque' }
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