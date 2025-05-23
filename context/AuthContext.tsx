import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface AuthState {
  token: string | null;
  authenticated: boolean;
  loading: boolean;
}

interface AuthProps {
  authState: AuthState;
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}


const TOKEN_KEY = "my-jwt";
export const API_URL = "https://facturax.lat/api";
const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: false, loading: true },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean;
    loading: boolean;
  }>({
    token: null,
    authenticated: false,
    loading: true, // al inicio se está cargando
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token,
          authenticated: true,
          loading: false,
        });
      } else {
        setAuthState({
          token: null,
          authenticated: false,
          loading: false,
        });
      }
    };

    loadToken();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      return await axios.post(`${API_URL}/usuarios/register`, {
        email,
        password,
      });
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/usuarios/login`, {
        email,
        password,
      });
      console.log("~file: AuthContext.tsx:41 ~ login ~ result: ", result.data);

      setAuthState({
        token: null,
        authenticated: false,
        loading: false,
      });

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${result.data.token}`;

      await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
      await AsyncStorage.setItem("@userData", JSON.stringify(result.data.user));
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log("Verificando token guardado:", storedToken);
      return result;
    } catch (error) {
      return { error: true, msg: (error as any).response.data.msg };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";

    setAuthState({
      token: null,
      authenticated: false,
      loading: false,
    });
  };

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
