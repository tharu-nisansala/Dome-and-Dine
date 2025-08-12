import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Users, Store, FileText, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Manage Users",
      icon: <Users className="h-4 w-4" />,
      onClick: () => {
        navigate("/admin/manage-users");
      },
      color: "bg-blue-500"
    },
    {
      title: "Manage Shops",
      icon: <Store className="h-4 w-4" />,
      onClick: () => {
        navigate("/admin/manage-shops");
      },
      color: "bg-green-500"
    },
    {
      title: "View Reports",
      icon: <FileText className="h-4 w-4" />,
      onClick: () => {
        navigate("/admin/view-reports");
      },
      color: "bg-purple-500"
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => {
        navigate("/admin/settings");
      },
      color: "bg-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              className={`w-full h-24 flex flex-col items-center justify-center gap-2 hover:${action.color} hover:text-white transition-all duration-300`}
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-sm font-medium">{action.title}</span>
            </Button>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};