import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginFormContainer } from "./login/LoginFormContainer";
import RegisterForm from "./RegisterForm";
import { useNavigate } from "react-router-dom";

interface AuthTabsProps {
    defaultTab?: "login" | "register";
}

const AuthTabs = ({ defaultTab = "login" }: AuthTabsProps) => {
    const navigate = useNavigate();

    const handleRegisterSuccess = () => {
        navigate("/login");
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white rounded-xl shadow-lg">
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                    <LoginFormContainer />
                </TabsContent>
                <TabsContent value="register" className="space-y-4">
                    <RegisterForm onSuccess={handleRegisterSuccess} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AuthTabs;