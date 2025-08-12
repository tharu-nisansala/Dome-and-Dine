import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Icons } from "../../components/ui/icons";
import { auth, db } from "../../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { generateAdminCode } from "../../utils/adminUtils";

interface AdminAuthFormProps {
  isSignUp?: boolean;
}

export function AdminAuthForm({ isSignUp = false }: AdminAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Generate a unique admin code for new admin registration
        const adminCode = generateAdminCode();
        setGeneratedCode(adminCode);
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Store admin data with the generated verification code
        await addDoc(collection(db, "admins"), {
          uid: userCredential.user.uid,
          email: email,
          role: "admin",
          verificationCode: adminCode,
          createdAt: new Date(),
        });

        toast.success("Admin account created successfully!");
        toast.info(`Your admin verification code is: ${adminCode}`);
        toast.warning("Please save this code! You'll need it to log in.", {
          duration: 6000,
        });
      } else {
        // Login flow
        if (!verificationCode) {
          toast.error("Verification code is required");
          setIsLoading(false);
          return;
        }

        // First verify if the verification code exists and matches
        const adminQuery = query(
          collection(db, "admins"),
          where("email", "==", email),
          where("verificationCode", "==", verificationCode)
        );
        
        const adminDocs = await getDocs(adminQuery);
        
        if (adminDocs.empty) {
          toast.error("Invalid verification code");
          setIsLoading(false);
          return;
        }

        // If verification code is valid, proceed with login
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Logged in successfully");
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast.error(error.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!isSignUp && (
              <Input
                type="text"
                placeholder="Admin Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
              />
            )}
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Create Admin Account" : "Sign In"}
          </Button>
        </div>
      </form>
      
      {isSignUp && generatedCode && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important: Save Your Verification Code</h3>
          <p className="text-yellow-700 mb-2">Your admin verification code is:</p>
          <div className="bg-white p-3 rounded border border-yellow-300 text-center font-mono text-lg">
            {generatedCode}
          </div>
          <p className="text-sm text-yellow-600 mt-2">
            ⚠️ Please save this code securely. You will need it to log in to your admin account.
          </p>
        </div>
      )}
    </div>
  );
}
