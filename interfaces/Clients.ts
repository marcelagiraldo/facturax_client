export interface StandardResponseDAO {
  status: number;
  message: string;
}

export interface GetClientsServiceDAO extends StandardResponseDAO {
  data: ClientDAO[];
}

export interface ClientDAO {
  numero_documento: string
  nombre: string
  direccion: string
  telefono: string
  
}
