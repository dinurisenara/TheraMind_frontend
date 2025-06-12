
export interface User {
  id: string;
  email: string;
  name: string;
  // …any other fields your backend returns…
}
export interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn(email: string, password: string): Promise<void>;
 signUp(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}
