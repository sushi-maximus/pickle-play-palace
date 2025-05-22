
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, ChevronRight, LayoutDashboard, Users, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Define breadcrumb items for the dashboard page
  const breadcrumbItems = [{ label: "Dashboard" }];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <motion.h1 
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Dashboard
            </motion.h1>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button variant="outline" size="sm" className="hover-scale">
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days
              </Button>
              <CreateGroupDialog 
                trigger={
                  <Button size="sm" className="hover-scale">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                }
              />
            </motion.div>
          </div>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-card border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Games Played
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">+3 from last week</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border-2 border-transparent hover:border-secondary/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Skill Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{profile?.dupr_rating || "N/A"}</div>
                    <div className="p-2 bg-secondary/10 rounded-full">
                      <LayoutDashboard className="h-5 w-5 text-secondary" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">Level: {profile?.skill_level || "Beginner"}</div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-card border-2 border-transparent hover:border-pickle-500/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Community Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">38</div>
                    <div className="p-2 bg-pickle-500/10 rounded-full">
                      <Users className="h-5 w-5 text-pickle-500" />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">+5 new this month</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Content Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            {/* Recent Activities */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your latest pickleball matches and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Doubles Match at Central Park", "Skills Workshop", "Mixed Doubles Tournament"].map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors duration-200 cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                      >
                        <div>
                          <div className="font-medium">{item}</div>
                          <div className="text-sm text-muted-foreground">{new Date(2025, 4, 20-i).toLocaleDateString()}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events you've registered for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["Spring Tournament", "Weekly League Play", "Skills Assessment"].map((item, i) => (
                      <motion.div 
                        key={i} 
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors duration-200 cursor-pointer"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 * i }}
                      >
                        <div>
                          <div className="font-medium">{item}</div>
                          <div className="text-sm text-muted-foreground">{new Date(2025, 5, 5+i).toLocaleDateString()}</div>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-2 h-8 w-8 hover:bg-secondary/10 hover:text-secondary transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
