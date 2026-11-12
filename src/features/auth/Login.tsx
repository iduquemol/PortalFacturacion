import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import loginBg from '@/assets/LoginBG.jpg';
import logoNaranja from '@/assets/Logo2.svg';

interface LoginProps {
    onLogin: (user: { usuario: string; password: string }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        onLogin({ usuario: email, password });
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${loginBg})` }}
                ></div>
                
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center w-full px-16 lg:px-20">
                    {/* Logo */}
                    <div className="mb-12">
                        <img 
                            src={logoNaranja} 
                            alt="Astil Logo" 
                            className="h-32 w-auto"
                        />
                    </div>

                    {/* Welcome Text */}
                    <div className="max-w-xl">
                        <h1 className="text-4xl lg:text-5xl font-normal text-white mb-6 leading-tight">
                            Bienvenido a Astil.
                        </h1>
                        <p className="text-xl text-white/90 leading-relaxed">
                            Optimiza y controla el ecosistema completo de facturación de tu empresa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#FAF9F6]">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <img 
                            src={logoNaranja} 
                            alt="Astil Logo" 
                            className="h-12 w-auto mx-auto"
                        />
                    </div>

                    {/* Login Card */}
                    <Card className="border-0 shadow-lg bg-white rounded-2xl">
                        <form onSubmit={handleSubmit}>
                            <CardHeader className="space-y-2 pb-6 px-10 pt-10">
                                <h2 className="text-2xl font-bold text-[#1F2937]">Iniciar Sesión</h2>
                                <p className="text-sm text-gray-600">
                                    Ingresa tus credenciales para acceder
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-6 px-10">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[#2D3748] font-medium">
                                        Usuario
                                    </Label>
                                    <Input
                                        id="email"
                                        type="text"
                                        placeholder="Ingresa tu usuario"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="h-11 border-[#E5E7EB] focus:border-[#FF5733] focus:ring-[#FF5733]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[#2D3748] font-medium">
                                        Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Ingresa tu contraseña"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-11 border-[#E5E7EB] focus:border-[#FF5733] focus:ring-[#FF5733]"
                                    />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="mr-2 h-4 w-4 rounded border-gray-300 text-[#FF5733] focus:ring-[#FF5733]"
                                        />
                                        <span className="text-gray-600">Recordarme</span>
                                    </label>
                                    <a href="#" className="text-[#FF5733] hover:text-[#FF6347] font-medium">
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 px-10 pb-10">
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-[#FF5733] hover:bg-[#FF6347] text-white font-medium rounded-lg transition-colors"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Footer */}
                    <div className="text-center mt-8 text-sm text-gray-500">
                        <p>© 2026 It Qualis. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;