import React from "react";
import { Activity, Settings, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AdminHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md overflow-hidden"
    >
      <div className="p-6 sm:p-8">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary animate-pulse" />
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Manage your platform's content and monitor activity in real-time
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4 text-primary" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
            
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
              <Settings className="h-4 w-4 text-primary animate-spin-slow" />
              <span className="text-primary font-medium hidden sm:inline">Admin Control Panel</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};